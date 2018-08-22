import React from "react";
import axios from "./axios";

export default class Button extends React.Component {
    constructor() {
        super();

        this.state = {};

        this.getButtonText = this.getButtonText.bind(this);
        this.updateFriendship = this.updateFriendship.bind(this);
    }

    componentDidMount() {
        console.log("this.props.otherUserId", this.props.otherUserId);
        axios.get("/friendships/" + this.props.otherUserId).then(results => {
            console.log("FRIEND: ", results);
            if (Object.keys(results.data).length == 0) {
                console.log("Object.keys(results.data).length == 0");
                this.setState({
                    status: "no friendship"
                });
            } else if (results.data.status == "pending") {
                console.log("pending friend: ", results);
                this.setState(
                    {
                        status: "pending",
                        receiverId: results.data.receiver_id
                    },
                    () => console.log("state after update: ", this.state)
                );
            } else if (results.data.status == "friends") {
                console.log("accepted friend: ", results);
                this.setState({ status: "friends" });
            }
        });
    }

    updateFriendship() {
        if (this.getButtonText() == "SEND FRIEND REQUEST") {
            axios
                .post("/friendships/pending/" + this.props.otherUserId)
                .then(results => {
                    console.log("pending");
                    console.log("Results: ", results);
                    if (results.data.success) {
                        this.setState(
                            {
                                status: "pending",
                                receiverId: this.props.otherUserId
                            },
                            () =>
                                console.log("state after pending: ", this.state)
                        );
                    }
                });
        } else if (this.getButtonText() == "CANCEL FRIEND REQUEST") {
            axios
                .post("/friendships/cancel/" + this.props.otherUserId)
                .then(results => {
                    console.log("cancel");
                    console.log("Results after cancel: ", results);
                    if (results.data.success) {
                        this.setState({ status: "no friendship" }, () =>
                            console.log("state after cancel: ", this.state)
                        );
                    }
                });
        } else if (this.getButtonText() == "ACCEPT") {
            axios
                .post("/friendships/accept/" + this.props.otherUserId)
                .then(results => {
                    console.log("accepted");
                    console.log("results for accept: ", results);
                    if (results.data.success) {
                        this.setState({ status: "friends" }, () =>
                            console.log("state after accept: ", this.state)
                        );
                    }
                });
        } else if (this.getButtonText() == "UNFRIEND") {
            axios
                .post("/friendships/cancel/" + this.props.otherUserId)
                .then(results => {
                    console.log("deleted");
                    console.log("results for delete: ", results);
                    if (results.data.success) {
                        this.setState({ status: "no friendship" }, () =>
                            console.log("state after delete: ", this.state)
                        );
                    }
                });
        }
    }

    getButtonText() {
        if (this.state.status == "no friendship") {
            return "SEND FRIEND REQUEST";
        } else if (this.state.status == "pending") {
            if (this.state.receiverId == this.props.otherUserId) {
                return "CANCEL FRIEND REQUEST";
            } else {
                return "ACCEPT";
            }
        } else if (this.state.status == "friends") {
            return "UNFRIEND";
        }
    }

    render() {
        return (
            <button onClick={this.updateFriendship}>
                {this.getButtonText()}
            </button>
        );
    }
}
