<script setup lang="ts">
import panzoom from 'panzoom';
import { onMounted, ref } from 'vue';
import { MazeOptions } from 'src/app/maze/MazeOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';

const svgContainer = ref<HTMLDivElement | null>(null);

const mazeOptions = new MazeOptions();
const renderOptions = new RenderOptions('test');
const maze = generateMaze(mazeOptions);
const blob = renderMaze(maze, renderOptions);

function updateSvg() {
  const url = URL.createObjectURL(blob);

  const objectElement = document.createElement('object');
  objectElement.data = url;
  objectElement.type = 'image/svg+xml';
  objectElement.style.width = '100%';
  objectElement.style.height = '100%';

  if (svgContainer.value) {
    svgContainer.value.innerHTML = '';
    svgContainer.value.appendChild(objectElement);
  }

  objectElement.onload = () => {
    if (svgContainer.value) {
      panzoom(svgContainer.value);
    }
  };
}

onMounted(() => {
  updateSvg();
});
</script>

<template>
  <div ref="svgContainer" id="svgContainer" style="background: white"></div>
</template>

<style scoped>
#svgContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
}
</style>