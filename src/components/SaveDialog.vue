<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { compareArrays } from 'src/utils/arrays';
import { validateFilename } from 'src/utils/files';
import { DEFAULT_PAPER_SIZE, PAPER_SIZES } from 'src/app/file/PaperSize';
import { DEFAULT_PREFIX, DEFAULT_SOLUTION_SUFFIX, SaveOptions } from 'src/app/file/SaveOptions';
import { FileFormat } from 'src/app/file/FileFormat';
import { onSave } from 'src/app/controller/controller';
import { useSaveStore } from 'stores/saveStore';
import { storeToRefs } from 'pinia';

const DEFAULT_INCLUDE_SOLUTION = true;
const DEFAULT_FILENAME_TIMESTAMP = true;
const DEFAULT_FORMATS = Object.values(FileFormat);

const dialogVisible = defineModel<boolean>();

const saveStore = useSaveStore();
const { saving } = storeToRefs(saveStore);
watch(saving, (value, oldValue) => {
  if (!value && oldValue) {
    closeDialog();
  }
});

const includeSolution = ref(DEFAULT_INCLUDE_SOLUTION);

const filenameTimestamp = ref(DEFAULT_FILENAME_TIMESTAMP);
const filenamePrefix = ref(DEFAULT_PREFIX);
const filenameSolutionSuffix = ref(DEFAULT_SOLUTION_SUFFIX);

const selectedFormats = ref(DEFAULT_FORMATS);
const formats = ref([
  { label: 'PNG', value: FileFormat.PNG, },
  { label: 'SVG', value: FileFormat.SVG, },
  { label: 'PDF', value: FileFormat.PDF, },
]);

const selectedPaperSize = ref(DEFAULT_PAPER_SIZE);
const paperSizes = ref(PAPER_SIZES);

const resettable = computed(() =>
    includeSolution.value !== DEFAULT_INCLUDE_SOLUTION
        || filenameTimestamp.value !== DEFAULT_FILENAME_TIMESTAMP
        || filenamePrefix.value !== DEFAULT_PREFIX
        || filenameSolutionSuffix.value !== DEFAULT_SOLUTION_SUFFIX
        || !selectedPaperSize.value.equals(DEFAULT_PAPER_SIZE)
        || !compareArrays(selectedFormats.value, DEFAULT_FORMATS)
);

const downloadable = computed(() =>
    selectedFormats.value.length > 0
        && validateFilename(filenamePrefix.value)
        && (!includeSolution.value || validateFilename(filenameSolutionSuffix.value))
);

function reset() {
  includeSolution.value = DEFAULT_INCLUDE_SOLUTION;
  filenameTimestamp.value = DEFAULT_FILENAME_TIMESTAMP;
  filenamePrefix.value = DEFAULT_PREFIX;
  filenameSolutionSuffix.value = DEFAULT_SOLUTION_SUFFIX;
  selectedFormats.value = DEFAULT_FORMATS;
  selectedPaperSize.value = DEFAULT_PAPER_SIZE;
}

function download() {
  onSave(new SaveOptions(includeSolution.value, filenameTimestamp.value, filenamePrefix.value,
      filenameSolutionSuffix.value, new Set<FileFormat>(selectedFormats.value), selectedPaperSize.value.name));
}

function closeDialog() {
  dialogVisible.value = false;
}
</script>

<template>
  <q-dialog :model-value="dialogVisible" @before-hide="closeDialog" :no-esc-dismiss="saving"
            :no-backdrop-dismiss="saving" :no-route-dismiss="saving" :auto-close="false">
    <q-card>
      <q-card-section class="q-pa-none" style="background: #2D2D2D;">
        <div class="row items-center justify-between q-pa-sm">
          <div class="col-2"></div>
          <div class="col text-center">
            <span class="q-dialog-title text-weight-bold text-h6">Save</span>
          </div>
          <div class="col-2 text-right">
            <q-btn icon="close" flat round dense @click="closeDialog" :disable="saving"></q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-by-none">
        <q-checkbox class="q-pb-lg" v-model="includeSolution" label="Include solution files" :disable="saving"/>
        <div class="q-pb-lg">
          Filenames
          <div class="row items-center">
            <q-checkbox v-model="filenameTimestamp" label="Timestamp" :disable="saving"/>
            <q-input class="q-pl-lg" borderless v-model="filenamePrefix" label="Prefix" :disable="saving"
                     style="max-width: 7.6em;"/>
            <q-input class="q-pl-lg" borderless v-model="filenameSolutionSuffix" label="Solution Suffix"
                     :disable="!includeSolution || saving" style="max-width: 12em;"/>
          </div>
        </div>
        Formats
        <div class="row items-center">
          <q-option-group inline v-model="selectedFormats" :options="formats" color="primary" type="checkbox"
                          :disable="saving"/>
          <q-select class="q-pl-lg" borderless options-dense v-model="selectedPaperSize" :options="paperSizes"
                    option-label="name" label="PDF Paper Size"
                    :disable="selectedFormats.indexOf(FileFormat.PDF) < 0 || saving" style="min-width: 13em;"/>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-between">
          <q-btn icon="refresh" rounded color="primary" no-caps label="Reset" :disable="!resettable || saving"
                 @click="reset"/>
          <q-btn icon="download" rounded color="primary" no-caps :loading="saving" :disable="!downloadable"
                 @click="download" label="Download ZIP">
            <template v-slot:loading>
              <q-spinner class="on-left"/>
              Zipping...
            </template>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>