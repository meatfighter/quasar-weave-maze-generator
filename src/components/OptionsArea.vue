<script setup lang="ts">
import {
  CELL_SIZE_STEP,
  CROSS_PCT_STEP, IMAGE_SIZE_STEP, LINE_WIDTH_PCT_STEP,
  LOOP_PCT_STEP, MAX_CROSS_PCT, MAX_IMAGE_SIZE, MAX_LINE_WIDTH_PCT,
  MAX_LOOP_PCT,
  MAX_MAZE_SIZE, MAX_PASSAGE_WIDTH_PCT,
  MAZE_SIZE_STEP, MIN_CELL_SIZE, MIN_CROSS_PCT, MIN_IMAGE_SIZE, MIN_LINE_WIDTH_PCT,
  MIN_LOOP_PCT,
  MIN_MAZE_SIZE, MIN_PASSAGE_WIDTH_PCT, PASSAGE_WIDTH_PCT_STEP,
  useOptionsStore
} from 'src/stores/optionsStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const optionsStore = useOptionsStore();
const { mazeWidth, mazeHeight, loopPct, crossPct, longPassages, cellSize, imageWidth, imageHeight, squareCorners,
    lineWidthPct, passageWidthPct, wallColor, backgroundColor, solutionColor, solution } = storeToRefs(optionsStore);

const formattedCellSize = computed({
  get() {
    return Math.round(1000 * cellSize.value) / 1000;
  },
  set(value: number) {
    cellSize.value = value;
  }
});

const formattedImageWidth = computed({
  get() {
    return Math.round(1000 * imageWidth.value) / 1000;
  },
  set(value: number) {
    imageWidth.value = value;
  }
});

const formattedImageHeight = computed({
  get() {
    return Math.round(1000 * imageHeight.value) / 1000;
  },
  set(value: number) {
    imageHeight.value = value;
  }
});

</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <q-input label="Maze Width (cells)" v-model.number="mazeWidth" type="number" filled :min="MIN_MAZE_SIZE"
             :max="MAX_MAZE_SIZE" :step="MAZE_SIZE_STEP"/>
    <q-input label="Maze Height (cells)" v-model.number="mazeHeight" type="number" filled :min="MIN_MAZE_SIZE"
             :max="MAX_MAZE_SIZE" :step="MAZE_SIZE_STEP"/>
    <q-input label="Loops (%)" v-model.number="loopPct" type="number" filled :min="MIN_LOOP_PCT" :max="MAX_LOOP_PCT"
             :step="LOOP_PCT_STEP"/>
    <q-input label="Crosses (%)" v-model.number="crossPct" type="number" filled :min="MIN_CROSS_PCT" :max="MAX_CROSS_PCT"
             :step="CROSS_PCT_STEP"/>
    <q-field label="Long Passages" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="longPassages"></q-toggle>
      </template>
    </q-field>
    <q-input label="Cell Size (px)" v-model.number="formattedCellSize" type="number" filled :min="MIN_CELL_SIZE"
             :step="CELL_SIZE_STEP"/>
    <q-input label="Image Width (px)" v-model.number="formattedImageWidth" type="number" filled :min="MIN_IMAGE_SIZE"
             :max="MAX_IMAGE_SIZE" :step="IMAGE_SIZE_STEP"/>
    <q-input label="Image Height (px)" v-model.number="formattedImageHeight" type="number" filled :min="MIN_IMAGE_SIZE"
             :max="MAX_IMAGE_SIZE" :step="IMAGE_SIZE_STEP"/>
    <q-field label="Square Corners" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="squareCorners"></q-toggle>
      </template>
    </q-field>
    <q-input label="Line Width (%)" v-model.number="lineWidthPct" type="number" filled :min="MIN_LINE_WIDTH_PCT"
             :max="MAX_LINE_WIDTH_PCT" :step="LINE_WIDTH_PCT_STEP"/>
    <q-input label="Passage Width (%)" v-model.number="passageWidthPct" type="number" filled :min="MIN_PASSAGE_WIDTH_PCT"
             :max="MAX_PASSAGE_WIDTH_PCT" :step="PASSAGE_WIDTH_PCT_STEP"/>
    <q-input label="Background Color" filled v-model="backgroundColor">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="backgroundColor"></q-color>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input label="Wall Color" filled v-model="wallColor">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="wallColor"></q-color>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input label="Solution Color" filled v-model="solutionColor">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="solutionColor"></q-color>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-field label="Solution" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="solution"></q-toggle>
      </template>
    </q-field>
    <div class="q-ma-md row justify-center">
      <q-btn icon="restart_alt" rounded color="primary" no-caps label="Reset All" />
      <q-tooltip>Reset All</q-tooltip>
    </div>
  </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
}
</style>