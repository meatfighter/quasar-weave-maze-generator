<script setup lang="ts">
import { computed, ref } from 'vue';
import { compareArrays } from 'src/utils/arrays';

const FORMAT_PNG = 'png';
const FORMAT_SVG = 'svg';
const FORMAT_PDF = 'pdf';

const DEFAULT_INCLUDE_SOLUTION = true;
const DEFAULT_FILENAME_TIMESTAMP = true;
const DEFAULT_FILENAME_PREFIX = 'maze';
const DEFAULT_FORMATS = [ FORMAT_PNG, FORMAT_SVG, FORMAT_PDF ];
const DEFAULT_PAPER_SIZE = 'Letter';

const dialogVisible = defineModel<boolean>();

const includeSolution = ref(DEFAULT_INCLUDE_SOLUTION);

const filenameTimestamp = ref(DEFAULT_FILENAME_TIMESTAMP);
const filenamePrefix = ref(DEFAULT_FILENAME_PREFIX);

const selectedFormats = ref(DEFAULT_FORMATS);
const formats = ref([
  { label: 'PNG', value: FORMAT_PNG, },
  { label: 'SVG', value: FORMAT_SVG, },
  { label: 'PDF', value: FORMAT_PDF, },
]);

const selectedPaperSize = ref(DEFAULT_PAPER_SIZE);
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

const resettable = computed(() =>
    includeSolution.value !== DEFAULT_INCLUDE_SOLUTION
        || filenameTimestamp.value !== DEFAULT_FILENAME_TIMESTAMP
        || filenamePrefix.value !== DEFAULT_FILENAME_PREFIX
        || selectedPaperSize.value !== DEFAULT_PAPER_SIZE
        || !compareArrays(selectedFormats.value, DEFAULT_FORMATS)
);

function reset() {
  includeSolution.value = DEFAULT_INCLUDE_SOLUTION;
  filenameTimestamp.value = DEFAULT_FILENAME_TIMESTAMP;
  filenamePrefix.value = DEFAULT_FILENAME_PREFIX;
  selectedFormats.value = DEFAULT_FORMATS;
  selectedPaperSize.value = DEFAULT_PAPER_SIZE;
}

function closeDialog() {
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog">
    <q-card>
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
      <q-card-section class="q-by-none">
        <q-checkbox class="q-pb-lg" v-model="includeSolution" label="Include solution files"/>
        <div class="q-pb-lg">
        Filenames
        <div class="row items-center">
          <q-checkbox v-model="filenameTimestamp" label="Timestamp"/>
          <q-input class="q-pl-lg col" borderless v-model="filenamePrefix" label="Prefix"/>
        </div>
        </div>
        Formats
        <div class="row items-center">
          <q-option-group inline v-model="selectedFormats" :options="formats" color="primary" type="checkbox"/>
          <q-select class="q-pl-lg" borderless options-dense v-model="selectedPaperSize" :options="paperSizes"
                    label="PDF Paper Size" :disable="selectedFormats.indexOf(FORMAT_PDF) < 0" style="min-width: 13em;"/>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-between">
          <q-btn icon="refresh" rounded color="primary" no-caps label="Reset" :disable="!resettable" @click="reset"/>
          <q-btn icon="save_as" rounded color="primary" no-caps label="Save ZIP"/>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>