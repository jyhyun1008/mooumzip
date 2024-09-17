<template>
    <div id="linkmap-title">{{ title }}</div>
    <div id="linkmap-content">
        <div class="linkmap background">
            <img class="avatar" src="https://for.stella.place/D1/83d5f739-d53a-4e2e-9783-18d1aa707af8.webp">
        </div>
        <div class="linkmap floor" v-html="floor"></div>
        <div class="linkmap firstwall" v-html="wall1"></div>
        <div class="linkmap secondwall" v-html="wall2"></div>
        <div class="linkmap thirdwall" v-html="wall3"></div>
        <div class="linkmap firstfloor" v-html="floor1"></div>
        <div class="linkmap secondfloor" v-html="floor2"></div>
        <div class="linkmap avatarfloor" v-html="avatars"></div>
        <div class="linkmap chatfloor"></div>
    </div>

</template>

<script setup>

import { defineProps } from "vue"
var userData, itemData
var floor, wall1, wall2, wall3, floor1, floor2, avatars, title

const props = defineProps(["username", "host"]);

if (process.server){
    const config = useRuntimeConfig()
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

    const googleSheetUsersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/users!A2:A`
    const googleSheetItemsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadsheet}/values/items!A2:A`
    const googleSheetParam = {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + authRes.access_token,
        },
    }
    userData = await $fetch(googleSheetUsersUrl, googleSheetParam)
    itemData = await $fetch(googleSheetItemsUrl, googleSheetParam)

    //1층

    var myData = JSON.parse(userData.values[0][0]).users
    var myDataJson = myData[myData.findIndex((user) => user.username == props.username && user.host == props.host)]
    title = myDataJson.title
    var itemDataJson = JSON.parse(itemData.values[0][0]).items
    var floorUrl = itemDataJson[myDataJson.map.floor].Url
    var wallLeftUrl = itemDataJson[myDataJson.map.wall].leftUrl
    var wallRightUrl = itemDataJson[myDataJson.map.wall].rightUrl
    var BlankUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1024px-HD_transparent_picture.png'

    var floor = ''
    var wall1 = ''
    var wall2 = '' 
    var wall3 = ''

    for (let i=0; i< 16; i++){
        floor += `<div style="top: calc(16 * ${i}px + 284px)">`
            for (let j=0; j<9-Math.abs(7-1*i); j++){
                floor += `<img src="${floorUrl}" style="left: calc( -32px - 32 * ${2*j - (8-Math.abs(7-1*i))}px)">`
            }
        floor += '</div>'
    }

    for (let i=0; i< 9; i++){
        wall1 += `<div style="top: calc(16 * ${i}px + 236px)"><img src="${wallLeftUrl}" style="left: calc( -32px - 32 * ${i}px)">`
            for (let j=0; j<i; j++){
                wall1 += `<img src="${BlankUrl}" style="left: calc( -32px - 32 * ${2*j - i}px)">`
            }
        wall1 += `<img src="${wallRightUrl}" style="left: calc( -32px + 32 * ${i}px)"></div>`
    }

    for (let i=0; i< 9; i++){
        wall2 += `<div style="top: calc(16 * ${i}px + 204px)"><img src="${wallLeftUrl}" style="left: calc( -32px - 32 * ${i}px)">`
            for (let j=0; j<i; j++){
                wall2 += `<img src="${BlankUrl}" style="left: calc( -32px - 32 * ${2*j - i}px)">`
            }
        wall2 += `<img src="${wallRightUrl}" style="left: calc( -32px + 32 * ${i}px)"></div>`
    }

    for (let i=0; i< 9; i++){
        wall3 += `<div style="top: calc(16 * ${i}px + 172px)"><img src="${wallLeftUrl}" style="left: calc( -32px - 32 * ${i}px)">`
            for (let j=0; j<i; j++){
                wall3 += `<img src="${BlankUrl}" style="left: calc( -32px - 32 * ${2*j - i}px)">`
            }
        wall3 += `<img src="${wallRightUrl}" style="left: calc( -32px + 32 * ${i}px)"></div>`
    }

    var floor1 = ''
    var floor2 = ''
    avatars = ''

    for (let i=0; i<myDataJson.map.items.length; i++){
        var itemPlaced = myDataJson.map.items[i]
        var itemUrl
        var itemFunc = ''
        if (itemPlaced.isRotated == false) {
            itemUrl = itemDataJson[itemPlaced.itemId].frontUrl
        } else {
            itemUrl = itemDataJson[itemPlaced.itemId].rearUrl
        }
        if (itemPlaced.function) {
            itemFunc = itemPlaced.function + '()'
        } else if (itemPlaced.url) {
            itemFunc = `window.open('${itemPlaced.url}')`
        }
        if (itemPlaced.position.z == 0) {
            if (itemPlaced.isFlipped == false) {
                floor1 += `<div class="itembox" style="position: absolute; top: calc(268px + 16 * ${itemPlaced.position.x}px + 16 * ${itemPlaced.position.y}px); left: calc(-32px + 32 * ${itemPlaced.position.x}px - 32 * ${itemPlaced.position.y}px);" ><img src="${itemUrl}" style="z-index: ${20+itemPlaced.position.x+itemPlaced.position.y};" onclick="${itemFunc}"`
                if (itemPlaced.title) {
                    floor1 += ` onmouseover="playPop()";/><div class="itemtext" style="position: absolute; display: none; width: 64px; z-index: 60;">${itemPlaced.title}</div>`
                }
                floor1 += '/></div>'
            } else {
                floor1 += `<div class="itembox" style="position: absolute; top: calc(268px + 16 * ${itemPlaced.position.x}px + 16 * ${itemPlaced.position.y}px); left: calc(-32px + 32 * ${itemPlaced.position.x}px - 32 * ${itemPlaced.position.y}px);" ><img src="${itemUrl}" onclick="${itemFunc}" style="z-index: ${20+itemPlaced.position.x+itemPlaced.position.y}; transform: scaleX(-1); -webkit-transform: scaleX(-1);"`
                if (itemPlaced.title) {
                    floor1 += ` onmouseover="playPop()";/><div class="itemtext" style="position: absolute; display: none; width: 64px; z-index: 60;">${itemPlaced.title}</div>`
                }
                floor1 += `/></div>`
            }
        } else if (itemPlaced.position.z == 1) {
            if (itemPlaced.isFlipped == false) {
                floor2 += `<div class="itembox" style="position: absolute; top: calc(236px + 16 * ${itemPlaced.position.x}px + 16 * ${itemPlaced.position.y}px); left: calc(-32px + 32 * ${itemPlaced.position.x}px - 32 * ${itemPlaced.position.y}px);" ><img src="${itemUrl}" style="z-index: ${20+itemPlaced.position.x+itemPlaced.position.y};" onclick="${itemFunc}"`
                if (itemPlaced.title) {
                    floor2 += ` onmouseover="playPop()";/><div class="itemtext" style="position: absolute; display: none; width: 64px; z-index: 60;">${itemPlaced.title}</div>`
                }
                floor2 += '/></div>'
            } else {
                floor2 += `<div class="itembox" style="position: absolute; top: calc(236px + 16 * ${itemPlaced.position.x}px + 16 * ${itemPlaced.position.y}px); left: calc(-32px + 32 * ${itemPlaced.position.x}px - 32 * ${itemPlaced.position.y}px);" ><img src="${itemUrl}" style="z-index: ${20+itemPlaced.position.x+itemPlaced.position.y}; transform: scaleX(-1); -webkit-transform: scaleX(-1);" onclick="${itemFunc}"`
                if (itemPlaced.title) {
                    floor2 += ` onmouseover="playPop()";/><div class="itemtext" style="position: absolute; display: none; width: 64px; z-index: 60;">${itemPlaced.title}</div>`
                }
                floor2 += `/></div>`
            }
        }
    }
}
</script>