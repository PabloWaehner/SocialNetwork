import React from "react";
import axios from "./axios";
import Button from "./Button";
import Header from "./Header";

class Opp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("componentDidMount Opp");
        axios
            .get("/user/" + this.props.match.params.id + ".json") //on the browser, I need to write http://localhost:8080/user/2 or any id
            .then(({ data }) => {
                console.log("componentDidMount Data: ", data);
                if (data.redirect) {
                    this.props.history.push("/"); //If a user attempts to view their own profile by going to the user/:id route, this redirects them to /.
                } else {
                    this.setState({
                        id: data.id,
                        firstname: data.first_name,
                        lastname: data.last_name,
                        bio: data.bio,
                        image: data.image || "/default.png",
                        created_at: data.created_at
                    });
                }
            });
    }

    render() {
        const { firstname, lastname, id, image, bio } = this.state;
        return (
            <div>
                <Header />
                <div id="others">
                    <h1 className="others">other people&apos;s profile</h1>
                    <div id="opp">
                        <div>
                            <img
                                className="profilepic-opp"
                                src={image}
                                alt={`${firstname} ${lastname}`}
                                width="100"
                                height="100"
                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <h3>{`${firstname} ${lastname}`}</h3>
                            <p className="bio">{bio}</p>
                        </div>
                    </div>
                    <Button otherUserId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default Opp;
