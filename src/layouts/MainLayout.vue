<script setup lang="ts">
import MainHeader from 'components/MainHeader.vue';
import MainPage from 'components/MainPage.vue';
import MainFooter from 'components/MainFooter.vue';
</script>

<template>
  <q-layout view="hHh lpr fFf">

    <MainHeader/>

    <q-page-container>
      <MainPage/>
    </q-page-container>

    <MainFooter/>
  </q-layout>
</template>