import { createApp, ref, watch } from 'vue';
import App from './App.vue';
import { init, animate, metaverseActive, getState, pauseAnim, startAnim, State, restoreState } from './metaverse';
import { NFTProvider, DemoNFTs, NFT } from './nft-api';
import { addPainting } from './generateWorld';
import { MoralisProvider } from './moralis';
import { NFTPortProvider } from './NFTport';
import { moralisInit, moralisLogin } from './moralis-helper';

export const ipfsUrl = ref('');
export const ipfsHash = ref('');
export const metaverseName = ref('NFT Metaverse');

const moralis = new MoralisProvider();
let nfts = [] as NFT[];

async function main() {
  const goofballCommunityAddress = '0x56addf051984b4cc93102673fcfa9d157a0487c8';
  await moralisInit();

  createApp(App).mount('#app');

  let url = new URL(window.location.href);
  const hash = url.searchParams?.get('ipfs');

  init();

  if (hash) {
    await loadMetaverse(hash);
  } else {
    const provider = new DemoNFTs() as NFTProvider;
    //const provider = moralis as NFTProvider;
    // const provider = new NFTPortProvider() as NFTProvider;
    nfts = await provider.getNFTs(goofballCommunityAddress);
  }

  startAnim();
  animate();
  // animate for 5 seconds so that the textures load and the metaverse gets displayed
  // if the menu is still visible after timeout pause the rendering
  setTimeout(() => {
    if (!metaverseActive.value) {
      pauseAnim();
    }
  }, 5000);

  for (const nft of nfts) {
    // console.log(nft);
    addPainting(nft.imageUrl);
  }

  watch(metaverseActive, async () => {
    console.log(`active ${metaverseActive.value}`);
    // save state when user leaves metaverse
    if (!metaverseActive.value) {
    }
  });
}

main();

interface PersistedState {
  name: string;
  state: State;
  nfts: NFT[];
}

export async function saveMetaverse() {
  const state = getState();
  const file = await moralis.saveFile('metaverse.json', { name: metaverseName.value, state, nfts } as PersistedState);
  console.log(file);
  ipfsUrl.value = file.ipfs();
  ipfsHash.value = file.hash();
}

// load saved state from IPFS
async function loadMetaverse(hash: string) {
  ipfsUrl.value = `https://dweb.link/ipfs/${hash}`;
  ipfsHash.value = hash;
  const response = await fetch(ipfsUrl.value);
  const saveState = await response.json() as PersistedState;
  metaverseName.value = saveState.name;
  restoreState(saveState.state);
  nfts = saveState.nfts;
}
