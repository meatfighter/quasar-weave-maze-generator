<script setup lang="ts">
import { onMounted } from 'vue';
import { useRenderStore } from 'stores/renderStore';
import { storeToRefs } from 'pinia';
import { updateMaze } from 'src/app/controller/controller';

const renderStore = useRenderStore();
const { svgContainer, svgImage, processing } = storeToRefs(renderStore);

function onMouseDown() {
  if (svgImage.value) {
    svgImage.value.style.cursor = 'grabbing';
  }
}

function onMouseUp() {
  if (svgImage.value) {
    svgImage.value.style.cursor = 'grab';
  }
}

onMounted(() => {
  updateMaze(false);
});
</script>

<template>
  <div v-if="processing" class="flex flex-center items-center" style="width: 100%; height: 100%; overflow: hidden;">
    <q-spinner-grid color="primary" size="5em"/>
  </div>
  <div v-else ref="svgContainer" id="svgContainer" style="width: 100%; height: 100%; overflow: hidden;">
    <q-scroll-area style="width: 100%; height: 100%; overflow: hidden;">
      <img ref="svgImage" id="svgImage" src="" alt="maze" style="cursor: grab;"
           @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseleave="onMouseUp" />
    </q-scroll-area>
  </div>
</template>

<style scoped>
</style>