<script setup lang="ts">
import panzoom from 'panzoom';
import { onMounted, ref } from 'vue';
import { MazeOptions } from 'src/app/maze/MazeOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';
import { Color } from 'src/types/Color';

const svgContainer = ref<HTMLDivElement | null>(null);
const svgImage = ref<HTMLImageElement | null>(null);

const mazeOptions = new MazeOptions();
const renderOptions = new RenderOptions('test');
renderOptions.backgroundColor = new Color(255, 255, 255, 1);
const maze = generateMaze(mazeOptions);
const blob = renderMaze(maze, renderOptions);

function updateSvg() {
  const url = URL.createObjectURL(blob);
  if (svgImage.value) {
    svgImage.value.style.visibility = 'hidden';
    svgImage.value.onload = () => {
      if (svgContainer.value && svgImage.value) {
        const containerRect = svgContainer.value.getBoundingClientRect();
        const imageRect = svgImage.value.getBoundingClientRect();
        panzoom(svgImage.value).moveTo((containerRect.width - imageRect.width) / 2,
            (containerRect.height - imageRect.height) / 2);
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
  updateSvg();
});
</script>

<template>
  <div ref="svgContainer" id="svgContainer" style="width: 100%; height: 100%; overflow: hidden;">
    <img ref="svgImage" id="svgImage" src="" alt="maze" style="visibility: hidden; cursor: grab;"
         @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseleave="onMouseUp" />
  </div>
</template>

<style scoped>
</style>