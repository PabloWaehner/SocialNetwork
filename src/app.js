import React from "react"; //This line of code creates a new variable. That variable's name is React, and its value is a particular, imported JavaScript object: This imported object contains methods that you need in order to use React. The object is called the React library.
import Logo from "./Logo"; //The methods imported from 'react-dom' are meant for interacting with the DOM. The methods imported from 'react' don't deal with the DOM at all. They don't engage directly with anything that isn't part of React.
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import axios from "./axios"; //but it could be 'axios' here
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile";
import Opp from "./Opp";
import Friends from "./Friends";
import OnlineUsers from "./OnlineUsers";
import Header from "./Header";
import Chat from "./chat";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBio: false
    };

    this.toggleShowBio = this.toggleShowBio.bind(this);
    this.setBio = this.setBio.bind(this);
    this.showUploader = this.showUploader.bind(this);
    this.setImage = this.setImage.bind(this);
  }
  showUploader() {
    this.setState({
      uploaderIsVisible: !this.state.uploaderIsVisible
    });
  }
  setImage(url) {
    console.log("url-image: ", url);
    this.setState({
      image: url,
      uploaderIsVisible: false
    });
  }
  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      console.log("componentDidMount: ", data);
      console.log("this.state: ", this.state);
      console.log("props in app.js: ", this.props);
      this.setState({
        id: data.id,
        firstname: data.first_name,
        lastname: data.last_name,
        image: data.image || "default.png",
        bio: data.bio
      });
    });
    // axios.get('/get-user')
    //     .then(resp => {
    //         this.setState(resp.data)
    //     })
  }
  setBio(bio) {
    this.setState({
      bio: bio
    });
  }
  toggleShowBio() {
    this.setState({
      showBio: !this.state.showBio
    });
  }

  handlePropagation(e) {
    e.stopPropagation();
  }

  render() {
    if (!this.state.id) {
      return <div>Loading...</div>;
    }
    const {
      showBio,
      firstname,
      lastname,
      id,
      image,
      toggleShowBio,
      bio,
      setBio
    } = this.state;
    return (
      <div id="app">
        <BrowserRouter>
          <div>
            {/*<p>
                            The Route component allows you to specify a render
                            function to run for the route
                        </p>*/}
            {/*<Logo />*/}
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <Header />
                  <div id="profile">
                    <Profile
                      id={id}
                      image={image}
                      bio={bio}
                      firstname={firstname}
                      lastname={lastname}
                      showBio={showBio}
                      toggleShowBio={this.toggleShowBio}
                      setBio={this.setBio}
                    />
                    <ProfilePic
                      image={this.state.image}
                      firstname={this.state.firstname}
                      lastname={this.state.lastname}
                      clickHandler={this.showUploader}
                    />
                  </div>
                </div>
              )}
            />

            {this.state.uploaderIsVisible && (
              <div id="modal" onClick={this.showUploader}>
                <div className="equis">X</div>
                <div className="no-modal" onClick={this.handlePropagation}>
                  <Uploader setImage={this.setImage} />
                </div>
              </div>
            )}
            <Route exact path="/user/:id" component={Opp} />
            <Route exact path="/friends" component={Friends} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="/online-users" component={OnlineUsers} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
