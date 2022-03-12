import { sequence } from '0xsequence';
import Web3Modal from '@0xsequence/web3modal';
import { ethers } from 'ethers';
import { LoginProvider } from './nft-api';

let providerOptions = {
    sequence: {
      package: sequence,
      options: {
        appName: 'NFT Metaverse',
        defaultNetwork: 'polygon',
      },
    },
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
});

let address: string | null = null;
async function loginWithSequence() {
  const wallet = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(wallet);
  if (provider && provider.getSigner()) {
    address = await provider.getSigner().getAddress();
  }
}

class SequenceLoginProvider implements LoginProvider {
  async login(): Promise<void> {
    await loginWithSequence();
  }

  logout(): Promise<void> {
    web3Modal.clearCachedProvider();
    address = null;
    return Promise.resolve();
  }

  currentAddress(): string {
    return address;
  }
}

export const sequenceLoginProvider = new SequenceLoginProvider();
