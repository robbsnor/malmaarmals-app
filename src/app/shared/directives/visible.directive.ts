// directives/visibleTransition.ts
import type { Directive } from 'vue';

export const visible: Directive<HTMLElement, boolean> = {
    mounted(el, binding) {
        // Base transition classes
        el.classList.add('invisible', 'opacity-0', 'transition-all');

        // Apply visible classes if the condition is initially true
        if (binding.value) {
            el.classList.add('visible', 'opacity-100');
            el.classList.remove('invisible', 'opacity-0');
        }
    },
    updated(el, binding) {
        // When the bound value changes
        if (binding.value) {
            el.classList.add('visible', 'opacity-100');
            el.classList.remove('invisible', 'opacity-0');
        } else {
            el.classList.add('invisible', 'opacity-0');
            el.classList.remove('visible', 'opacity-100');
        }
    },
};
