<script setup lang="ts">

import { ref, watch } from 'vue';
import { MAX_MAZE_SIZE } from 'src/app/controller/defaults';
import { useOptionsStore } from 'stores/optionsStore';
import { storeToRefs } from 'pinia';
import { makeRgbasFromFile, makeRgbasFromUrl } from 'src/utils/images';
import { useQuasar } from 'quasar';

const IMAGE_FILE_EXTENSIONS = new Set<string>(
    ['apng', 'bmp', 'gif', 'ico', 'jpg', 'jpeg', 'svg', 'svgz', 'png', 'webp']);

const $q = useQuasar();

const optionsStore = useOptionsStore();
const { maskRgbas } = storeToRefs(optionsStore);

const dialogVisible = defineModel<boolean>();

const fileInput = ref<HTMLInputElement | null>(null);

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
  makeRgbasFromUrl(url)
    .then(rgbas => {
      maskRgbas.value = rgbas;
      closeDialog();
    })
    .catch(e => $q.notify({
      message: (e as Error).message,
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    }));
});

function openFileBrowser() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  onFiles((event.target as HTMLInputElement).files);
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) {
    return;
  }
  onFiles(event.dataTransfer.files);
}

function onFiles(files: FileList | null) {
  if (!files || files.length === 0) {
    return;
  }
  if (files.length !== 1) {
    $q.notify({
      message: 'Single files only.',
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    })
    return;
  }

  makeRgbasFromFile(files[0])
    .then(rgbas => {
      maskRgbas.value = rgbas;
      closeDialog();
    })
    .catch(e => $q.notify({
      message: (e as Error).message,
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    }));
}

function removeMask() {
  maskRgbas.value = null;
  closeDialog();
}

function closeDialog() {
  imageUrl.value = '';
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog" @drop.prevent="onDrop" @dragover.prevent
            @dragenter.prevent>
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
        <q-btn icon="drive_folder_upload" rounded no-caps color="primary" label="Or choose an image file"
               @click="openFileBrowser"/>
        <input type="file" ref="fileInput" @change="onFileChange" style="display: none" accept="image/*" />
      </q-card-section>
      <q-card-section>
        <q-input class="col" v-model="imageUrl" label="Or paste an image URL here" filled dense/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>