<script setup lang="ts">

import { ref } from 'vue';

const dialogVisible = defineModel<boolean>();

const selectedFileFormats = ref([ 'png', 'svg', 'pdf']);
const fileFormats = ref([
  { label: 'PNG', value: 'png', },
  { label: 'SVG', value: 'svg', },
  { label: 'PDF', value: 'pdf', },
]);

function closeDialog() {
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible">
    <q-card style="min-width: 50em;">
      <q-card-section class="q-pa-none" style="background: #2D2D2D;">
        <div class="row items-center justify-between q-pa-sm">
          <div class="col-2"></div>
          <div class="col text-center">
            <span class="q-dialog-title text-weight-bold text-h6">Save</span>
          </div>
          <div class="col-2 text-right">
            <q-btn icon="close" no-caps @click="closeDialog"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-field filled label="File Formats" stack-label>
          <q-option-group v-model="selectedFileFormats" :options="fileFormats" color="primary" type="checkbox"/>
        </q-field>

<!--        <div class="q-pa-md bordered-section">-->
<!--          <div class="section-title">Options</div>-->
<!--          <q-option-group v-model="selectedFileTypes" :options="fileTypes" color="primary" type="checkbox"/>-->
<!--        </div>        -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.bordered-section {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.section-title {
  position: absolute;
  top: -12px;
  left: 16px;
  background: white;
  padding: 0 8px;
  font-weight: bold;
  color: #333;
}
</style>