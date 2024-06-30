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
    svgImage.value.onload = () => {
      if (svgContainer.value && svgImage.value) {
        const containerRect = svgContainer.value.getBoundingClientRect();
        const imageRect = svgImage.value.getBoundingClientRect();

        const centerX = (containerRect.width - imageRect.width) / 2;
        const centerY = (containerRect.height - imageRect.height) / 2;

        const panzoomInstance = panzoom(svgImage.value);
        panzoomInstance.moveTo(centerX, centerY);
      }
    };
    svgImage.value.src = url;
  }
}

onMounted(() => {
  updateSvg();
});
</script>

<template>
  <div ref="svgContainer" id="svgContainer" style="border: 1px solid black; width: 100%; height: 100%; overflow: hidden;">
    <img ref="svgImage" />
  </div>
</template>

<style scoped>
</style>