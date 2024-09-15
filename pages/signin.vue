<template>
    <div class="body">
        <div class="login-container">
            <h2>서버에 로그인</h2>
            <label for="server">서버 주소</label>
            <input type="text" id="server" name="server" placeholder="서버 주소를 입력하세요" required autocomplete='off'>
            <button @click="signin()">로그인</button>
        </div>
    </div>

</template>

<script>

import { v4 as uuidv4 } from 'uuid';

export default {
    mounted() {
        if (localStorage.getItem('account')) {
            location.href = location.origin
        }
    },
    methods: {
        async signin() {
            var host = document.querySelector('#server').value
            let uuid = uuidv4()

            localStorage.setItem("lastSessionId", uuid)
            localStorage.setItem("lastHost", host)

            function misskeySignin() {
                const misskeySigninUrl = 'https://'+host+'/miauth/'+uuid+'?name=Multi-Account&callback='+encodeURIComponent(location.origin)+'/callback/?permission=write:account,read:account,write:drive,write:notes'
                location.href = misskeySigninUrl;
            }

            async function mastodonSignin() {
                const mastodonCreateAppUrl = 'https://'+host+'/api/v1/apps'
                const mastodonCreateAppParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        client_name: "mooumzip",
                        redirect_uris: `${location.origin}/callback/`,
                        scopes: 'read write'
                    })
                }
                try {
                    var mastodonCreateApp = await $fetch(mastodonCreateAppUrl, mastodonCreateAppParam)
                    var client_id = mastodonCreateApp.client_id
                    var client_secret = mastodonCreateApp.client_secret
                    localStorage.setItem('client_id', client_id)
                    localStorage.setItem('client_secret', client_secret)

                    const mastodonSigninUrl = `https://${host}/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(location.origin)}%2Fcallback%2F&scope=read%20write&lang=ko-KR`
                    location.href = mastodonSigninUrl;

                } catch(err) {
                    console.log(err)
                }
            }

            try {
                //미스키 api
                const misskeyApiTestUrl = 'https://'+host+'/api/emojis'
                var misskeyFetch = await $fetch(misskeyApiTestUrl)
                misskeySignin()
            } catch(err1) {
                try {
                    //마스토돈 api
                    const mastodonApiTestUrl = 'https://'+host+'/api/v2/instance'
                    var mastodonFetch = await $fetch(mastodonApiTestUrl)
                    mastodonSignin()
                } catch(err2) {
                    document.querySelector('.login-container').innerHTML += '정확한 인스턴스 주소를 입력했는지 확인해 주세요!'
                }
            }
        }
    }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.body {
  background-color: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

input[type="text"] {
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 1rem;
  font-family: 'IBMPlexSansKR';
  width: 100%;
}

button {
  padding: 0.8rem;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  background-color: var(--accent-light);
}
</style>