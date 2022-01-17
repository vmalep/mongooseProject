const express = require("express");
const { get } = require("express/lib/response");
const mongoose = require("mongoose");
const Post = require("./models/Post");

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/myBlog", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = express();
    app.use(express.json());

    app.get("/posts", async (req, res) => {
      const posts = await Post.find()
      res.send(posts)
    });

    app.post("/posts", async (req, res) => {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
      });
      await post.save();
      res.send(post);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      
      try{
        const post = await Post.find({_id: id});
        if (post.length > 0) res.send(post)
        else res.status(404).send('Post not found');
      } catch(error){
        console.log(error);
        res.status(400).send('Bad request');
      }
    });

    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      
      try{
        const post = await Post.find({_id: id}).deleteOne();
        if (post.length > 0) res.send(post)
        else res.status(404).send('Post not found');
      } catch(error){
        console.log(error);
        res.status(400).send('Bad request');
      }
    });

    app.listen(3000, () => {
      console.log("Server has started!")
    })
  })