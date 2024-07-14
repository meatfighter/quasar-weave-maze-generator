import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSaveStore = defineStore('save', () => {
    const saving = ref(false);

    return { saving };
});