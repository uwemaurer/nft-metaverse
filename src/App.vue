<template>
  <div class="content">
    <Welcome msg="Hello" v-if="!metaverseActive" />
  </div>
</template>

<script setup lang="ts">
import Welcome from './components/Welcome.vue';
import { metaverseActive } from './metaverse';
import 'bootstrap/dist/css/bootstrap.min.css';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
