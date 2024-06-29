<script setup lang="ts">
defineOptions({
  name: 'App'
});
</script>

<template>
  <router-view />
</template>

<style>
a,a:visited {
  color: #58A6FF;
  text-decoration: none;
  white-space: nowrap;
}

a:hover,a:active {
  color: #58A6FF;
  text-decoration: underline;
  white-space: nowrap;
}

input[type="number"] {
  appearance: textfield;
}

input[type="number"]:focus,
input[type="number"]:hover {
  appearance: auto;
}
</style>