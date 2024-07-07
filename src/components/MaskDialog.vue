<script setup lang="ts">
import { ref } from 'vue';

const modelValue = ref(true);
const imageUrl = '';
</script>

<template>
  <q-dialog :model-value="modelValue">
    <q-card style="min-width: 50em;">
      <q-card-section>
        <div class="row q-gutter-sm">
          <q-input class="col" v-model="imageUrl" label="URL" filled dense/>
          <q-btn icon="cloud_upload" rounded color="primary" no-caps label="Upload"/>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-end">
          <q-btn icon="cancel" rounded color="primary" no-caps label="Cancel"/>
        </div>
      </q-card-section>
    </q-card>

<!--    <q-card style="min-width: 50em;">-->
<!--      <q-card-section>-->
<!--        <div class="text-h6">Enter Image URL</div>-->
<!--      </q-card-section>-->
<!--      <q-card-section>-->
<!--        <q-input v-model="imageUrl" label="URL" filled/>-->
<!--      </q-card-section>-->
<!--      <q-card-actions align="right">-->
<!--        <q-btn flat label="Cancel"  />-->
<!--        <q-btn flat label="Add Image" />-->
<!--      </q-card-actions>-->
<!--    </q-card>-->
  </q-dialog>
</template>

<style scoped>

</style>