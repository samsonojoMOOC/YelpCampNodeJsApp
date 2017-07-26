var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware") //note that this line just requires index.js automatically bcos index.js is a special file

// INDEX - Display a list of all post
router.get("/", function(req, res){
    //Get all post from DB
    //console.log(req.user);
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts, currentUser: req.user});
        }
    });
});

// CREATE - Add new post to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to posts array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {name: name, image: image, description: desc, author: author}
    // Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            // redirect back to posts
            res.redirect("/posts");
        }
    })
});

//NEW - show form to create new post
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("posts/new");
});

//SHOW - shows more info about one single post
router.get("/:id", function(req, res){
    //find the post with provided ID
    Post.findById(req.param.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            console.log(foundPost);
            //render show template with taht post
            res.render("posts/show", {post: foundPost});
        }
    });
});

//EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            req.flash("error", "Post is not available");
        } else {
            res.render("posts/edit", {post: foundPost});
        }
    });
});

//UPDATE POST ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req,res){
    //find and update the correct campground
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatePost){
        if(err){
            res.render("/posts");
        } else {
            res.redirect("posts/" + req.params.id);
        }
    })
});

//DESTROY POST ROUTE
router.delete("/:id", middleware.checkPostOwnership, function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    })
});

module.exports = router;
