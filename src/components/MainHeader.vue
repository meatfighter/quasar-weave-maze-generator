<script setup lang="ts">
import { updateMaze } from 'src/app/controller/controller';
import { useRenderStore } from 'stores/renderStore';
import MaskDialog from 'components/MaskDialog.vue';
import { ref } from 'vue';
import { useOptionsStore } from 'stores/optionsStore';
import { storeToRefs } from 'pinia';
import SaveDialog from 'components/SaveDialog.vue';

const renderStore = useRenderStore();
const { centerImage } = renderStore;

const optionsStore = useOptionsStore();
const { maskRgbas } = storeToRefs(optionsStore);

const maskDialogVisible = ref(false);
const saveDialogVisible = ref(false);

function onGenerate() {
  updateMaze(false);
}

function showSaveDialog() {
  saveDialogVisible.value = true;
}

function showMaskDialog() {
  maskDialogVisible.value = true;
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
        <q-btn icon="interests" rounded color="primary" no-caps label="Mask" @click="showMaskDialog">
          <q-badge v-if="maskRgbas" floating color="red" rounded></q-badge>
        </q-btn>
        <q-btn icon="save" rounded color="primary" no-caps label="Save" @click="showSaveDialog"/>
        <q-btn icon="print" rounded color="primary" no-caps label="Print"/>
      </div>
    </q-toolbar>
  </q-header>
  <MaskDialog v-model="maskDialogVisible"/>
  <SaveDialog v-model="saveDialogVisible"/>
</template>

<style scoped>

</style>