import { createApp, ref, watch } from 'vue';
import App from './App.vue';
import {
  init,
  animate,
  metaverseActive,
  getState,
  pauseAnim,
  startAnim,
  State,
  restoreState,
} from './metaverse';
import { NFTProvider, DemoNFTs, NFT } from './nft-api';
import { addPainting, clearPaintings } from './generateWorld';
import { moralis, MoralisProvider, moralisLoginProvider } from './moralis';
import { NFTPortProvider } from './NFTport';
import { moralisInit } from './moralis-helper';
import { sequenceLoginProvider } from './sequence';
import { useRafFn } from '@vueuse/core';

export const ipfsUrl = ref('');
export const ipfsHash = ref('');
export const metaverseName = ref('NFT Metaverse');

export const nfts = ref([] as NFT[]);
export const loginProvider = moralisLoginProvider;
// export const loginProvider = sequenceLoginProvider;
const goofballCommunityAddress = '0x56addf051984b4cc93102673fcfa9d157a0487c8';
export const user = ref(null as string|null);
export const address = ref(null as string|null);

async function main() {  
  await moralisInit();
  user.value = loginProvider.currentAddress();

  createApp(App).mount('#app');

  let url = new URL(window.location.href);
  const hash = url.searchParams?.get('ipfs');
  const address = url.searchParams?.get('address');

  init();

  if (hash) {
    await loadMetaverse(hash);
    console.log("loaded");
    setPaintings(nfts.value);
  } else if (address) {
    loadUserNfts(address);
  } else if (user.value) {
    loadUserNfts(user.value);
  } else {
    const provider = new DemoNFTs() as NFTProvider;
    //const provider = moralis as NFTProvider;
    // const provider = new NFTPortProvider() as NFTProvider;
    nfts.value = await provider.getNFTs(goofballCommunityAddress);
    setPaintings(nfts.value);
  }

  startAnim();
  animate();
  // animate for 15 seconds so that the textures load and the metaverse gets displayed
  // if the menu is still visible after timeout pause the rendering
  setTimeout(() => {
    if (!metaverseActive.value) {
      pauseAnim();
    }
  }, 15000);

  watch(metaverseActive, async () => {
    console.log(`active ${metaverseActive.value}`);
    // save state when user leaves metaverse
    if (!metaverseActive.value) {
    }
  });
}

function setPaintings(nft:NFT[]) {
  clearPaintings();
  for (const nft of nfts.value) {
    // fetch the images through an image proxy, this is needed to downsize them to 256
    // and also to avoid CORS problems (Access-Control-Allow-Origin header) that the image can't be read into a texture
    addPainting(`https://image-proxy.svc.prod.covalenthq.com/256,fit,png/${nft.imageUrl}`);
  }
}

const demo = false;

watch(address, () => {
  if (address.value && address.value.length == 42) {
    loadUserNfts(address.value);
  }
})

export async function loadUserNfts(address: string) {
  let provider = moralis as NFTProvider;
  if (demo) {
    address = goofballCommunityAddress;
    provider = new DemoNFTs();
  }
  
  nfts.value = await provider.getNFTs(address);
  setPaintings(nfts.value);
}

main();

interface PersistedState {
  name: string;
  state: State;
  nfts: NFT[];
}

export async function saveMetaverse() {
  const state = getState();
  const file = await moralis.saveFile('metaverse.json', {
    name: metaverseName.value,
    state,
    nfts: nfts.value,
  } as PersistedState);
  console.log(file);
  ipfsUrl.value = file.ipfs();
  ipfsHash.value = file.hash();
}

// load saved state from IPFS
async function loadMetaverse(hash: string) {
  //ipfsUrl.value = `https://dweb.link/ipfs/${hash}`;
  ipfsUrl.value = `https://ipfs.moralis.io:2053/ipfs/${hash}`;
  ipfsHash.value = hash;
  const response = await fetch(ipfsUrl.value);
  const saveState = (await response.json()) as PersistedState;
  metaverseName.value = saveState.name;
  restoreState(saveState.state);
  nfts.value = saveState.nfts;
}
