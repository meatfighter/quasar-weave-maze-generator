<script setup lang="ts">

import { ref, watch } from 'vue';
import { MAX_MAZE_SIZE } from 'src/app/controller/defaults';
import { useOptionsStore } from 'stores/optionsStore';
import { storeToRefs } from 'pinia';

const IMAGE_FILE_EXTENSIONS = new Set<string>(
    ['apng', 'bmp', 'gif', 'ico', 'jpg', 'jpeg', 'svg', 'svgz', 'png', 'webp']);

const optionsStore = useOptionsStore();
const { maskRgbas } = storeToRefs(optionsStore);

const dialogVisible = defineModel<boolean>();
const imageUrl = ref('');

watch(imageUrl, () => {
  let url = imageUrl.value;
  if (!url) {
    return;
  }
  url = url.trim();
  if (!url) {
    return;
  }
  const index = url.lastIndexOf('.');
  if (index < 0 || index > url.length - 4 || !IMAGE_FILE_EXTENSIONS.has(url.substring(index + 1).toLowerCase())) {
    return;
  }
  console.log(url);
});

function removeMask() {
  maskRgbas.value = null;
  closeDialog();
}

function closeDialog() {
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog">
    <q-card style="min-width: 50em;">
      <q-card-section class="q-pa-none" style="background: #2D2D2D;">
        <div class="row items-center justify-between q-pa-sm">
          <div class="col-2"></div>
          <div class="col text-center">
            <span class="q-dialog-title text-weight-bold text-h6">Mask</span>
          </div>
          <div class="col-2 text-right">
            <q-btn icon="close" no-caps @click="closeDialog"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="maskRgbas" class="row justify-center q-mt-md">
        <q-btn icon="delete" rounded no-caps color="negative" label="Remove mask image" @click="removeMask"/>
      </q-card-section>
      <q-card-section>
        <div class="column justify-center items-center q-pa-lg" style="height: 250px; border: 2px dashed; border-radius: 7px;">
          <div>Drag an image here, containing:</div>
          <ul>
            <li>White pixels for maze cells</li>
            <li>Black or transparent pixels for empty cells</li>
            <li>No more than {{MAX_MAZE_SIZE}}&times;{{MAX_MAZE_SIZE}} pixels</li>
          </ul>
        </div>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-btn icon="drive_folder_upload" rounded no-caps color="primary" label="Or choose an image file"/>
      </q-card-section>
      <q-card-section>
        <q-input class="col" v-model="imageUrl" label="Or paste an image URL here" filled dense/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>