import React from "react";

//stateless functional component
function ProfilePic(props) {
  console.log("profile pic: ", props);
  return (
    <div>
      <img
        className="profilepic"
        src={props.image}
        alt={`${props.firstname} ${props.lastname}`}
        width="200"
        heigth="200"
        onClick={props.clickHandler}
      />
    </div>
  );
}
export default ProfilePic;

// another way
// function ProfilePic({ image, first, last, clickHandler }) {
//     return <img src={image} alt={`${first} ${last}`} onClick={clickHandler} />;
// }
