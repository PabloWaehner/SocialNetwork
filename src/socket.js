import {
    onlineUsers,
    userJoined,
    userLeft,
    newMessage,
    recentMessages
} from "./Actions";
import * as io from "socket.io-client";

let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", users => {
            console.log("user in socket: ", users);
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(userLeft(user));
        });

        socket.on("newMessage", message => {
            console.log("newmessage");
            store.dispatch(newMessage(message));
        });

        socket.on("recentMessages", messages => {
            console.log("recentMessages");
            store.dispatch(recentMessages(messages));
        });
    }
}

export function emitChatMessage(newChatMsg) {
    console.log("emitChatMessage");
    socket.emit("chatMessage", newChatMsg);
}
