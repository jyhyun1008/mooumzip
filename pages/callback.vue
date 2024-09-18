<template>
    <div id="userInfo"></div>
    <div id="token"></div>
</template>

<script setup>

import { onMounted } from 'vue';

var fediAccessToken, account, userId, username, nickname, sessionHost

var googleFetchUrl = '/api/data'
var googleFetchParam = {
    method: 'POST',
    body: JSON.stringify({
        type: 'getUser'
    })
}

const userData = await useFetch(googleFetchUrl, googleFetchParam)
var userDataArray = userData.data.value
const route = useRoute()
var code = route.query.code

async function saveGoogleSheet(userDataArray) {
    var googleFetchUrl = '/api/data'
    var googleFetchParam = {
        method: 'POST',
        body: JSON.stringify({
            type: 'postUser',
            value: userDataArray
        })
    }
    var userRes = await $fetch(googleFetchUrl, googleFetchParam)
}

async function register() {
            
    if (localStorage.getItem('lastSessionId')) {
        var sessionId = localStorage.getItem('lastSessionId')
        sessionHost = localStorage.getItem('lastHost')

        if (!code) {

            var postUrl = 'https://'+sessionHost+'/api/miauth/'+sessionId+'/check'
            var postParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({})
            }
            var tokenRes = await $fetch(postUrl, postParam)

            var token = tokenRes.token
            fediAccessToken = token
            userId = tokenRes.user.id
            username = tokenRes.user.username
            nickname = tokenRes.user.name

        } else if (code) {

            const mastodonCreateTokenUrl = 'https://'+sessionHost+'/oauth/token'
            const mastodonCreateTokenParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    code: code,
                    // client_id: authStore.user.clientId,
                    // client_secret: authStore.user.clientSecret,
                    client_id: localStorage.getItem('client_id'),
                    client_secret: localStorage.getItem('client_secret'),
                    redirect_uri: `${location.origin}/callback/`,
                    scope: 'read write'
                })
            }
            var mastodonCreateTokenResult = await $fetch(mastodonCreateTokenUrl, mastodonCreateTokenParam)
            var mastoToken = mastodonCreateTokenResult.access_token
            fediAccessToken = mastoToken
    
            const mastodonMeUrl = `https://${sessionHost}/api/v1/accounts/verify_credentials`
            const mastodonMeParam = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer `+mastoToken,
                }
            }
            var meRes = await $fetch(mastodonMeUrl, mastodonMeParam)

            userId = meRes.id
            username = meRes.username
            nickname = meRes.display_name
    
        }
        account = `{"username": "${username}", "host": "${sessionHost}", "inventory": [], "coin": 1000, "title": "${username}'s MooumZip'", "map": {"bg": 3, "wall": 1, "floor": 2, "items": [{"uid": 0, "itemId": 0, "position": {"x": 0, "y": 0, "z":0}, "isRotated": false, "isFlipped": true, "url": ""}]}}`

        localStorage.setItem("signinId", `@${username}@${sessionHost}`)
        localStorage.setItem("signinName", nickname)
        localStorage.setItem("account", account)
        localStorage.setItem("accessToken", fediAccessToken)
        localStorage.removeItem("lastSessionId")
        localStorage.removeItem("lastHost")

        if (!userDataArray.includes(`"username": "${username}", "host": "${sessionHost}"`)) {
            userDataArray = userDataArray.replace('}]}}]}', `}]}}, ${account.replace(/\\"/gm, '"')}]}`)
            saveGoogleSheet(userDataArray)
        }

        location.href = `/@${username}@${sessionHost}`
        
    } else {
        alert('잘못된 접근입니다.')
    }
}

onMounted(async() => {
    register()
})
</script>

<style scoped>
#userInfo, #token {
    display: none;
}
</style>