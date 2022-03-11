// import { createApp } from 'vue'
// import App from './App.vue'
import { init, animate } from './metaverse';
import { NFTProvider, DemoNFTs } from './nft-api';
import { addPainting } from './generateWorld';
import { MoralisProvider } from './moralis';
import { NFTPortProvider } from './NFTport';

//createApp(App).mount('#app')

async function main() {
  const goofballCommunityAddress = '0x56addf051984b4cc93102673fcfa9d157a0487c8';

  init();
  animate();

  //const provider = new DemoNFTs() as NFTProvider;
  //const provider = new MoralisProvider() as NFTProvider;
  const provider = new NFTPortProvider() as NFTProvider;

  const nfts = await provider.getNFTs(goofballCommunityAddress);
  for (const nft of nfts) {
      console.log(nft);
      addPainting(nft.imageUrl);
  }
}

main();
