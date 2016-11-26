var express = require("express");
var router = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware") //note that this line just requires index.js automatically bcos index.js is a special file

//INDEX - Display a list of all campground
router.get("/", function(req, res){
    // Get all campgrouns from DB
    //console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
});

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            // redirect back to campgrounds
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })

});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one single campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
             //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
        }
    });
   
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground is not available");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});  
            }
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.render("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;