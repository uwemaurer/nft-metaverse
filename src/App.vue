<template>
  <div class="content">
    <Welcome msg="Hello" v-if="!metaverseActive && !forceHide" />
  </div>
</template>

<script setup lang="ts">
import Welcome from './components/Welcome.vue';
import { metaverseActive } from './metaverse';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useMagicKeys } from '@vueuse/core'
import { watch, ref } from 'vue';

const forceHide = ref(false);

// make it possible to hide the menu for taking a screenshot
const { x } = useMagicKeys();
watch(x, (v) => {
  if (v)
    forceHide.value = !forceHide.value;
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
