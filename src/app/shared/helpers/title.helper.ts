import { useTitle } from '@vueuse/core';

export class TitleHelper {
    public static setTitle(title: string) {
        const pageTitle = useTitle();
        pageTitle.value = `${title} | malmaarmals`;
    }
}
