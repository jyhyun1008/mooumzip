import { createRouter, useBase } from "h3";
import { initSocket } from "~~/server/socket"
import jwt from 'jsonwebtoken'
import * as querystring from "querystring"

const config = useRuntimeConfig()
const router = createRouter()

router.get(
    '/socket.io',
    defineEventHandler((event)=>initSocket(event))
)

router.post('/data', defineEventHandler(async (event) => {
    var params = await readBody(event)

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
    var authRes = await fetch(googleAuthUrl, googleAuthParam)
    var authData = await authRes.json()
    var googleAccessToken = authData.access_token
    console.log(params)

    if (params.type == 'getUser') {
        const googleSheetUsersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/users!A2:A`
        const googleSheetParam = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + googleAccessToken,
            },
        }
        var userRes = await fetch(googleSheetUsersUrl, googleSheetParam)
        var userData = await userRes.json()
        var userDataArray = userData.values[0][0]
        return userDataArray
    } else if (params.type == 'getItem') {

    } else if (params.type == 'postUser') {
        if (params.value) {
            const googleSheetUsersUrl2 = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/users!A2:A2?valueInputOption=RAW`
            const googleSheetParam2 = {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + googleAccessToken,
                },
                body: JSON.stringify({
                    "values": [[params.value]]
                })
            }
            var userData = await fetch(googleSheetUsersUrl2, googleSheetParam2)
            return{
                response: 'ok'
            }
        } else {
            return {
                response: 'uk'
            }
        }
    }
})
)

export default useBase('/api', router.handler)