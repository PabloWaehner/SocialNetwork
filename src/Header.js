import React from "react";
import { Link } from "react-router-dom";
//stateless functional component
function Header() {
    return (
        <div className="header">
            <div className="friends-more">
                <Link to="/friends" className="links-in-header">
                    Friends & More
                </Link>
            </div>
            <div>
                <Link to="/" className="links-in-header">
                    Profile
                </Link>
            </div>
            <div>
                <Link to="/chat" className="links-in-header">
                    ChatRoom
                </Link>
            </div>
            <div>
                <Link to="online-users" className="links-in-header">
                    See who's online!
                </Link>
            </div>
            <a className="logout" href="/logout">
                Log Out
            </a>
        </div>
    );
}
export default Header;
