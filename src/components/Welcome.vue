<template>
  <div id="blocker" class="blocker">
    <div class="instructions">
      <h1 class="huge">{{metaverseName}}</h1>
      {{ user }}
      <button class="btn btn-lg btn-primary mb-3" v-if="enterAvailable" @click="enterMetaverse">Click to enter</button>

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
import { computed, ref } from 'vue';
import { enterMetaverse } from '../metaverse';
import { ipfsUrl, ipfsHash, metaverseName, saveMetaverse, loginProvider, loadUserNfts, nfts, user } from '../main';

const enterAvailable = computed(() => !!user.value || nfts.value.length > 0);

defineProps({
  msg: String,
});

const count = ref(0);

async function connect() {
  await loginProvider.login();
  user.value = loginProvider.currentAddress();
  await loadUserNfts(user.value);
}

async function logout() {
  await loginProvider.logout();
  user.value = loginProvider.currentAddress();
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
.huge {
  font-size: 80px;
}
</style>
