// import Moralis from 'moralis';

// moralis SDK does not work well with vite
// "Uncaught TypeError: Super expression must either be null or a function"
// switched to good old javascript and import the API with a script tag in index.html

let init = false;

export async function moralisInit() {
  if (init) {
    return;
  }
  init = true;
  const serverUrl = 'https://noqzp7ynhfot.usemoralis.com:2053/server';
  const appId = 'Hy1UybrXon9Wvd5TyKEz17feF4VcOARB3na6eWWJ';
  await Moralis.start({ serverUrl, appId });
}

export function moralisCurrentAddress() {
  const user = Moralis.User.current();
  return user ? user.get('ethAddress') : null;
}

/* Authentication code */
export async function moralisLogin() {
  let user = Moralis.User.current();
  if (!user) {
    return await Moralis.authenticate({ signingMessage: 'Log in using Moralis' }).then(function (
      user
    ) {
      console.log('logged in user:', user);
      const address = user.get('ethAddress');
      console.log(address);
      return user;
    });
  } else {
    return user;
  }
}

export async function moralisLogout() {
  await Moralis.User.logOut();
  console.log('logged out');
}

export async function moralisGetNFTs(address) {
  const options = {
    chain: 'mainnet',
    address,
  };
  return await Moralis.Web3API.account.getNFTs(options);
}

export async function moralisSave(fileName, object) {
  const file = new Moralis.File(fileName, { base64: btoa(JSON.stringify(object)) });
  await file.saveIPFS();
  return file;
}
