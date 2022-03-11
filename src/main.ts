import { createApp } from 'vue';
import App from './App.vue';
import { init, animate } from './metaverse';
import { NFTProvider, DemoNFTs } from './nft-api';
import { addPainting } from './generateWorld';
import { MoralisProvider } from './moralis';
import { NFTPortProvider } from './NFTport';
import { moralisInit, moralisLogin } from './moralis-helper';

async function main() {
  const goofballCommunityAddress = '0x56addf051984b4cc93102673fcfa9d157a0487c8';

  await moralisInit();

  createApp(App).mount('#app');

  init();
  animate();

  const moralis = new MoralisProvider();
  const provider = new DemoNFTs() as NFTProvider;
  //const provider = moralis as NFTProvider;
  // const provider = new NFTPortProvider() as NFTProvider;

  // await moralis.saveFile('test.json', { name: 'Uwe', project: 'NFT Metaverse' });

  const nfts = await provider.getNFTs(goofballCommunityAddress);
  for (const nft of nfts) {
    console.log(nft);
    addPainting(nft.imageUrl);
  }
}

main();