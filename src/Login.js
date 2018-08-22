import React, { Component } from "react";
// import axios from "axios";
import axios from "./axios";
// here I'm importing Component from "react", that's why I don't need to write "React.Component"
class Login extends Component {
    constructor() {
        super();

        this.state = {
            error: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("Running handleSubmit", this.state);
        axios.post("/login", this.state).then(resp => {
            console.log("resp.data: ", resp.data);
            if (resp.data.error) {
                this.setState({
                    error: resp.data.error
                });
            } else {
                location.replace("/");
            }
        });
    }
    render() {
        return (
            <div className="login">
                <h1 className="title">Welcome to Mondo</h1>
                <h1 style={{ marginTop: -8, color: "#303030" }}>
                    Connecting you
                </h1>
                <div className="positioning">
                    <img
                        className="world-image"
                        src="/earth-spinning-rotating-animation-24.gif"
                    />
                    <div className="positioning-form1">
                        <h1 className="margin-bottom">Log In</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input
                                    onChange={this.handleChange}
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                />
                            </div>
                            <div className="center-button">
                                <input
                                    onChange={this.handleChange}
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                />
                                <div>
                                    <button
                                        className="submit-button"
                                        type="submit"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </div>
                        </form>
                        {this.state.error ? (
                            <div>ERROR: {this.state.error}</div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
