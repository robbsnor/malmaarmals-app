import { ref } from 'vue';
import { sleep } from './sleep';

export const useBitch = () => {
    const loading = ref(false);
    const name = ref('');

    const init = async () => {
        loading.value = true;
        await sleep(2000);
        loading.value = false;
        name.value = 'Bitch';
    };

    init();

    return {
        loading,
        name,
    };
};
