<template>
  <div id="blocker" class="blocker">
    <div class="instructions">
      <h1>NFT Metaverse</h1>
      {{ user }}
      <button class="btn btn-lg btn-primary mb-2" @click="connect" v-if="!user">Login</button>
      <button class="btn btn-lg btn-primary mb-2" @click="logout" v-else>Logout</button>
      <button class="btn btn-lg btn-primary mb-2" @click="enterMetaverse">Click to enter</button>

      <div class="mb-3">
        <label for="input1" class="form-label">IPFS metaverse</label>
        <input
          type="url"
          class="form-control"
          id="input1"
          placeholder="content identifier or URL"
          v-model="ipfsUrl"
        />
      </div>

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
import { ipfsUrl } from '../main';

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
}
</style>
