<template>
  <div id="app">
    <NuxtLayout>
      <div id="nav">
          <div id="logo"><a href="/">MOOUM.ZIP</a></div>
          <div id="nav-list">
            <div class="nav-item">About</div>
            <div class="nav-item" id="signin"></div>
          </div>
      </div>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script>

export default {
    mounted() {
        if (localStorage.getItem('account')) {
            document.querySelector('#signin').innerHTML = '<a href="/signout">Sign Out</a>'
        } else {
          document.querySelector('#signin').innerHTML = '<a href="/signin">Sign In</a>'
        }
    }
  }
</script>
<style>

@font-face {
    font-family: 'IBMPlexSansKR';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/IBMPlexSansKR-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'IBMPlexSansKR';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/IBMPlexSansKR-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
}

:root {
  --accent: #ff9899;
  --accent-light: #ffddcc;
  --fg: #60606d;
  --border: #d7d7de;
  --bg: #f8f8fb;
}

body {
  font-family: 'IBMPlexSansKR';
  margin: 0;
  background-color: var(--bg);
  color: var(--fg);
  overflow: hidden;
  overscroll-behavior-x: none;
}

#app>*:not(*:first-child) {
  display: none;
}

#nav {
  position:fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--border) 1px solid;
}

#nav-list {
  display: flex;
  align-items: center;
}

#logo {
  font-weight: 700;
  padding: 0 20px;
  font-size: 1.2em;
}

#nav a {
  color: inherit;
  text-decoration: none;
}

.nav-item {
  padding: 0 20px;
}

#container {
  display: flex;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: calc(100vw - 40px);
  height: calc(100dvh - 90px);
  margin: 60px 10px 10px 10px;
  padding: 10px;
  overflow: hidden;
  gap: 10px;
  background-color: white;
}

#linkmap {
  flex-grow: 1;
  border-radius: 10px;
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#linkmap-title {
  padding: 10px 10px 0 15px;
  font-weight: 700;
  font-size: 1.2em;
}

#linkmap-content{
  border-radius: 5px;
  flex-grow: 1;
  margin: 10px;
  border: 1px solid var(--border);
  background-color: var(--bg);
  position:relative;
  overflow-x: hidden;
  overflow-y: hidden;
}

.linkmap {
  width: calc(9 * 64px);
  min-width: 100%;
  min-height: 100%;
  height: 600px;
  position: absolute;
  text-align: center;
  top:0;
  min-width: fit-content;
  width: fit-content;
  left: calc(100% / 2);
}

.linkmap div {
  position:relative;
  line-height: 0px;
}

.linkmap.background {
  width: 100%;
  height: 100%;
  z-index: 0;
  text-align: unset;
  left: 0;
}

.linkmap.floor {
  z-index: 1;
}

.linkmap.firstwall {
  z-index: 2;
}

.linkmap.secondwall {
  z-index: 3;
}

.linkmap.thirdwall {
  z-index: 4;
}

.linkmap img {
  position: absolute;
  width:64px;
  height:64px;
}

.linkmap>img {
  position: absolute;
}

.linkmap .map-avatar {
  width:64px;
  height:unset;
}

.map-nickname {
  display: none;
}

.map-avatarbox:hover .map-nickname {
  display: block;
}

#sidebar {
  width: 356px;
  display: flex;
  flex-direction: column;
  gap:10px;
}

.back {
  height: 2em;
}

#feedbox, #chatbox, #jitsibox {
  border-radius: 10px;
  border: 1px solid var(--border);
}

#feedbox, #jitsibox {
  flex-grow: 1;
  overflow: scroll;
}

#profile {
  position: relative;
  border-bottom: 1px solid var(--border);
}

#profile-header {
  height: 128px;
  background-color: var(--bg);
  overflow: hidden;
}

#profile-avatar {
  position: absolute;
  top: 78px;
  left: 10px;
  width: 100px;
  aspect-ratio: 1 / 1;
  background-color: white;
  border-radius: 50%;
  border: var(--border) 1px solid;
  overflow: hidden;
}

#profile-nickname {
  margin-top: 50px;
  padding: 10px 10px 0 10px;
  font-weight:700;
}

#profile-username {
  padding: 0 10px 10px 10px;
  font-size: 0.8em;
}

#profile-bio {
  padding: 0 10px 10px 10px;
}

.feed {
  border-bottom: 1px solid var(--border);
  padding: 10px;
  display: flex;
  gap: 10px;
}

.feed-avatar {
  width: 50px;
  min-width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  border: var(--border) 1px solid;
  overflow: hidden;
}

.feed-content {
  overflow-x: hidden;
}

.feed-nickname, .chat-nickname {
  font-weight: 700;
}

#chatbox {
  min-height: 256px;
  height: 256px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#chat-content {
  flex-grow: 1;
  border-bottom: 1px solid var(--border);
  overflow-y: scroll;
  overflow-x: hidden;
}

.chat {
  display: flex;
  gap: 10px;
  padding: 10px;
}

.chat-nickname {
  width:100px;
  min-width: 100px;
  overflow-x: hidden;
}

.chat-nickname-overflow {
  width: max-content;
}

.mapChat {
  position: absolute;
  z-index: 99;
  padding: 5px;
  border-radius: 15px;
  background-color: white;
  border: var(--border) 1px solid;
  width: 200px;
  text-align: center;
}

#chat-send {
  display: flex;
  gap: 10px;
}

#chat-send-input {
  flex-grow: 1;
  color: var(--fg);
  border: 0;
  font-family: 'IBMPlexSansKR';
}

#chat-send-button {
  width: 35px;
  border-left: 1px solid var(--border);
  text-align: center;
  background-color: var(--fg);
  color: var(--bg);
}

.avatar {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

#nuxt-devtools-container {
  display:none;
}

</style>