import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registration";
import Login from "./Login";

function Welcome() {
    return (
        <div>
            <HashRouter>
                <div className="firstpage">
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}

export default Welcome;
