<template>
  <div id="blocker" class="blocker">
    <div class="instructions">
      <h1>{{metaverseName}}</h1>
      {{ user }}
      <button class="btn btn-lg btn-primary mb-3" @click="enterMetaverse">Click to enter</button>

      <button class="btn btn-lg btn-primary mb-1" @click="connect" v-if="!user">Login</button>
      <button class="btn btn-lg btn-primary mb-1" @click="logout" v-else>Logout</button>
      
      <div class="my-3">
        <label for="input1" class="form-label">Metaverse name</label>
        <input
          type="text"
          class="form-control"
          id="input1"
          placeholder="Name of this metaverse"
          v-model="metaverseName"
        />
      </div>

      <button class="btn btn-lg btn-primary mb-1" :disabled="!user" @click="saveMetaverse">Save to IPFS</button>
      <div v-if="!user" class="badge bg-warning text-dark">Login to enable saving</div>

      <a :href="ipfsUrl" v-if="ipfsUrl">IPFS Data</a>
      <a :href="`/?ipfs=${ipfsHash}`" v-if="ipfsHash" >{{metaverseName}}</a>

      <div class="mt-2">
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
import { ipfsUrl, ipfsHash, metaverseName, saveMetaverse } from '../main';

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
