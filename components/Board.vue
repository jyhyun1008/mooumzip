<template>
    <div id="boardbox" style="display: none;">
        <div class="back" onclick="boardEnd()"><i class="las la-arrow-left"></i></div>
        <div id="board">
            <div class="board-context">
                <div class="board">
                    <div class="feed-title">{{boardPage.cw}}</div>
                    <div class="board-info">
                        <div class="board-avatar"><img class="avatar" :src="boardPage.user?.avatarUrl"></div>
                        <div class="feed-nickname">{{boardPage.user?.name}}</div>
                    </div>
                </div>
                <MDCRenderer v-if="boardPage.text?.body" class="feed-text" :body="boardPage.text?.body" :data="boardPage.text?.data" />
                <div v-if="boardPage.files?.length > 0">
                    <img :src="boardPage.files[0].url" style="width:100%;">
                </div>
                <div v-if="boardPage.media_attachments?.length > 0">
                    <img :src="boardPage.media_attachments[0].url" style="width:100%">
                </div>
                <div class="backToList" @click="boardPage = '';BackToBoardList()">Back to List</div>
            </div>
            <div style="border-bottom: 1px solid var(--border);">
                <h4 style="padding-left: 10px;">List</h4>
            </div>
            <div v-for="(note, i) in props.boardPosts.filter((note) => note.text && note.cw)" :key="i" >
                <div class="board" @click="boardPage = note;changeBoardPage()">
                    <div class="feed-title">{{note.cw}}</div>
                    <div class="board-info">
                        <div class="board-avatar"><img class="avatar" :src="note.user.avatarUrl"></div>
                        <div class="feed-nickname">{{note.user.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import { onMounted } from 'vue';
import { defineProps } from "vue"

const props = defineProps(["boardPosts"]);
const boardPage = useState('boardPage', () => '')

function changeBoardPage() {
    document.querySelector(".board-context").style = 'display: block; border-bottom: var(--border) 1px solid;'
}

function BackToBoardList() {
    document.querySelector(".board-context").style = 'display: none; border-bottom: unset;'
}

</script>
<style scoped>

.back {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border);
}

.back i {
    margin-left: 10px;
}

#boardbox {
    display: flex;
    flex-direction: column;
}

.board {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.board-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.board-avatar {
  width: 1.4em;
  min-width: 1.4em;
  height: 1.4em;
  background-color: white;
  border-radius: 50%;
  border: var(--border) 1px solid;
  overflow: hidden;
}

.board-context {
    display: none;
}

.feed-text {
    padding: 10px;
}

.backToList {
    text-align: center;
    padding: 5px;
    background-color: var(--bg);
}

</style>