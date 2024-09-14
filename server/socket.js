import { Server } from 'socket.io'

const options = {
    path: '/api/socket.io',
    serveClient: false
}

var users = []

export const io = new Server(options)
export function initSocket(event) {
    io.attach(event.node.res.socket?.server);
    io.of('/chat').on('connection', (socket) => {
        socket.emit('connected', {message: 'Connected'})
        socket.on('sendInfo', (info) => {
            if (users.filter((user) => user.userId == info.userId).length == 0) {
                users.push(info)
                socket['nickname'] = info.userId
                io.of('/chat').emit('firstJoinInfo', info)
            } else {
                users[users.findIndex((user) => user.userId == info.userId )].userPosition = info.userPosition
            }
            io.of('/chat').emit('broadcastInfo', {users: users})
        })
        socket.on('sendChat', (chat) => {
            io.of('/chat').emit('broadcastChat', chat)
        })
        socket.on('disconnecting', (info) => {
            console.log(info)
            users = users.filter((user) => user.userId != socket.nickname)
            io.of('/chat').emit('broadcastDisconnection', {nickname: socket.nickname, users: users})
        })
    }) 
}