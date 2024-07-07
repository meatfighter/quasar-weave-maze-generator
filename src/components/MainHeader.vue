<script setup lang="ts">
import { updateMaze } from 'src/app/controller/maze-controller';
import { useRenderStore } from 'stores/renderStore';

const renderStore = useRenderStore();
const { centerImage } = renderStore;

function onGenerate() {
  updateMaze(false);
}
</script>

<template>
  <q-header>
    <q-toolbar class="text-white q-pl-none" style="background: #1F1F1F;">
      <div class="row justify-center" style="width: 170px;">
        <q-btn class="q-mx-none" icon="play_circle" rounded color="green-6" no-caps label="Generate"
               @click="onGenerate"/>
      </div>
      <q-img src="white-logo.svg" spinner-color="white" style="width: 45px;"/>
      <q-toolbar-title>Weave Maze Generator</q-toolbar-title>
      <div class="q-gutter-sm">
        <q-btn icon="center_focus_strong" rounded color="primary" no-caps label="Center" @click="centerImage"/>
        <q-btn icon="interests" rounded color="primary" no-caps label="Mask"/>
        <q-btn icon="save" rounded color="primary" no-caps label="Save"/>
        <q-btn icon="print" rounded color="primary" no-caps label="Print"/>
      </div>
    </q-toolbar>
  </q-header>
</template>

<style scoped>

</style>