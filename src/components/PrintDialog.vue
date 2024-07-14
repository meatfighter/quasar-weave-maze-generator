<script setup lang="ts">
import { ref } from 'vue';
import { DEFAULT_PAPER_SIZE, PAPER_SIZES } from 'src/app/file/PaperSize';

const dialogVisible = defineModel<boolean>();

const selectedPaperSize = ref(DEFAULT_PAPER_SIZE);
const paperSizes = ref(PAPER_SIZES);

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
            <span class="q-dialog-title text-weight-bold text-h6">Print</span>
          </div>
          <div class="col-2 text-right">
            <q-btn icon="close" flat round dense @click="closeDialog"></q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pb-sm">
        <q-select class="q-my-none" borderless options-dense v-model="selectedPaperSize" :options="paperSizes"
                  option-label="name" label="Paper Size" style="min-width: 13em; margin: 0 80px 0 80px;"/>
      </q-card-section>
      <q-card-section class="q-pb-lg">
        <div class="row items-center justify-between">
          <q-btn icon="refresh" rounded color="primary" no-caps label="Reset"/>
          <q-btn icon="print" rounded color="primary" no-caps label="Print">
            <template v-slot:loading>
              <q-spinner class="on-left"/>
              Printing...
            </template>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>