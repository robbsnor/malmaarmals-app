<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import PlayerButton from './PlayerButton.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { useVideoStore } from '../stores/video.store';
import { storeToRefs } from 'pinia';

const videoStore = useVideoStore();
const { src, videoRef, playing, currentTimeRounded, volume, muted } = storeToRefs(videoStore);

const copied = ref(false);
const showStopDialog = ref(false);

function stopCast() {
    castContext?.getCurrentSession()?.endSession(true);
}

// ─── Google Cast SDK (Chromecast) ─────────────────────────────────────────

let castContext: cast.framework.CastContext | null = null;
let remotePlayer: cast.framework.RemotePlayer | null = null;
let playerController: cast.framework.RemotePlayerController | null = null;
let isSyncing = false;

function initCastApi() {
    castContext = cast.framework.CastContext.getInstance();
    castContext.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    remotePlayer = new cast.framework.RemotePlayer();
    playerController = new cast.framework.RemotePlayerController(remotePlayer);

    // track connected state
    playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, () => {
        videoStore.casting = remotePlayer!.isConnected;
    });

    // remote → store: pause/play
    playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED, () => {
        if (isSyncing) return;
        isSyncing = true;
        videoStore.playing = !remotePlayer!.isPaused;
        isSyncing = false;
    });

    // remote → store: seek (only when difference is meaningful to avoid jitter)
    playerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, () => {
        if (isSyncing) return;
        const diff = Math.abs((remotePlayer!.currentTime ?? 0) - videoStore.currentTime);
        if (diff > 3) {
            isSyncing = true;
            videoStore.currentTime = remotePlayer!.currentTime ?? 0;
            isSyncing = false;
        }
    });

    // remote → store: volume
    playerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, () => {
        if (isSyncing) return;
        isSyncing = true;
        videoStore.volume = remotePlayer!.volumeLevel ?? 1;
        isSyncing = false;
    });

    // remote → store: mute
    playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED, () => {
        if (isSyncing) return;
        isSyncing = true;
        videoStore.muted = remotePlayer!.isMuted;
        isSyncing = false;
    });

    // session state for the cast button icon
    castContext.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (e) => {
        videoStore.casting =
            e.sessionState === cast.framework.SessionState.SESSION_STARTED ||
            e.sessionState === cast.framework.SessionState.SESSION_RESUMED;
    });
}

function loadCastSdk() {
    if (typeof cast !== 'undefined' && typeof chrome !== 'undefined' && (chrome as any).cast) {
        initCastApi();
        return;
    }
    (window as any).__onGCastApiAvailable = (isAvailable: boolean) => {
        if (isAvailable) initCastApi();
    };
    if (!document.querySelector('script[src*="cast_sender"]')) {
        const s = document.createElement('script');
        s.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        document.head.appendChild(s);
    }
}

async function castWithSdk() {
    if (!castContext || !src.value) return false;
    try {
        const session = castContext.getCurrentSession();
        if (!session) await castContext.requestSession();
        const activeSession = castContext.getCurrentSession();
        if (!activeSession) return false;

        const mediaInfo = new chrome.cast.media.MediaInfo(src.value, 'video/mp4');
        mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;

        const metadata = new chrome.cast.media.GenericMediaMetadata();
        metadata.title = videoStore.info?.title ?? 'Video';
        mediaInfo.metadata = metadata;

        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;
        request.currentTime = videoStore.currentTime; // start from current position

        const err = await activeSession.loadMedia(request);
        if (err) {
            console.error('[Cast] loadMedia error:', err);
            return false;
        }
        return true;
    } catch (e) {
        console.error('[Cast] castWithSdk error:', e);
        return false;
    }
}

// ─── store → remote: keep remote in sync when user uses local controls ────

watch(playing, (isPlaying) => {
    if (isSyncing || !playerController || !videoStore.casting) return;
    const shouldBePaused = !isPlaying;
    if (remotePlayer!.isPaused !== shouldBePaused) {
        isSyncing = true;
        playerController.playOrPause();
        isSyncing = false;
    }
});

watch(currentTimeRounded, (t) => {
    if (isSyncing || !remotePlayer || !playerController || !videoStore.casting) return;
    if (Math.abs(t - (remotePlayer.currentTime ?? 0)) > 3) {
        isSyncing = true;
        remotePlayer.currentTime = t;
        playerController.seek();
        isSyncing = false;
    }
});

watch(volume, (v) => {
    if (isSyncing || !remotePlayer || !playerController || !videoStore.casting) return;
    isSyncing = true;
    remotePlayer.volumeLevel = v;
    playerController.setVolumeLevel();
    isSyncing = false;
});

watch(muted, (m) => {
    if (isSyncing || !remotePlayer || !playerController || !videoStore.casting) return;
    isSyncing = true;
    remotePlayer.isMuted = m;
    playerController.muteOrUnmute();
    isSyncing = false;
});

// ─── AirPlay (Safari / iOS / macOS) ──────────────────────────────────────

function tryAirPlay(): boolean {
    const video = videoRef.value;
    if (video && typeof (video as any).webkitShowPlaybackTargetPicker === 'function') {
        (video as any).webkitShowPlaybackTargetPicker();
        return true;
    }
    return false;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────

onMounted(() => {
    loadCastSdk();

    videoRef.value?.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => {
        videoStore.casting = !!(videoRef.value as any)?.webkitCurrentPlaybackTargetIsWireless;
    });
});

onUnmounted(() => {
    playerController = null;
    remotePlayer = null;
});

// ─── Button handler ───────────────────────────────────────────────────────

async function openCast() {
    if (videoStore.casting) {
        showStopDialog.value = true;
        return;
    }

    if (castContext) {
        const ok = await castWithSdk();
        if (ok) return;
    }

    if (tryAirPlay()) return;
}
</script>

<template>
    <ConfirmDialog
        v-model="showStopDialog"
        title="Stop casting"
        description="Are you sure you want to stop casting to your TV?"
        icon="mdi-cast-off"
        :showBody="false"
        confirm-text="Stop casting"
        cancel-text="Keep casting"
        @confirm="stopCast"
    />

    <PlayerButton
        :icon="videoStore.casting ? 'mdi-cast-connected' : copied ? 'mdi-check' : 'mdi-cast'"
        :color="videoStore.casting ? 'primary' : copied ? 'success' : undefined"
        @click="openCast"
    />
</template>
