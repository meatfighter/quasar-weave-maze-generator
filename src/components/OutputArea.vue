<script setup lang="ts">
import panzoom from 'panzoom';
import { onMounted, ref } from 'vue';
import { MazeOptions } from 'src/app/maze/MazeOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';
import { Color } from 'src/app/color/Color';

const svgContainer = ref<HTMLDivElement | null>(null);
const svgImage = ref<HTMLImageElement | null>(null);

async function updateSvg() {
  const mazeOptions = new MazeOptions();
  const renderOptions = new RenderOptions('test');
  renderOptions.backgroundColor = new Color(255, 255, 255, 1);
  const maze = generateMaze(mazeOptions);
  const blob = await renderMaze(maze, renderOptions);
  const url = URL.createObjectURL(blob);
  if (svgImage.value) {
    svgImage.value.style.visibility = 'hidden';
    svgImage.value.onload = () => {
      if (svgContainer.value && svgImage.value) {
        const containerRect = svgContainer.value.getBoundingClientRect();
        const imageRect = svgImage.value.getBoundingClientRect();
        let { width: w1, height: h1 } = imageRect;
        let { width: w2, height: h2 } = imageRect;

        if (w1 > containerRect.width) {
            w1 = containerRect.width;
            h1 = w1 * imageRect.height / imageRect.width;
        }
        if (h1 > containerRect.height) {
          h1 = containerRect.height;
          w1 = h1 * imageRect.width / imageRect.height;
        }

        if (h2 > containerRect.height) {
          h2 = containerRect.height;
          w2 = h2 * imageRect.width / imageRect.height;
        }
        if (w2 > containerRect.width) {
          w2 = containerRect.width;
          h2 = w2 * imageRect.height / imageRect.width;
        }

        let width: number;
        let height: number;
        if (w1 > w2) {
          width = w1;
          height = h1;
        } else {
          width = w2;
          height = h2;
        }

        const pz = panzoom(svgImage.value);
        if (width !== imageRect.width) {
          pz.zoomTo(0, 0,width / imageRect.width);
        }
        pz.moveTo((containerRect.width - width) / 2, (containerRect.height - height) / 2);
        svgImage.value.style.visibility = 'visible';
      }
    };
    svgImage.value.src = url;
  }
}

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
  void updateSvg();
});
</script>

<template>
    <div ref="svgContainer" id="svgContainer" style="width: 100%; height: 100%; overflow: hidden;">
      <q-scroll-area style="width: 100%; height: 100%; overflow: hidden;">
        <img ref="svgImage" id="svgImage" src="" alt="maze" style="visibility: hidden; cursor: grab;"
             @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseleave="onMouseUp" />
      </q-scroll-area>
    </div>
</template>

<style scoped>
</style>