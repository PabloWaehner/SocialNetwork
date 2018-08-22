import React from "react";
import { connect } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    endFriendship
} from "./Actions";
import Header from "./Header";

import { Link } from "react-router-dom";

const mapStateToProps = state => {
    console.log("state.users: ", state.users);
    return {
        friends: state.users && state.users.filter(f => f.status == "friends"),
        pending: state.users && state.users.filter(f => f.status == "pending")
    };
};

// This component does not have to be exported
class Friends extends React.Component {
    // the state object has been removed.
    // The Redux store will be responsible for managing the state
    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
    }

    render() {
        const { friends, pending } = this.props;
        console.log("i get something here friends: ", friends);
        console.log("i get something here pending: ", pending);

        if (!friends && !pending) {
            return null;
        }

        const handleFriendClick = pendingFriend => {
            this.props.dispatch(acceptFriendRequest(pendingFriend.id));
        };

        const handleUnfriendClick = friendAlready => {
            this.props.dispatch(endFriendship(friendAlready.id));
        };

        return (
            <div>
                <Header />
                <h1 align="center">Friends</h1>
                <div className="friends-rendered">
                    {friends.map(friend => (
                        <div key={friend.id} className="single-friend">
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    className="friendspics"
                                    src={friend.image}
                                />
                            </Link>
                            <p style={{ fontWeight: "bold", margin: 5 }}>
                                {friend.first_name} {friend.last_name}
                            </p>
                            <div className="button">
                                <button
                                    onClick={e => handleUnfriendClick(friend)}
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <h1 style={{ marginTop: +30 }} align="center">
                    People who want to be friends with you
                </h1>
                <div className="friends-rendered">
                    {pending.map(wannabe => (
                        <div key={wannabe.id} className="single-friend">
                            <Link to={`/user/${wannabe.id}`}>
                                <img className="wannabes" src={wannabe.image} />
                            </Link>
                            <p style={{ fontWeight: "bold", margin: 5 }}>
                                {wannabe.first_name} {wannabe.last_name}
                            </p>
                            <div className="button">
                                <button
                                    onClick={e => handleFriendClick(wannabe)}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
