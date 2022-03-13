import { moralisCurrentAddress, moralisGetNFTs, moralisInit, moralisLogin, moralisLogout, moralisSave } from './moralis-helper';
import { NFT, NFTProvider, LoginProvider } from './nft-api';
import { ref } from 'vue';

export const currentAddress = ref(null as string | null);

export class MoralisProvider implements NFTProvider {
  async getNFTs(address: string): Promise<NFT[]> {
    await moralisInit();
    const response = await moralisGetNFTs(address);
    return (response.result as any[])
      .map((it) => {
        // the metadata is returned as string field and needs to be parsed
        const meta = JSON.parse(it.metadata);
        const image = meta?.image;
        return {
          contract: it.token_address,
          name: it.name,
          tokenId: it.token_id,
          imageUrl: image,
        } as NFT;
      })
      .filter((it) => it.imageUrl);
  }

  async saveFile(file: string, data: any) {
    return await moralisSave(file, data);
  }
}

export const moralis = new MoralisProvider();

class MoralisLoginProvider implements LoginProvider {
  async login(): Promise<void> {
    await moralisLogin();
  }
  
  async logout(): Promise<void> {
    await moralisLogout();
  }

  currentAddress(): string {
    return moralisCurrentAddress();
  }
}

export const moralisLoginProvider = new MoralisLoginProvider();