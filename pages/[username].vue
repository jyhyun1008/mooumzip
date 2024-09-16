<template>
    <div id="container">
        <div id="linkmap">
            <Linkmap :username="username" :host="host"/>
        </div>
        <div id="sidebar">
            <div id="jitsibox" style="display: none;">
                <div class="back" onclick="jitsiEnd()"><i class="las la-arrow-left"></i></div>
                <div id="jitsi"></div>
            </div>
            <div id="feedbox">
                <div id="profile">
                    <div id="profile-header"><img class="avatar" :src="profileBanner"></div>
                    <div id="profile-avatar"><img class="avatar" :src="profileAvatar"></div>
                    <div id="profile-nickname">{{nickname}}</div>
                    <div id="profile-username">@{{username}}@{{ host }}</div>
                    <div id="profile-bio">{{ bio }}</div>
                </div>
                <div id="feed-content">
                    <div v-for="(note, i) in notes.filter((note) => note.text)" :key="i" class="feed">
                        <div class="feed-avatar"><img class="avatar" :src="note.user.avatarUrl"></div>
                        <div class="feed-content">
                            <div class="feed-nickname">{{note.user.name}}</div>
                            <MDCRenderer class="feed-text" :body="note.text.body" :data="note.text.data" />
                            <div v-if="note.files?.length > 0">
                                <img :src="note.files[0].url" style="width:100%;">
                            </div>
                            <div v-if="note.media_attachments?.length > 0">
                                <img :src="note.media_attachments[0].url" style="width:100%">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="chatbox">
                <div id="chat-content">
                    <div class="chat">
                        <div class="chat-text">
                            Start Chat!
                        </div>
                    </div>
                </div>
                <div id="chat-send">
                    <input id="chat-send-input" autocomplete='off'/>
                    <div id="chat-send-button"><i class="las la-paper-plane"></i></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import {io} from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

var avatarPosition = {
    x: 7,
    y: 7,
    z: 0
}

export default {
mounted() {

    function reloadAvatar(res) {
        document.querySelector(".avatarfloor").innerHTML = ''
        for (var i=0; i<res.users.length; i++) {
            document.querySelector(".avatarfloor").innerHTML += `<div class="map-avatarbox"><img src="https://for.stella.place/D1/3361c7bc-f60c-4e21-b573-c59a80687344.webp" class="map-avatar" style="top: calc(236px + 16 * ${res.users[i].userPosition.x}px + 16 * ${res.users[i].userPosition.y}px); left: calc(-32px + 32 * ${res.users[i].userPosition.x}px - 32 * ${res.users[i].userPosition.y}px); z-index: ${20+res.users[i].userPosition.x+res.users[i].userPosition.y};" /><div class="map-nickname" style="top: calc(340px + 16 * ${res.users[i].userPosition.x}px + 16 * ${res.users[i].userPosition.y}px); left: calc(-100px + 32 * ${res.users[i].userPosition.x}px - 32 * ${res.users[i].userPosition.y}px); z-index: ${20+res.users[i].userPosition.x+res.users[i].userPosition.y}; width: 200px;">${res.users[i].userNickname}</div></div>`
        }
    }

    if(process.client) {

        var signinId, signinName
        if (localStorage.getItem('signinId')) {
            signinId = localStorage.getItem('signinId')
            signinName = localStorage.getItem('signinName')
        } else {
            const uuid = uuidv4();
            signinId = '@guest@'+uuid
            signinName = 'Guest'
            localStorage.setItem('signinId', signinId)
            localStorage.setItem('signinName', signinName)
        }
    console.log(signinId, signinName)

    var users = []
    const socket = io('/chat', {
        path: '/api/socket.io',
    })
    socket.on('connected', (response) => {
        socket.emit('sendInfo', {userId: signinId, userNickname: signinName, userPosition: avatarPosition})
    })
    socket.on('firstJoinInfo', (res) => {
        document.querySelector("#chat-content").innerHTML += `<div class="chat"><div class="chat-text">${res.userNickname} joined here!</div></div>`
        document.querySelector("#chat-content").scrollTop = document.querySelector("#chat-content").scrollHeight
    })
    socket.on('broadcastInfo', (res) => {
        users = res.users
        reloadAvatar(res)
    })
    socket.on('broadcastChat', (res) => {
        document.querySelector("#chat-content").innerHTML += `<div class="chat"><div class="chat-nickname"><div class="chat-nickname-overflow">${res.userNickname}</div></div><div class="chat-text">${res.text}</div></div>`
        document.querySelector("#chat-content").scrollTop = document.querySelector("#chat-content").scrollHeight
        var chatPosition = users[users.findIndex((user) => user.userId == res.userId)].userPosition
        var chatPositionTop = 16 * (chatPosition.x + chatPosition.y)
        var chatPositionLeft = 32 * (chatPosition.x - chatPosition.y)
        document.querySelector(".chatfloor").innerHTML += `<span style="top: calc(220px + ${chatPositionTop}px); left: calc(-100px + ${chatPositionLeft}px);" class="mapChat">${res.text}</span>`
        setTimeout(() => {
            document.querySelector(".mapChat").remove()
        }, 5000);
    })
    socket.on('broadcastDisconnection', (res) => {
        var disconnectUserName = users[users.findIndex((user) => user.userId == res.nickname)].userNickname
        users = res.users
        reloadAvatar(res)
        document.querySelector("#chat-content").innerHTML += `<div class="chat"><div class="chat-text">${disconnectUserName} disconnected!</div></div>`
        document.querySelector("#chat-content").scrollTop = document.querySelector("#chat-content").scrollHeight
    });

    window.addEventListener('keyup', (e) => {
    
        if (e.keyCode == 37) {
            //왼쪽 방향키
            if (avatarPosition.x > 0) {
                avatarPosition.x -= 1
                socket.emit('sendInfo', {userId: signinId, userNickname: signinName, userPosition: avatarPosition})
            }
        } else if (e.keyCode == 38) {
            //위 방향키
            if (avatarPosition.y > 0) {
                avatarPosition.y -= 1
                socket.emit('sendInfo', {userId: signinId, userNickname: signinName, userPosition: avatarPosition})
            }
        } else if (e.keyCode == 39) {
            //오른쪽
            if (avatarPosition.x < 7) {
                avatarPosition.x += 1
                socket.emit('sendInfo', {userId: signinId, userNickname: signinName, userPosition: avatarPosition})
            }
        } else if (e.keyCode == 40) {
            //아래 방향키
            if (avatarPosition.y < 7) {
                avatarPosition.y += 1
                socket.emit('sendInfo', {userId: signinId, userNickname: signinName, userPosition: avatarPosition})
            }
        } else if (e.keyCode == 13) {
            if (document.querySelector("#chat-send-input").value != '') {
                socket.emit('sendChat', {userId: signinId, userNickname: signinName, text: document.querySelector("#chat-send-input").value})
                document.querySelector("#chat-send-input").value = ''
            }
        }
    });
    }
},
async setup () {

    const route = useRoute()

    const host = route.params.username.split('@')[2]
    const username = route.params.username.split('@')[1]
    var instanceType = 'misskey'

    try {
        //미스키 api
        const misskeyApiTestUrl = 'https://'+host+'/api/emojis'
        var misskeyFetch = await $fetch(misskeyApiTestUrl)
    } catch(err1) {
        try {
            //마스토돈 api
            const mastodonApiTestUrl = 'https://'+host+'/api/v2/instance'
            var mastodonFetch = await $fetch(mastodonApiTestUrl)
            instanceType = 'mastodon'
        } catch(err2) {
            console.log('Not a valid instance')
            instanceType = ''
        }
    }

    var userId, nickname, profileAvatar, profileBanner, bio, notes

    if (instanceType == 'misskey') {

        var getProfileUrl = `https://${host}/api/users/show`
        var getProfileParam = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                username: username
            })
        }

        var getProfileFetch = await $fetch(getProfileUrl, getProfileParam)
        userId = getProfileFetch.id

        var getNoteUrl = `https://${host}/api/users/notes`
        var getNoteParam = {
        method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId
            })
        }

        nickname = getProfileFetch.name
        profileAvatar = getProfileFetch.avatarUrl
        profileBanner = getProfileFetch.bannerUrl
        bio = getProfileFetch.description
        notes = await $fetch(getNoteUrl, getNoteParam)
    } else if (instanceType == 'mastodon') {
        var getProfileUrl = `https://${host}/api/v1/accounts/lookup?acct=${username}`
        var getProfileFetch = await $fetch(getProfileUrl)

        userId = getProfileFetch.id
        nickname = getProfileFetch.display_name
        profileAvatar = getProfileFetch.avatar
        profileBanner = getProfileFetch.header_static
        bio = getProfileFetch.note

        var getNoteUrl = `https://${host}/api/v1/accounts/${userId}/statuses`
        notes = await $fetch(getNoteUrl)
        notes = notes.slice(10)
    }
    if (instanceType == 'misskey') {
        for await (let note of notes) {
            if (typeof note.text == 'string') {
                note.text = await parseMarkdown(note.text)
            }
        }
    } else if (instanceType == 'mastodon') {
        for await (let note of notes) {
            if (note.content) {
                note.text = await parseMarkdown(note.content)
                note.user = {name: nickname, avatarUrl: profileAvatar}
            }
        }
    }

    return { username, host, nickname, profileAvatar, profileBanner, bio, notes }
}
}

</script>
<style scoped>

.back {
    display: flex;
    align-items: center;
}

.back i {
    margin-left: 10px;
}

</style>