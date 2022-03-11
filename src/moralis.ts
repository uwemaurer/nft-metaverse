import { moralisGetNFTs, moralisInit } from './moralis-helper';
import { NFT, NFTProvider } from './nft-api';

export class MoralisNFTs implements NFTProvider {
  async getNFTs(address: string): Promise<NFT[]> {
    await moralisInit();
    const response = await moralisGetNFTs(address);
    return (response.result as any[]).map(
      (it) => {
        // the metadata is returned as string field and needs to be parsed
        const meta = JSON.parse(it.metadata);
        const image = meta?.image;
        return {
          contract: it.token_address,
          name: it.name,
          tokenId: it.token_id,
          imageUrl: image,
        } as NFT;
      }
    ).filter(it => it.imageUrl);
  }
}
