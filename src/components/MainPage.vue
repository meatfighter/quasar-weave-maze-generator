<script setup lang="ts">
import { ref } from 'vue';
import OptionsArea from 'components/OptionsArea.vue';
import OutputArea from 'components/OutputArea.vue';

const splitterModel = ref(170);
</script>

<template>
  <q-page class="row items-stretch">
    <q-splitter v-model="splitterModel" separator-style="width: 0;" unit="px" style="width: 100%;">
      <template v-slot:before>
        <OptionsArea/>
      </template>
      <template v-slot:after>
        <OutputArea/>
      </template>
    </q-splitter>
  </q-page>
</template>

<style scoped>

</style>