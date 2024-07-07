<script setup lang="ts">

import { ref } from 'vue';
import { MAX_MAZE_SIZE } from 'src/app/controller/defaults';

const dialogVisible = defineModel<boolean>();
const imagePath = ref('');

function closeDialog() {
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog">
    <q-card style="min-width: 50em;">
      <q-card-section class="q-pa-none q-ma-none" style="background: #2D2D2D;">
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
        <q-btn icon="drive_folder_upload" rounded no-caps color="primary" label="Choose image file"/>
      </q-card-section>
      <div class="separator-container">
        <div class="separator-line"></div><div class="separator-text">or</div><div class="separator-line"></div>
      </div>
      <q-card-section>
        <q-input class="col" v-model="imagePath" label="Paste image URL or filepath" filled dense/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.separator-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 200px;
}

.separator-line {
  flex: 1;
  height: 1px;
  background-color: #999999;
}

.separator-text {
  padding: 0 10px;
  white-space: nowrap;
}
</style>