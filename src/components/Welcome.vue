<template>
  <div id="blocker" class="blocker">
    <div class="instructions">
      <h1>NFT Metaverse</h1>
      {{ user }}
      <button class="button" style="margin-bottom: 15px" @click="connect" v-if="!user">
        Login
      </button>
       <button class="button" style="margin-bottom: 15px" @click="logout" v-else>
        Logout
      </button>
      <button class="button" style="margin-bottom: 15px" @click="enterMetaverse">
        Click to enter
      </button>
      <div>
        Move: WASD<br />
        Jump: SPACE<br />
        Look: Mouse
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { enterMetaverse } from '../metaverse';
import { moralisCurrentAddress, moralisLogin, moralisLogout } from '../moralis-helper';

defineProps({
  msg: String,
});

const count = ref(0);
const user = ref(moralisCurrentAddress());

async function connect() {
  await moralisLogin();
  user.value = moralisCurrentAddress();
}
async function logout() {
  await moralisLogout();
  user.value = moralisCurrentAddress();
}
</script>
<style scoped>
.blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

a {
  color: #42b983;
}
.instructions {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.button {
  font-size: 36px;
}
</style>
