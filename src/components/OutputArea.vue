<script setup lang="ts">
import panzoom, { Transform } from 'panzoom';
import { onMounted, ref, watch } from 'vue';
import { useRenderStore } from 'stores/renderStore';
import { storeToRefs } from 'pinia';
import { updateMaze } from 'src/app/controller/maze-controller';

const svgContainer = ref<HTMLDivElement | null>(null);
const svgImage = ref<HTMLImageElement | null>(null);
const renderStore = useRenderStore();
const { url, processing } = storeToRefs(renderStore);

let lastWidth = 0;
let lastHeight = 0;
let lastTransform: Transform = { x: 0, y: 0, scale: 1 };

watch(url, () => {
  if (!svgImage.value) {
    return;
  }
  svgImage.value.style.visibility = 'hidden';
  svgImage.value.onload = () => {
    if (!(svgContainer.value && svgImage.value)) {
      return;
    }

    const containerRect = svgContainer.value.getBoundingClientRect();
    let w1 = svgImage.value.width;
    let h1 = svgImage.value.height;
    let w2 = svgImage.value.width;
    let h2 = svgImage.value.height;

    if (w1 > containerRect.width) {
        w1 = containerRect.width;
        h1 = w1 * svgImage.value.height / svgImage.value.width;
    }
    if (h1 > containerRect.height) {
      h1 = containerRect.height;
      w1 = h1 * svgImage.value.width / svgImage.value.height;
    }

    if (h2 > containerRect.height) {
      h2 = containerRect.height;
      w2 = h2 * svgImage.value.width / svgImage.value.height;
    }
    if (w2 > containerRect.width) {
      w2 = containerRect.width;
      h2 = w2 * svgImage.value.height / svgImage.value.width;
    }

    let width = w1;
    let height = h1;
    if (w2 > w1) {
        width = w2;
        height = h2;
    }

    const pz = panzoom(svgImage.value);
    if (lastWidth !== width || lastHeight !== height) {
      lastWidth = width;
      lastHeight = height;
      if (width !== svgImage.value.width) {
        pz.zoomTo(0, 0, width / svgImage.value.width);
      }
      pz.moveTo((containerRect.width - width) / 2, (containerRect.height - height) / 2);
    } else {
      pz.zoomTo(0, 0, lastTransform.scale);
      pz.moveTo(lastTransform.x, lastTransform.y);
    }
    lastTransform = pz.getTransform();
    svgImage.value.style.visibility = 'visible';
  };
  svgImage.value.src = url.value;
});

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
      <img ref="svgImage" id="svgImage" src="" alt="maze" style="visibility: hidden; cursor: grab;"
           @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseleave="onMouseUp" />
    </q-scroll-area>
  </div>
</template>

<style scoped>
</style>