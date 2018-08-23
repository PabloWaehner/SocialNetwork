import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./Header";

const mapStateToProps = state => {
  console.log("state in online users mapStateToProps: ", state);
  return {
    onlineUsers: state.onlineUsers
  };
  console.log("state.onlineUsers: ", state.onlineUsers);
};

class OnlineUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createFriendsOnlineView(onlineFriends) {
    if (onlineFriends.length > 0) {
      return (
        <div className="img-name">
          {onlineFriends.map(onlineFriends => (
            <div key={onlineFriends.id}>
              <div>
                <div className="wrapper-friends-img">
                  <Link to={`/user/${onlineFriends.id}`}>
                    <div className="circle" />
                    <img
                      className="friends-img"
                      src={onlineFriends.image || "/default.png"}
                    />
                  </Link>
                  <Link
                    className="linktoprofile"
                    to={`/user/${onlineFriends.id}`}
                  >
                    {onlineFriends.first_name} {onlineFriends.last_name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <div>No friends online</div>;
  }

  render() {
    if (!this.props.onlineUsers) {
      return null;
    }
    return (
      <div>
        <div>
          <Header />
          <h1 className="friends-title">Online Users</h1>
          <div>{this.createFriendsOnlineView(this.props.onlineUsers)}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(OnlineUsers);
