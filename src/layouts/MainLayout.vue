<script setup lang="ts">
import MainHeader from 'components/MainHeader.vue';
import MainPage from 'components/MainPage.vue';
import MainFooter from 'components/MainFooter.vue';
import { makeRgbasFromFile } from 'src/utils/images';
import { useQuasar } from 'quasar';
import { useOptionsStore } from 'stores/optionsStore';
import { storeToRefs } from 'pinia';

const $q = useQuasar();

const optionsStore = useOptionsStore();
const { maskRgbas } = storeToRefs(optionsStore);

function onDrop(event: DragEvent) {
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  const files: FileList = event.dataTransfer.files;
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
    .then(rgbas => maskRgbas.value = rgbas)
    .catch(e => $q.notify({
      message: (e as Error).message,
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    }));
}
</script>

<template>
  <q-layout view="hHh lpr fFf">
    <div @drop.prevent="onDrop" @dragover.prevent @dragenter.prevent>
      <MainHeader/>

      <q-page-container>
        <MainPage/>
      </q-page-container>

      <MainFooter/>
    </div>
  </q-layout>
</template>