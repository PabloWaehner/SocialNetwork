const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const ca = require("chalk-animation");
const db = require("./db/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const uidSafe = require("uid-safe");
// const s3 = require("./s3");
const config = require("./config");
const path = require("path");
const multer = require("multer");

const server = require("http").Server(app); //////////////
const io = require("socket.io")(server, {
  origins: "localhost:8080 pablowaehnersocialnetwork.herokuapp.com:*"
}); ///////////

const cookieSessionMiddleware = cookieSession({
  ///////////
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware); ////////////
io.use(function(socket, next) {
  ///////////////
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});
const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/", function(req, res) {
//     res.sendStatus(200);
// });

app.use(bodyParser.json());

// app.use(
//     // goes before the csurf
//     cookieSession({
//         secret: `I'm always angry.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(compression());
//
app.use(csurf());

app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});
//
if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/login", (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.json({
      error: "All fields are required"
    });
  } else {
    db.getUsers().then(loggingin => {
      for (var i = 0; i < loggingin.length; i++) {
        if (loggingin[i].email == req.body.email) {
          var compare = loggingin[i].hashed_password;
          var userID = loggingin[i].id;
        }
      }
      if (!compare) {
        res.json({
          error: "Invalid username or password"
        });
      } else {
        db.checkPassword(req.body.password, compare)
          .then(passwordMatch => {
            console.log("is the password correct?: ", passwordMatch);
            if (passwordMatch) {
              req.session.userID = userID;
              console.log("userIDinlogin: ", userID);
              // console.log("loggingin: ", loggingin);
              res.json(loggingin);
            } else {
              res.json({
                error: "Invalid username or password" //both have the same error message. This prevents attackers from enumerating valid usernames without knowing their passwords.
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }
});

app.post("/registration", (req, res) => {
  console.log("inside POST /registration", req.body);

  if (
    !req.body.firstname ||
    !req.body.lastname ||
    !req.body.email ||
    !req.body.password
  ) {
    res.json({
      error: "All fields are required"
    });
  } else {
    db.getUsers().then(loggingin => {
      for (var i = 0; i < loggingin.length; i++) {
        if (loggingin[i].email == req.body.email) {
          var compare = true;
        }
      }
      if (compare) {
        res.json({
          error: "That email is already taken"
        });
      } else {
        db.hashPassword(req.body.password).then(hashedPassword => {
          db.register(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            hashedPassword
          )
            .then(signedup => {
              req.session.userID = signedup.id;
              console.log("userID-registration: ", req.session.userID);
              res.json({ success: true });
            })
            .catch(err => {
              console.log(err);
            });
        });
      }
    });
  }
});

app.get("/welcome", (req, res) => {
  console.log("req.session: ", req.session);
  if (req.session.userID) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.post("/upload", uploader.single("file"), (req, res) => {
  // app.post("/upload", (req, res) => {
  // app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  console.log("the file is: ", req.file);
  db.updateUserImage(req.session.userID, req.file.filename)
    // db.updateUserImage(req.session.userID, config.s3Url + req.file.filename)
    .then(results => {
      console.log("req.file: ", results);
      res.json({
        url: req.file.filename,
        // url: config.s3Url + req.file.filename,
        success: true
      });
    })
    .catch(() => res.sendStatus(500));
});

app.get("/user", (req, res) => {
  console.log("user1");
  if (!req.session.userID) {
    res.redirect("/");
  }
  db.getUserById(req.session.userID)
    .then(data => {
      console.log("user2: ", data);
      res.json({
        ...data,
        image: data.image || "/default.png"
      });
      // res.json(data);
    })
    .catch(err => {
      console.log("logging error", err);
      res.sendStatus(500);
    });
});

app.post("/uploadBio", (req, res) => {
  db.addBio(req.session.userID, req.body.bio)
    .then(userUpdatedBio => {
      console.log("biography: ", req.body.bio);
      res.json({
        success: true,
        info: userUpdatedBio
      });
    })
    .catch(err => {
      res.sendStatus(500);
      console.log(err);
    });
});

app.get("/user/:id.json", function(req, res) {
  console.log("user/:id");
  if (req.session.userID == req.params.id) {
    res.json({
      redirect: "/"
    });
  } else {
    db.getUserById(req.params.id).then(data => {
      console.log("user.data: ", data);
      res.json({
        ...data
        // image: data.image || "/mundo.png"
      });
    });
  }
});

app.get("/friendships/:id", function(req, res) {
  console.log("req1: ", req.session.userID, "params: ", req.params.id);
  db.getFriendshipStatus(req.session.userID, req.params.id).then(results => {
    res.json({
      ...results
    });
  });
});

app.post("/friendships/pending/:id", function(req, res) {
  db.pendingFriend(req.session.userID, req.params.id).then(results => {
    res.json({
      success: true
    });
  });
});

app.post("/friendships/cancel/:id", function(req, res) {
  db.cancelRequest(req.session.userID, req.params.id).then(results => {
    res.json({
      success: true
    });
  });
});

app.post("/friendships/accept/:id", function(req, res) {
  db.acceptFriend(req.session.userID, req.params.id).then(results => {
    res.json({
      success: true
    });
  });
});

app.get("/wannabes-friends", function(req, res) {
  console.log("wannabes-friends: ", req.session.userID);
  db.listOfFriends(req.session.userID).then(results => {
    res.json({ results });
  });
});

app.get("*", function(req, res) {
  if (!req.session.userID) {
    res.redirect("/welcome");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

// app.listen(process.env.PORT || 8080, () =>
//     ca.rainbow("listening on port 8080")
// );
//
//
//
//
// socket.id changes every time for every user
let connectedSockets = [];
let chatMessages = [];

io.on("connection", function(socket) {
  // console.log("socket: ", socket);
  if (!socket.request.session || !socket.request.session.userID) {
    return socket.disconnect(true);
  }

  const userId = socket.request.session.userID;

  connectedSockets.push({ socketId: socket.id, userId: userId });

  console.log("connected sockets: ", connectedSockets);

  let onlineUsers = connectedSockets.map(elem => {
    console.log("elem: ", elem);
    return elem.userId;
  });
  console.log("online: ", onlineUsers);

  db.getUsersByIds(onlineUsers).then(results => {
    console.log("results-connection: ", results);
    socket.emit("onlineUsers", results);
  });
  // /////////////
  const wasAlreadyHere =
    connectedSockets.filter(s => s.userId == userId).length > 1;

  console.log("wasAlreadyHere: ", wasAlreadyHere);

  if (!wasAlreadyHere) {
    db.getUserById(userId).then(results => {
      socket.broadcast.emit("userJoined", results);
    });
  }

  socket.on("disconnect", function() {
    if (!wasAlreadyHere) {
      console.log("disconnect");
      db.getUserById(userId).then(results => {
        socket.broadcast.emit("userLeft", results);
      });
    }
    delete onlineUsers[socket.id];
  });

  socket.emit("recentMessages", chatMessages);

  socket.on("chatMessage", function(newMessage) {
    db.getUserById(userId).then(results => {
      let completNewMessage = {
        firstname: results.first_name,
        lastname: results.last_name,
        image: results.image,
        userId: socket.request.session.userID,
        content: newMessage,
        date: new Date().toLocaleString("en-GB") //"en-GB" para que aparezca como AM o PM
      };

      chatMessages = [completNewMessage, ...chatMessages];
      io.sockets.emit("newMessage", completNewMessage);
      if (chatMessages.length > 10) {
        chatMessages.pop();
      }
      console.log("chat messages: ", chatMessages);
      console.log("completNewMessage: ", completNewMessage);
    });
  });
});

server.listen(process.env.PORT || 8080, () =>
  ca.rainbow("listening on port 8080")
); // it's server, not app, that does the listening
