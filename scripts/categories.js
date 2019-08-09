$(document).ready(function () {    
    $('.thumbButton').on('click', likeButtonClick);
    $('.commentButton').on('click', commentButtonClick);
    $('.postCommentBtn').on('click', postCommentButtonClick);
    
    var socket = io();
    
    socket.on('updateLikes', function(meme) {
        $('#likes-' + meme._id).html(meme.likes);
    });
    
    socket.on('updateComments', function(meme) {
        console.dir(meme);
        $('#comments-' + meme._id).html(meme.comments.length);
        $("#commentList-" + meme._id).html('');
        for(var i = 0; i < meme.comments.length; i++) {
            var commentToAdd = "<div class='commentContainer'><div class='userName'>Anonymous User:</div><div class'commentContent'><span>";
            commentToAdd += meme.comments[i];
            commentToAdd += "</span></div></div><hr>";
            $("#commentList-" + meme._id).append(commentToAdd);
        }
    });
});


//this.name is the id of the meme clicked on
function likeButtonClick(event) {
    if (window.localStorage.getItem(this.name) !== 'true') {
        $.post('/addLike/' + this.name);
        window.localStorage.setItem(this.name, 'true');
    }
}

function commentButtonClick(event) {
    $('#commentSectionWrapper' + this.name).toggle();
}

function postCommentButtonClick(event) {
    $.post('/addComment/' + this.name, {
        comment: $('#commentSection' + this.name).val()
    });
    $( ".addComment" ).val('');
}