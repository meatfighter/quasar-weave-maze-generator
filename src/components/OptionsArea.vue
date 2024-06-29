<script setup lang="ts">
import {
  CROSS_PCT_STEP,
  LOOP_PCT_STEP, MAX_CROSS_PCT,
  MAX_LOOP_PCT,
  MAX_MAZE_SIZE,
  MAZE_SIZE_STEP, MIN_CROSS_PCT,
  MIN_LOOP_PCT,
  MIN_MAZE_SIZE,
  useOptionsStore
} from 'stores/optionsStore';
import { storeToRefs } from 'pinia';

const optionsStore = useOptionsStore();
const { mazeWidth, mazeHeight, loopPct, crossPct, longPassages } = storeToRefs(optionsStore);
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <q-input label="Maze Width" v-model.number="mazeWidth" type="number" filled :min="MIN_MAZE_SIZE" :max="MAX_MAZE_SIZE"
             :step="MAZE_SIZE_STEP"/>
    <q-input label="Maze Height" v-model.number="mazeHeight" type="number" filled :min="MIN_MAZE_SIZE" :max="MAX_MAZE_SIZE"
             :step="MAZE_SIZE_STEP"/>
    <q-input label="Loops" v-model.number="loopPct" type="number" filled :min="MIN_LOOP_PCT" :max="MAX_LOOP_PCT"
             :step="LOOP_PCT_STEP"/>
    <q-input label="Crosses" v-model.number="crossPct" type="number" filled :min="MIN_CROSS_PCT" :max="MAX_CROSS_PCT"
             :step="CROSS_PCT_STEP"/>
    <q-field label="Long Passages" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="longPassages"></q-toggle>
      </template>
    </q-field>
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