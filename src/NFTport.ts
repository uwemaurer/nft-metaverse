import { NFT, NFTProvider } from './nft-api';

// NFTPort quotas
// https://docs.nftport.xyz/docs/nftport/ZG9jOjQwNTM3NDM0-rate-limits-and-quotas

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const authKey = '1cb45113-7679-491b-a220-ba3b1c9c1f28';

export class NFTPortProvider implements NFTProvider {
  async getNFTs(address: string): Promise<NFT[]> {
    let continuation;
    const nft = [] as NFT[];
    while (true) {
      const headers = {
        Authorization: authKey,
        'Content-Type': 'application/json',
      };
      let url = `https://api.nftport.xyz/v0/accounts/${address}?chain=ethereum&include=metadata`;
      if (continuation) {
        url += `&continuation=${continuation}`;
      }
      const result = await fetch(url, { headers });
      const resultJson = await result.json();
      continuation = resultJson.continuation;
      nft.push(
        ...resultJson.nfts.map((it) => {
          const image = it.metadata?.image;
          return {
            contract: it.contract_address,
            name: it.name,
            tokenId: it.token_id,
            imageUrl: image,
          } as NFT;
        }).filter(it => it.imageUrl)
      );

      if (continuation == null) {
        break;
      }
      await sleep(500);
    }
    return nft;
  }
}
