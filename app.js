const path = require("path");
const fs = require('fs');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// routes
const blogpost = require("./routes/blogpost");
const comments = require("./routes/comments");
const getCollection = require("./utils").getCollection;
// serving static files
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// setting template engine
app.set("view engine", "pug");
// notes urls
app.use("/blogpost", blogpost);
app.use("/comments", comments);

app.get("/", (req, res) => {
  res.render("index", { title: "Welcome", message: "Hi user!" });
});

app.get("/archive", (req, res) => {
  fs.readFile(getCollection('blogposts.json'), (err, data) => {
    if (err) res.sendStatus(500)
    
    const blogposts = JSON.parse(data).filter(blogpost => blogpost.archive == true)
    res.render("all_blogpost", { title: "Hey", blogpost: blogpost });
  })
});

// listen for requests :)
const listener = app.listen(8000, () => {
  console.log(`App is listening on port  http://localhost:8000`);
});
