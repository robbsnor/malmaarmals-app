package nl.malmaarmals.app;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebChromeClient;
import android.widget.FrameLayout;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
    private View customView;
    private WebChromeClient.CustomViewCallback customViewCallback;
    private FrameLayout fullscreenContainer;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean isHidingFullscreen = false;

    private final View.OnAttachStateChangeListener customViewAttachListener =
        new View.OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View view) {
                // No action needed.
            }

            @Override
            public void onViewDetachedFromWindow(View view) {
                if (!isHidingFullscreen && view == customView) {
                    mainHandler.post(() -> hideFullscreenVideo(false));
                }
            }
        };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        lockAppToPortrait();
        setupFullscreenVideoSupport();
        enableImmersiveMode();
    }

    private void setupFullscreenVideoSupport() {
        if (bridge == null || bridge.getWebView() == null) {
            return;
        }

        bridge.getWebView().setWebChromeClient(new BridgeWebChromeClient(bridge) {
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (customView != null) {
                    callback.onCustomViewHidden();
                    return;
                }

                customView = view;
                customViewCallback = callback;
                customView.addOnAttachStateChangeListener(customViewAttachListener);

                fullscreenContainer = new FrameLayout(MainActivity.this);
                fullscreenContainer.setBackgroundColor(android.graphics.Color.BLACK);
                fullscreenContainer.addView(
                    customView,
                    new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                );

                FrameLayout decorView = (FrameLayout) getWindow().getDecorView();
                decorView.addView(
                    fullscreenContainer,
                    new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                );

                bridge.getWebView().setVisibility(View.GONE);

                lockPlayerToLandscape();
                enableImmersiveMode();
            }

            @Override
            public void onHideCustomView() {
                hideFullscreenVideo(false);
            }
        });
    }

    private void hideFullscreenVideo(boolean notifyCallback) {
        if (customView == null) {
            lockAppToPortrait();
            enableImmersiveMode();
            return;
        }

        isHidingFullscreen = true;

        try {
            customView.removeOnAttachStateChangeListener(customViewAttachListener);

            FrameLayout decorView = (FrameLayout) getWindow().getDecorView();

            if (fullscreenContainer != null) {
                fullscreenContainer.removeView(customView);
                decorView.removeView(fullscreenContainer);
            }

            customView = null;
            fullscreenContainer = null;

            if (customViewCallback != null && notifyCallback) {
                customViewCallback.onCustomViewHidden();
            }

            customViewCallback = null;

            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().setVisibility(View.VISIBLE);
            }

            lockAppToPortrait();
            enableImmersiveMode();

            mainHandler.postDelayed(() -> {
                if (customView == null) {
                    lockAppToPortrait();
                    enableImmersiveMode();
                }
            }, 300);
        } finally {
            isHidingFullscreen = false;
        }
    }

    private void lockAppToPortrait() {
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    private void lockPlayerToLandscape() {
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
    }

    @Override
    public void onBackPressed() {
        if (customView != null) {
            hideFullscreenVideo(true);
            return;
        }

        lockAppToPortrait();
        super.onBackPressed();
    }

    @Override
    public void onResume() {
        super.onResume();

        if (customView == null) {
            lockAppToPortrait();
        }

        enableImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);

        if (hasFocus) {
            if (customView == null) {
                lockAppToPortrait();
            }

            enableImmersiveMode();
        }
    }

    private void enableImmersiveMode() {
        Window window = getWindow();

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);

            if (window.getInsetsController() != null) {
                window.getInsetsController().hide(
                    WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars()
                );

                window.getInsetsController().setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } else {
            window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }
}