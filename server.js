const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

//parse requests of content type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

const dbConfig = require("./app/config/db.config.js");
db.mongoose.connect(
  `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
  {
    useNewUrlParser: true,
    userUnifiedTopology: true,
  }
);

//simple route
app.get("/", (req, res) => {
  console.log("Welcome to the home page");
  res.json({ message: "Welcome to the home page" });
});

//routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

//set up port and start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// Create 3 new roles
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }
        console.log("Added 'user' role to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }
        console.log("Added 'moderator' role to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error:", err);
        }
        console.log("Added 'admin' role to roles collection");
      });
    }
  });
}
