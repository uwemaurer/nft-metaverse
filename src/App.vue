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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
