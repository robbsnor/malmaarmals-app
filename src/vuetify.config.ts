import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export const vuetify = createVuetify({
    defaults: {
        global: {
            flat: true,
            ripple: false,
        },
        VAutocomplete: {
            hideDetails: 'auto',
            variant: 'solo',
            density: 'comfortable',
        },
        VSelect: {
            clearable: true,
            hideDetails: 'auto',
            variant: 'solo',
            density: 'comfortable',
        },
        VCombobox: {
            clearable: true,
            hideDetails: 'auto',
            variant: 'solo',
            density: 'comfortable',
        },
        VTextField: {
            clearable: true,
            variant: 'solo',
            density: 'comfortable',
        },
        VNumberInput: {
            variant: 'solo',
            density: 'comfortable',
            hideDetails: 'auto',
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
        VDialog: {
            transition: 'slide-y-reverse-transition',
        },
        VImg: {
            // transition: '',
        },
        VMenu: {
            scrollStrategy: 'none',
        },
        VSwitch: {
            hideDetails: 'auto',
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
        defaultTheme: 'malmaarmals',
        themes: {
            malmaarmals: {
                colors: {
                    background: '#000',
                    primary: 'hsl(252, 100%, 64%)',
                    secondary: 'hsl(168, 100%, 70%)',
                },
                dark: true,
            },
        },
    },
});
