require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", PostSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus.";

const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var _ = require("lodash");

app.get("/", (req, res) => {
  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutText: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactText: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
  });

  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  Post.findByIdAndRemove(id, (err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/edit", (req, res) => {
  const id = req.body.postId;

  Post.findByIdAndUpdate(
    id,
    {
      title: req.body.postTitle,
      content: req.body.postContent,
    },
    (err) => {
      if (!err) {
        res.redirect("/");
      }
    }
  );
});

app.get("/edit/:postid", (req, res) => {
  const requestId = _.lowerCase(req.params.postid);

  Post.find((err, posts) => {
    posts.forEach((post) => {
      const id = _.lowerCase(post._id);
      if (id === requestId) {
        let postId = post._id;
        let postTitle = post.title;
        let postContent = post.content;
        res.render("edit", {
          postTitle: postTitle,
          postContent: postContent,
          postId: postId,
        });
      }
    });
  });
});

app.get("/post/:postid", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postid);

  Post.find(function (err, posts) {
    posts.forEach((post) => {
      const title = _.lowerCase(post.title);
      if (title === requestedTitle) {
        let postTitle = post.title;
        let postContent = post.content;
        res.render("post", { postTitle: postTitle, postContent: postContent });
      }
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
