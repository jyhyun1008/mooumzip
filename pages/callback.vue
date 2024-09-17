<template>
    <div id="userInfo">{{ userDataArray }}</div>
    <div id="token">{{ googleAccessToken }}</div>
</template>

<script>

var googleAccessToken, userDataArray, fediAccessToken, account, userId, username, nickname, sessionHost

export default {
    async setup() {
        const config = useRuntimeConfig()
        if (process.server){
            const jwt = require('jsonwebtoken');
            const querystring = require("querystring");
            
            var secretKey = config.privateKey.replace(/\\n/gm, '\n')

            var token = jwt.sign(
                { "iss": config.clientEmail, "scope": "https://www.googleapis.com/auth/spreadsheets", "aud": "https://oauth2.googleapis.com/token" },
                secretKey,
                { algorithm: 'RS256', expiresIn: "1h", keyid: config.privateKeyId }
            );

            const googleAuthUrl = 'https://oauth2.googleapis.com/token'
            const googleAuthParam = {
                method: 'POST',
                headers: {
                    'content-type': "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: token
                })
            }

            var authRes = await $fetch(googleAuthUrl, googleAuthParam)
            googleAccessToken = authRes.access_token

            const googleSheetUsersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/users!A2:A`
            const googleSheetParam = {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + authRes.access_token,
                },
            }
            var userData = await $fetch(googleSheetUsersUrl, googleSheetParam)
            userDataArray = userData.values[0][0]
        }

        return { googleAccessToken, userDataArray }
    },
    mounted() {

        const config = useRuntimeConfig()
        async function register() {
            //if (import.meta.client) {
            function getQueryStringObject() {
                var a = window.location.search.substr(1).split('&');
                if (a == "") return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p = a[i].split('=', 2);
                    if (p.length == 1)
                        b[p[0]] = "";
                    else
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;
            }

            var qs = getQueryStringObject()
            var code = qs.code

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
                
            } else {
                alert('잘못된 접근입니다.')
            }

        }

        register()

        userDataArray = String(document.querySelector('#userInfo').innerText)
        googleAccessToken = String(document.querySelector('#token').innerText)
        account = String(localStorage.getItem('account'))

        document.querySelector('#userInfo').innerText = ''
        document.querySelector('#token').innerText = ''

        if (!userDataArray.includes(`"username": "${localStorage.getItem("signinId").split('@')[1]}", "host": "${sessionHost}"`)) {
            userDataArray = userDataArray.replace('}]}}]}', `}]}}, ${account.replace(/\\"/gm, '"')}]}`)
            saveGoogleSheet(userDataArray, googleAccessToken)
        }
        async function saveGoogleSheet(userDataArray, token) {
            const googleSheetUsersUrl2 = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/users!A2:A2?valueInputOption=RAW`
            const googleSheetParam2 = {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    "values": [[userDataArray]]
                })
            }
            var userData = await $fetch(googleSheetUsersUrl2, googleSheetParam2)
        }
        console.log(userDataArray)
        location.href = `/room/${localStorage.getItem("signinId")}`
    }
}
</script>

<style scoped>
#userInfo, #token {
    display: none;
}
</style>