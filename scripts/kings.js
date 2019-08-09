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
            $("#commentList-" + meme._id).append($("<li>").text(meme.comments[i]));
        }
    });
});


//this.name is the id of the meme clicked on
function likeButtonClick(event) {    
    $.ajax({
        type: 'GET',
        url: '/addLike/'+this.name
    });
    
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