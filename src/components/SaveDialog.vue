<script setup lang="ts">
import { ref } from 'vue';

const dialogVisible = defineModel<boolean>();

const filenamePrefix = ref('maze');
const filenameTimestamp = ref(true);

const includeSolution = ref(true);

const selectedFormats = ref([ 'png', 'svg', 'pdf']);
const outputFormats = ref([
  { label: 'PNG', value: 'png', },
  { label: 'SVG', value: 'svg', },
  { label: 'PDF', value: 'pdf', },
]);

const selectedPaperSize = ref('Letter');
const paperSizes = ref([
  'Letter',
  'Tabloid',
  'Legal',
  'Statement',
  'Executive',
  'Folio',
  'Quarto',
  'A3',
  'A4',
  'A5',
  'B4',
  'B5',
  'Fit',
]);

function closeDialog() {
  dialogVisible.value = false;
}

// TODO MAKE BUTTONS SAME WIDTH
// CREATE TS UTIL FUNCTION FOR THIS
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog">
    <q-card style="min-width: 50em;">
      <q-card-section class="q-pa-none" style="background: #2D2D2D;">
        <div class="row items-center justify-between q-pa-sm">
          <div class="col-2"></div>
          <div class="col text-center">
            <span class="q-dialog-title text-weight-bold text-h6">Save</span>
          </div>
          <div class="col-2 text-right">
            <q-btn icon="close" flat round dense @click="closeDialog"></q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-checkbox v-model="includeSolution" label="Include solution"></q-checkbox>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="filenamePrefix" label="Filename prefix"></q-input>
      </q-card-section>
      <q-card-section>
        <q-checkbox v-model="filenameTimestamp" label="Filename timestamp"></q-checkbox>
      </q-card-section>
      <q-card-section>
        <q-field filled label="Output Formats" stack-label>
          <q-option-group v-model="selectedFormats" :options="outputFormats" color="primary" type="checkbox"/>
        </q-field>
      </q-card-section>
      <q-card-section>
        <q-select filled options-dense v-model="selectedPaperSize" :options="paperSizes" label="PDF Paper Size"></q-select>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-between">
          <q-btn icon="refresh" rounded color="primary" no-caps label="Reset"/>
          <q-btn icon="save" rounded color="primary" no-caps label="Save"/>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>