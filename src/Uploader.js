import React, { Component } from "react";
import axios from "./axios";

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.imageSelected = this.imageSelected.bind(this);
    this.upload = this.upload.bind(this);
  }
  imageSelected(e) {
    this.setState({
      imageFile: e.target.files[0]
    });
  }

  upload() {
    var self = this;
    var formData = new FormData();
    console.log("this.state.imageFile.name: ", this.state.imageFile.name);
    console.log("imageFile: ", this.state.imageFile);
    console.log("imageName: ", this.state.imageName);
    if (this.state.imageFile == "") {
      this.setState({
        error: "Select an image to upload"
      });
    } else {
      formData.append("file", this.state.imageFile);
      axios.post("/upload", formData).then(res => {
        console.log("res.data: ", res.data);
        console.log("upload() : ", res.data.url);
        console.log("this.props: ", this.props);
        if (res.data.success) {
          this.props.setImage(res.data.url);
        }
      });
    }
  }
  render() {
    return (
      <div id="profile">
        <h3>Change your profile pic</h3>
        <label id="file-label" htmlFor="file-field" />
        <input
          id="file-field"
          type="file"
          onChange={this.imageSelected}
          name=""
          value=""
        />
        <div>
          <button onClick={this.upload} name="button">
            Upload
          </button>
        </div>
      </div>
    );
  }
}

export default Uploader;
