// import Moralis from 'moralis';

// moralis SDK does not work well with vite
// "Uncaught TypeError: Super expression must either be null or a function"
// switched to good old javascript and import the API with a script tag in index.html

export async function moralisInit() {
  const serverUrl = 'https://noqzp7ynhfot.usemoralis.com:2053/server';
  const appId = 'Hy1UybrXon9Wvd5TyKEz17feF4VcOARB3na6eWWJ';
  await Moralis.start({ serverUrl, appId });
}

/* Authentication code */
export async function moralisLogin() {
  let user = Moralis.User.current();
  if (!user) {
    await Moralis.authenticate({ signingMessage: 'Log in using Moralis' })
      .then(function (user) {
        console.log('logged in user:', user);
        console.log(user.get('ethAddress'));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export async function moralisLogout() {
  await Moralis.User.logOut();
  console.log('logged out');
}


export async function moralisGetNFTs(address) {  
  const options = {
    chain: "mainnet",
    address,
  };
  return await Moralis.Web3API.account.getNFTs(options);
}
