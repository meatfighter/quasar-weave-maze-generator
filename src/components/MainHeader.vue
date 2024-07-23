<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { updateMaze } from 'src/app/controller/controller';
import { useRenderStore } from 'stores/renderStore';
import MaskDialog from 'components/MaskDialog.vue';
import { useOptionsStore } from 'stores/optionsStore';
import { storeToRefs } from 'pinia';
import SaveDialog from 'components/SaveDialog.vue';
import PrintDialog from 'components/PrintDialog.vue';

const $q = useQuasar();
const small = computed(() => $q.screen.width < 640);

const renderStore = useRenderStore();
const { centerImage } = renderStore;

const optionsStore = useOptionsStore();
const { maskRgbas } = storeToRefs(optionsStore);

const maskDialogVisible = ref(false);
const saveDialogVisible = ref(false);
const printDialogVisible = ref(false);

function onGenerate() {
  updateMaze(false);
}

function showSaveDialog() {
  saveDialogVisible.value = true;
}

function showMaskDialog() {
  maskDialogVisible.value = true;
}

function showPrintDialog() {
  printDialogVisible.value = true;
}
</script>

<template>
  <q-header>
    <q-toolbar class="text-white q-pl-none" style="background: #1F1F1F;">
      <div class="row justify-center" style="width: 170px;">
        <q-btn rounded class="q-mx-none" icon="play_circle" color="green-6" no-caps label="Generate"
               @click="onGenerate"/>
      </div>
      <q-img class="gt-sm" src="white-logo.svg" spinner-color="white" style="width: 45px;"/>
      <q-toolbar-title class="q-px-none q-mx-none"><span class="gt-sm">Weave Maze Generator</span></q-toolbar-title>
      <div class="q-gutter-sm">
        <q-btn :round="small" :rounded="!small" icon="center_focus_strong" color="primary" no-caps @click="centerImage">
          <span class="q-pl-sm" :hidden="small">Center</span>
        </q-btn>
        <q-btn :round="small" :rounded="!small" icon="interests" color="primary" no-caps @click="showMaskDialog">
          <span class="q-pl-sm" :hidden="small">Mask</span>
          <q-badge v-if="maskRgbas" floating color="red" rounded></q-badge>
        </q-btn>
        <q-btn :round="small" :rounded="!small" icon="save" color="primary" no-caps @click="showSaveDialog">
          <span class="q-pl-sm" :hidden="small">Save</span>
        </q-btn>
        <q-btn :round="small" :rounded="!small" icon="print" color="primary" no-caps @click="showPrintDialog">
          <span class="q-pl-sm" :hidden="small">Print</span>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
  <MaskDialog v-model="maskDialogVisible"/>
  <SaveDialog v-model="saveDialogVisible"/>
  <PrintDialog v-model="printDialogVisible"/>
</template>

<style scoped>

</style>