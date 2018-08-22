export default function(state = {}, action) {
    if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            messages: [action.message, ...state.messages]
        };
        console.log("reducers action.message: ", action.message);
        console.log("reducers ...state.messages: ", ...state.messages);
    }

    if (action.type == "RECENT_MESSAGES") {
        state = {
            ...state,
            messages: action.messages
        };
        console.log("reducers action.message2: ", action.messages);
        console.log("reducers ...state.messages2: ", ...state.messages);
    }

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            onlineUsers: action.users
        };
        console.log("state for online users: ", state);
        console.log("action.users for online users: ", action.users);
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [action.user, ...state.onlineUsers]
        };
        console.log("state for user joined: ", state);
        console.log("action.user for online users: ", action.user);
        console.log("state.onlineUsers reducers", state.onlineUsers);
    }

    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.user.id
            )
        };
        console.log("state for user joined: ", state);
        console.log("action.user left: ", action.user);
        console.log("state.users left reducers", state.onlineUsers);
    }

    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            users: action.users
        };
    }
    if (
        action.type == "ACCEPT_FRIEND_REQUEST" ||
        action.type == "END_FRIENDSHIP"
    ) {
        console.log("action-reducer: ", state.users);
        state = {
            ...state,
            users: state.users.map(user => {
                console.log("user-reducer: ", user);
                if (
                    user.id == action.id &&
                    action.type == "ACCEPT_FRIEND_REQUEST"
                ) {
                    console.log("getting into first if");
                    return {
                        ...user,
                        friend: action.type == "ACCEPT_FRIEND_REQUEST",
                        status: "friends"
                    };
                } else if (
                    user.id == action.id &&
                    action.type == "END_FRIENDSHIP"
                ) {
                    return {
                        ...user,
                        not: action.type == "END_FRIENDSHIP",
                        status: "no friendship"
                    };
                } else {
                    return user;
                }
            })
        };
    }
    console.log("state-reducer: ", state);
    return state;
}

//
// export function otherUsers(state = [], action) {
//     switch (action.type) {
//         case "RECEIVE_FRIENDS_WANNABE":
//             return action.users;
//
//         case "ACCEPT_FRIEND_REQUEST":
//             return state.map(user => {
//                 if (user.id == action.id) {
//                     return {
//                         ...user,
//                         status: "friends"
//                     };
//                 }
//                 return user;
//             });
//
//         case "END_FRIENDSHIP":
//             return state.map(user => {
//                 if (user.id == action.id) {
//                     return {
//                         ...user,
//                         status: "no friendship"
//                     };
//                 }
//                 return user;
//             });
//     }
//     return state;
// }
