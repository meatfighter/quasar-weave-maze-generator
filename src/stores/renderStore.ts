import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRenderStore = defineStore('render', () => {
    const url = ref('');
    const processing = ref(false);
    return { url, processing };
});