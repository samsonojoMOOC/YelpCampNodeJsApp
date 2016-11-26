// all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
        // is user logged (AUTHENTICATION) in?
        if(req.isAuthenticated()){
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err){
                        req.flash("error", "Post not found");
                        res.redirect("back");
                    } else {
                        // does user owns(AUTHORIZATION) the post?
                        if(foundCampground.author.id.equals(req.user._id)){
                            next();
                        } else {
                            req.flash("error", "You don't have permission to do that");
                            res.redirect("back");
                        }
                    }
                });
        } else {
            req.flash("error", "You need to be logged in to do add a post");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged (AUTHENTICATION) in?
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    // does user owns(AUTHORIZATION) the comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to add Comment");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewareObj;