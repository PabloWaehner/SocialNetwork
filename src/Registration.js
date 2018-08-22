import React, { Component } from "react";
// import axios from "axios";
import axios from "./axios";

import { Link } from "react-router-dom";

class Registration extends Component {
    constructor() {
        super();

        this.state = {
            error: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // () => {
            //     console.log("handleChange: ", this.state);
            // }
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("Running handleSubmit", this.state);
        axios.post("/registration", this.state).then(resp => {
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
            <div className="centering">
                <h1 className="welcome">Welcome to Mondo</h1>
                <h1 className="connecting">Connecting you</h1>
                <div className="positioning">
                    <img
                        className="world-image1"
                        src="/earth-spinning-rotating-animation-24.gif"
                    />
                    <div className="positioning-form">
                        <h1 className="margin-bottom">Registration</h1>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                onChange={this.handleChange}
                                name="firstname"
                                placeholder="Name"
                                type="text"
                            />
                            <div>
                                <input
                                    onChange={this.handleChange}
                                    name="lastname"
                                    placeholder="Lastname"
                                    type="text"
                                />
                            </div>
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
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div align="center">
                            <div>Already a member?</div>
                            <Link to="/login">Click here to Log in</Link>
                            {this.state.error ? (
                                <div className="error">
                                    ERROR: {this.state.error}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Registration;
