import random from 'random';
import seedrandom from 'seedrandom';

/**
 *
 * This is a generic interface to load NFT information
 *
 * It can be implemented with different API providers
 *
 */
export interface NFT {
  contract: string;
  tokenId: string;
  name: string;
  imageUrl: string;
}

export interface NFTProvider {
  getNFTs(address: string): Promise<NFT[]>;
}

export class DemoNFTs implements NFTProvider {
 private rnd = random.clone(seedrandom('demo demo'));
  getNFTs(address: string): Promise<NFT[]> {
    const nft = [] as NFT[];
    for (let i = 0; i < 200; i++) {
      const i = this.rnd.int(1, 5472);
      const url = `https://goofballs.finemints.com/nft/${i}.png`;
      nft.push({ contract: '', name: '', tokenId: `${i}`, imageUrl: url });
    }
    return Promise.resolve(nft);
  }
}
