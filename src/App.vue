<script setup lang="ts">
import { useRenderStore } from 'stores/renderStore';

import { onMounted, onUnmounted } from 'vue';

defineOptions({
  name: 'App'
});

const renderStore = useRenderStore();
const { centerImage } = renderStore;

let orientationType: OrientationType | undefined = undefined;

const handleOrientationChange = () => {
  if (window.screen.orientation.type !== orientationType) {
    orientationType = window.screen.orientation.type;
    setTimeout(centerImage, 250);
  }
};

onMounted(() => {
  if ('screen' in window && 'orientation' in window.screen) {
    window.screen.orientation.addEventListener('change', handleOrientationChange);
  }
});

onUnmounted(() => {
  if ('screen' in window && 'orientation' in window.screen) {
    window.screen.orientation.removeEventListener('change', handleOrientationChange);
  }
});
</script>

<template>
  <router-view />
</template>

<style>
</style>