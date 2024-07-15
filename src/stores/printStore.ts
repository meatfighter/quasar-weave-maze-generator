import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePrintStore = defineStore('print', () => {
    const printing = ref(false);

    return { printing };
});