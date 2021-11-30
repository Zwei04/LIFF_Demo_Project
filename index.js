// Import stylesheets
import './style.css';

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>JS Starter</h1>`;
import liff from '@line/liff';

//const url = 'https://api.line.me/oauth2/v2.1/verify';
const url = new URL('https://api.line.me/oauth2/v2.1/verify');
const url2 = new URL('https://api.line.me/v2/profile');
const request = new XMLHttpRequest();
//request.open('GET', 'https://api.line.me/oauth2/v2.1/verify');
//request.open('POST', url);

//request.send();
//request.onload = () => {
//  console.log(request.response);
//};

const body = document.getElementById('body');

const pictureUrl = document.getElementById('pictureUrl');
const userId = document.getElementById('userId');
const displayName = document.getElementById('displayName');
const statusMessage = document.getElementById('statusMessage');
const tokenId = document.getElementById('tokenId');
const accessId = document.getElementById('accessId');
const dataFrom = document.getElementById('dataFrom');

const btnShare = document.getElementById('btnShare');
const btnLogout = document.getElementById('btnLogout');
//1656637974-pj6o1ewZ
async function main() {
  liff.ready.then(() => {
    if (liff.getOS() === 'android') {
      body.style.backgroundColor = '#888888';
    } else {
      body.style.backgroundColor = '#111111';
    }
    if (liff.isInClient()) {
      getUserProfile();
    } else {
      getUserProfile2();
    }
    btnShare.style.display = 'block';
    btnLogout.style.display = 'block';
  });

  //await liff.init({ liffId: '1656641765-MYeg7wkn' });
}
liff.init({ liffId: '1656641765-MYeg7wkn' }).then(() => {
  if (liff.isLoggedIn()) {
    main();
  } else {
    //liff.login({ redirectUri: 'https://js-mdno9d.stackblitz.io' });
    liff.login();
  }
});
//main();

async function getUserProfile() {
  const profile = await liff.getProfile();
  const token = await liff.getIDToken();
  const access = await liff.getAccessToken();
  url.searchParams.set('id_token', token);
  url.searchParams.set('client_id', '1656641765');
  request.open('POST', url);
  //var params = JSON.stringify({ id_token: token, client_id: '1656641765' });
  //request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  //request.setRequestHeader('Content-length', params.length);
  //request.setRequestHeader('Connection', 'close');
  request.send({ id_token: token, client_id: '1656641765' });
  request.onload = () => {
    if (request.status === 200) {
      const response = JSON.parse(request.response);
      pictureUrl.src = response.picture;
      dataFrom.innerHTML = '<b>DataFrom : tokenID</b>';
      userId.innerHTML = '<b>UserID : </b>' + response.sub;
      displayName.innerHTML = '<b>Name : </b>' + response.name;
      statusMessage.innerHTML = '<b>RequestStatus : </b>' + request.response;
    } else {
      pictureUrl.src = profile.pictureUrl;
      dataFrom.innerHTML = '<b>DataFrom : userID</b>';
      userId.innerHTML = '<b>userID : </b>' + profile.userId;
      displayName.innerHTML = '<b>displayName : </b>' + profile.displayName;
      statusMessage.innerHTML = '<b>requestStatus : </b>' + request.response;
      tokenId.innerHTML = '<b>TokenId : </b>' + token;
      accessId.innerHTML = '<b>AccessId : </b>' + access;
    }
  };
}

async function getUserProfile2() {
  const profile = await liff.getProfile();
  const token = await liff.getIDToken();
  const access = await liff.getAccessToken();
  url.searchParams.set('access_token', access);
  request.open('GET', url);
  //var params = JSON.stringify({ id_token: token, client_id: '1656641765' });
  //request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  //request.setRequestHeader('Content-length', params.length);
  //request.setRequestHeader('Connection', 'close');
  request.send();
  request.onload = () => {
    if (request.status === 200) {
      request.open('GET', url2);
      request.setRequestHeader('Authorization', 'Bearer ' + access);
      request.send();
      request.onload = () => {
        if (request.status === 200) {
          const response = JSON.parse(request.response);
          pictureUrl.src = response.pictureUrl;
          dataFrom.innerHTML = '<b>DataFrom : accessID</b>';
          userId.innerHTML = '<b>UserID : </b>' + response.userId;
          displayName.innerHTML = '<b>Name : </b>' + response.displayName;
        } else {
          displayName.innerHTML = '<b>requestStatus : </b>' + request.status;
          statusMessage.innerHTML =
            '<b>requestResponse : </b>' + request.response;
          accessId.innerHTML = '<b>AccessId : </b>' + access;
        }
      };
    } else {
      pictureUrl.src = profile.pictureUrl;
      dataFrom.innerHTML = '<b>DataFrom : userID</b>';
      userId.innerHTML = '<b>userID : </b>' + profile.userId;
      displayName.innerHTML = '<b>displayName : </b>' + profile.displayName;
      statusMessage.innerHTML = '<b>requestStatus : </b>' + request.response;
      tokenId.innerHTML = '<b>TokenId : </b>' + token;
      accessId.innerHTML = '<b>AccessId : </b>' + access;
    }
  };
}

async function shareMsg() {
  const result = await liff.shareTargetPicker([
    {
      type: 'text',
      text: 'This msg was shared by LIFF',
    },
  ]);
  if (result) {
    alert('Msg was shared!');
  } else {
    alert('ShareTargetPicker was cancelled by user');
  }
  liff.closeWindow();
}

btnShare.onclick = () => {
  shareMsg();
};

btnLogout.onclick = () => {
  alert('User has logged out');
  liff.logout();
};
