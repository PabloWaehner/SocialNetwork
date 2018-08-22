import React from "react";
import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/wannabes-friends");
    console.log("data-Actions", data);
    console.log("data-Actions-results", data.results);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        users: data.results
    };
}

export async function acceptFriendRequest(id) {
    const x = await axios.post(`/friendships/accept/${id}`);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function endFriendship(id) {
    const x = await axios.post(`/friendships/cancel/${id}`);
    return {
        type: "END_FRIENDSHIP",
        id
    };
}
//
//
export function userJoined(user) {
    return {
        type: "USER_JOINED",
        user
    };
}

export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users
    };
}

export function userLeft(user) {
    return {
        type: "USER_LEFT",
        user
    };
}

export function newMessage(message) {
    return {
        type: "NEW_MESSAGE",
        message
    };
}

export function recentMessages(messages) {
    return {
        type: "RECENT_MESSAGES",
        messages
    };
}
