import React, { Component } from "react";
import axios from "./axios";
import { connect } from "react-redux";
import { emitChatMessage } from "./socket";
import Header from "./Header";

const mapStateToProps = state => {
    console.log("state in chat mapStateToProps: ", state.messages);
    return {
        newChatMsg: state.messages
        // newChatMsg: state.chat?? state.chatMessage??
    };
    console.log("state.onlineUsers-chat: ", state.messages[0]);
};

class Chat extends Component {
    constructor() {
        super();
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();
        let newChatMsg;
        emitChatMessage(this.state.chatMessage);
        console.log("state-chats: ", this.state.chatMessage);
        document.querySelector(".textarea-chats").value = "";
        this.setState({ chatMessage: null });
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }

    render() {
        const { newChatMsg } = this.props;
        if (!newChatMsg) {
            return null;
        }
        // let newChatMsgArray = newChatMsg.slice(-10);
        console.log("chatMessage nowwww: ", this.props.newChatMsg);
        console.log("chatMessage this props: ", this.props);

        return (
            <div ref={elem => (this.elem = elem)}>
                <Header />
                <div className="chats">
                    <h1 align="center">Chats</h1>

                    <div className="chatMessages">
                        <div className="chatform">
                            <form onSubmit={this.handleClick}>
                                <button
                                    className="submit-button-chats"
                                    type="submit"
                                >
                                    Send message
                                </button>
                                <div>
                                    <textarea
                                        cols="110"
                                        rows="5"
                                        onChange={this.handleChange}
                                        name="chatMessage"
                                        className="textarea-chats"
                                        placeholder="type here..."
                                    />
                                </div>
                            </form>
                        </div>
                        {newChatMsg.map((message, i) => (
                            <div key={i} className="message">
                                <div>
                                    <img
                                        className="chatpics"
                                        src={message.image}
                                    />
                                </div>
                                <div className="content">
                                    <div style={{ fontWeight: "bold" }}>
                                        {message.firstname} {message.lastname}:{" "}
                                    </div>
                                    <div>{message.content}</div>
                                    <div className="message-date">
                                        {message.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
