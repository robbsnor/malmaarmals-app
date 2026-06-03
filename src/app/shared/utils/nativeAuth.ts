import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import type { Session } from '@supabase/supabase-js';
import router from '../../../router/router';
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';

const HANDLED_NATIVE_AUTH_URL_KEY = 'malmaarmals_handled_native_auth_url';

let isHandlingNativeAuthUrl = false;

function getParamsFromUrl(nativeUrl: string) {
    const url = new URL(nativeUrl);

    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
    const searchParams = url.searchParams;

    return {
        accessToken: hashParams.get('access_token') || searchParams.get('access_token'),
        refreshToken: hashParams.get('refresh_token') || searchParams.get('refresh_token'),
        providerToken: hashParams.get('provider_token') || searchParams.get('provider_token'),
        providerRefreshToken:
            hashParams.get('provider_refresh_token') || searchParams.get('provider_refresh_token'),
        code: hashParams.get('code') || searchParams.get('code'),
        error: hashParams.get('error') || searchParams.get('error'),
        errorDescription: hashParams.get('error_description') || searchParams.get('error_description'),
    };
}

function getRouteFromNativeUrl(nativeUrl: string) {
    const url = new URL(nativeUrl);

    if (url.protocol === 'malmaarmals:') {
        const path = `/${url.hostname}${url.pathname}`;
        return `${path}${url.search}${url.hash}`;
    }

    if (url.hostname === 'www.malmaarmals.nl' || url.hostname === 'malmaarmals.nl') {
        return `${url.pathname}${url.search}${url.hash}`;
    }

    return null;
}

function storeTwitchProviderTokens(params: ReturnType<typeof getParamsFromUrl>, session?: Session | null) {
    const authStore = useAuthStore();

    if (session?.provider_token) {
        authStore.twitchAccessToken = session.provider_token;
    }

    if (session?.provider_refresh_token) {
        authStore.twitchRefreshToken = session.provider_refresh_token;
    }

    if (params.providerToken) {
        authStore.twitchAccessToken = params.providerToken;
    }

    if (params.providerRefreshToken) {
        authStore.twitchRefreshToken = params.providerRefreshToken;
    }

    console.log('Native Twitch token state:', {
        hasProviderToken: !!params.providerToken || !!session?.provider_token,
        hasProviderRefreshToken: !!params.providerRefreshToken || !!session?.provider_refresh_token,
        hasStoredAccessToken: !!authStore.twitchAccessToken,
        hasStoredRefreshToken: !!authStore.twitchRefreshToken,
    });
}

async function finishNativeLogin(params: ReturnType<typeof getParamsFromUrl>, session?: Session | null) {
    const authStore = useAuthStore();

    await authStore.mirrorSession();

    storeTwitchProviderTokens(params, session);

    await router.replace({ name: 'profile' });

    window.setTimeout(() => {
        authStore.updateIsSubscribed().catch((error) => {
            console.error('Native subscription check failed:', error);
        });
    }, 1000);
}

async function handleNativeAuthUrl(nativeUrl: string) {
    if (isHandlingNativeAuthUrl) {
        console.log('Native auth is already being handled, skipping.');
        return;
    }

    isHandlingNativeAuthUrl = true;

    try {
        const params = getParamsFromUrl(nativeUrl);
        const isAuthRedirect =
            !!params.accessToken || !!params.refreshToken || !!params.providerToken || !!params.code || !!params.error;

        if (isAuthRedirect) {
            const lastHandledUrl = window.localStorage.getItem(HANDLED_NATIVE_AUTH_URL_KEY);

            if (lastHandledUrl === nativeUrl) {
                console.log('Native auth URL already handled after app restart, finishing login state.');
                await finishNativeLogin(params);
                return;
            }
        }

        if (params.error) {
            console.error('Native auth error:', params.error, params.errorDescription);
            await router.replace({ name: 'profile' });
            return;
        }

        if (params.accessToken && params.refreshToken) {
            const { data, error } = await supabase.auth.setSession({
                access_token: params.accessToken,
                refresh_token: params.refreshToken,
            });

            if (error) {
                console.error('Failed to set native auth session:', error);
                await router.replace({ name: 'profile' });
                return;
            }

            window.localStorage.setItem(HANDLED_NATIVE_AUTH_URL_KEY, nativeUrl);

            await finishNativeLogin(params, data.session);
            return;
        }

        if (params.code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);

            if (error) {
                console.error('Failed to exchange native auth code:', error);
                await router.replace({ name: 'profile' });
                return;
            }

            window.localStorage.setItem(HANDLED_NATIVE_AUTH_URL_KEY, nativeUrl);

            await finishNativeLogin(params, data.session);
            return;
        }

        const route = getRouteFromNativeUrl(nativeUrl);

        if (route === '/auth/callback') {
            await router.replace({ name: 'profile' });
            return;
        }

        if (route) {
            await router.replace(route);
        }
    } finally {
        isHandlingNativeAuthUrl = false;
    }
}

export function setupNativeAuth() {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    CapacitorApp.addListener('appUrlOpen', (event) => {
        handleNativeAuthUrl(event.url);
    });

    CapacitorApp.getLaunchUrl().then((launchUrl) => {
        if (launchUrl?.url) {
            handleNativeAuthUrl(launchUrl.url);
        }
    });
}