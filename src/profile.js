import React, { Component } from "react";
import axios from "./axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log("Running handleSubmit", this.state);
    axios.post("/uploadBio", this.state).then(resp => {
      if (resp.data.success) {
        console.log("uploadbio-resp.data: ", resp.data);
        this.props.setBio(resp.data.info.bio);
        this.props.toggleShowBio();
      }
    });
  }

  render() {
    const {
      showBio,
      toggleShowBio,
      firstname,
      lastname,
      id,
      image,
      bio
    } = this.props;

    return (
      <div>
        <div id="profile">
          <h1 className="margin-bottom">Your Profile</h1>

          <h3 className="margin-bottom">
            {firstname} {lastname}
          </h3>

          {showBio ? (
            <form onSubmit={this.handleSubmit}>
              <textarea onChange={this.handleChange} name="bio" />
              <button className="submit-button" type="submit">
                Submit
              </button>
            </form>
          ) : bio ? (
            <div id="bio">
              <p className="bio">{bio} </p>
              <p className="addbio" onClick={toggleShowBio}>
                Click here to edit your bio
              </p>
            </div>
          ) : (
            <p className="addbio" onClick={toggleShowBio}>
              Click here to add a bio
            </p>
          )}
          <p>Click on the image to change your profile picture</p>
        </div>
      </div>
    );
  }
}

export default Profile;
