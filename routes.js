const express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Meme = require('./schemas/meme');

var fs = require('fs');

router.get('/', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    var credentials = req.body;
    
    if (!credentials.username || !credentials.password) {
        res.redirect('/');
    } else if (credentials.username === 'user' && credentials.password === 'pass') {
        res.redirect('/home');
    } else {
        console.log(credentials.username + '\n' + credentials.password);
        res.redirect('/');
    }
});

router.get('/home', function(req, res) {
    res.render('home');
});

router.get('/kings', function(req, res) {
   Meme.find({}).sort({likes: -1}).limit(5).exec(function(err, response) {
        if (err) {
            // render with error
            console.log(err);
            res.render('kings');
        } else {
            res.render('kings', {
                memes: response
            });
        }
    });
});

router.get('/browse', function(req, res) {
    Meme.find({}).sort({created: -1}).exec(function(err, response) {
        if (err) {
            // render with error
            console.log(err);
            res.render('browse');
        } else {
            res.render('browse', {
                memes: response
            });
        }
    });   
});

router.post('/addLike/:id', function(req, res) {
    Meme.findOneAndUpdate({_id: req.params.id}, { $inc: { likes: 1}}, { new: true }, function(err, response){
        if(err){
            console.log("Couldn't update: " + err);
        } else {
            Meme.find({_id: req.params.id}).select('likes').exec(function(err, response) {
                if(err) {
                    console.log(err);
                } else {
                    req.app.io.emit('updateLikes', response[0]._doc);
                }
            });
        }
    });
});

router.post('/addComment/:id', function(req, res) {
    Meme.findOneAndUpdate({_id: req.params.id}, {$push: {comments: req.body.comment}}, function(err, response) {
        if(err) {
            console.log("Couln't update: " + err);
        } else {
            Meme.find({_id: req.params.id}).select('comments').exec(function(err, response) {
                if(err) {
                    console.log(err);
                } else {
                    req.app.io.emit('updateComments', response[0]._doc);
                }
            });
        }
    });
});

router.get('/category/:category?', function(req, res) {
    
    var category = req.params.category;
    
        if(category) {
            Meme.find({category:category}).sort({created: -1}).exec(function(err, response) {
                if (err) {
                    // render with error
                    console.log(err);
                    res.render('category');
                } else {
                    res.render('categoryPage', {
                        memes: response
                    });
                }
            }); 
        }
        else {
            Meme.find().distinct('category', function(err, response) {
                if (err) {
                    // render with error
                    console.log(err);
                    res.render('category');
                } else {

                    console.log(response);

                    res.render('category', {
                        categories: response
                    });
                }

            });
        }
    

});

router.post('/upload', function(req, res) {
    var file = req.files.memeFile;
    var fileName = Date.now() + '-' + file.name;
    var path = __dirname + '/memeUploads/' + fileName;
    
    file.mv(path, function(err) {
        if(err) {
            // redirect with error
            console.log(err);
            res.redirect('/browse');
        } else {
            var newMeme = req.body;
            
            var meme = new Meme({
                imageSrc: fileName,
                category: newMeme.category,
                title: newMeme.title,
                likes: 0,
                comments: [],
                created: Date.now()
            });
            
            meme.save();
            
            res.redirect('/browse');
        }
    });
});

module.exports = router;
