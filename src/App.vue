<template>

  <Welcome msg="Hello" v-if="!metaverseActive"/>
</template>

<script setup lang="ts">
import Welcome from './components/Welcome.vue';
import { metaverseActive } from './metaverse';

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
