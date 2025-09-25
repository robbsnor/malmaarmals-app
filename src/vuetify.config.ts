import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export const vuetify = createVuetify({
    defaults: {
        global: {
            flat: true,
            ripple: false,
        },
        VBtn: {
            // variant: 'tonal',
            // color: 'primary',
        },
        VBtnToggle: {
            // color: 'primary',
        },
        VCheckbox: {
            // color: 'primary',
        },
        VCombobox: {
            clearable: true,
            hideDetails: 'auto',
            variant: 'solo',
        },
        VDialog: {
            transition: 'slide-y-reverse-transition',
        },
        VImg: {
            // transition: '',
        },
        VMenu: {
            scrollStrategy: 'none',
        },
        VSelect: {
            clearable: true,
            hideDetails: 'auto',
            variant: 'solo',
        },
        VSwitch: {
            hideDetails: 'auto',
        },
        VTextField: {
            clearable: true,
            variant: 'solo',
        },
        VTooltip: {
            location: 'top',
        },
    },
    display: {
        thresholds: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
    theme: {
        defaultTheme: 'twitch-dashboard-dark',
        themes: {
            'twitch-dashboard-dark': {
                colors: {
                    background: '#000000',
                    primary: '#ca79a5',
                    secondary: 'hsl(168, 100%, 70%)',
                },
                dark: true,
            },
        },
    },
});
