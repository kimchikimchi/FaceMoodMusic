// Based on doc at https://market.mashape.com/deezerdevs/deezer-1#-search

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQ3XSp6xllAtJpABRyAU1TQntVygJDv60",
    authDomain: "kimchikimchi-bootcamp-db1.firebaseapp.com",
    databaseURL: "https://kimchikimchi-bootcamp-db1.firebaseio.com",
    projectId: "kimchikimchi-bootcamp-db1",
    storageBucket: "kimchikimchi-bootcamp-db1.appspot.com",
    messagingSenderId: "930567075309"
};
firebase.initializeApp(config);

var database = firebase.database();
var dbRef = "FaceMoodMusic";
var emotionCaptured = undefined;
var playList = [];
var currentSongNum = undefined;
var audio = document.createElement("audio");  // HTML5 audio element
var on_value_callback;

function drawSongList(song) {
    var a = $('<a href="#" class="list-group-item list-group-item-action">');
    a.attr('id', "song_" + song.id)
    a.html(`${song.title} by ${song.artist_name}`);
    $("#songs").append(a);
}

function getMusicPlayList(emotion, faceId) {
    emotionCaptured = emotion;

    $.ajax({
        type: 'GET',
        url: 'https://deezerdevs-deezer.p.mashape.com/search',
        data: {
            q: emotion,
        },
        headers: {
            'X-Mashape-Key': 'X5MJlUMUCkmshf6HrBRNBXlx0XEzp1JPUi5jsnQAcws16kSuXo'
        },
    }).then(function(response){
    //    console.log(response);
        var songlist = response.data;
        var maxNumSongs = 20;

        // Limiting number of songs listed.
        for (var index = 0; index < maxNumSongs; index++) {
            var song = songlist[index];
            var songObj = {
                            id: song.id,
                            title : song.title,
                            preview_url: song.preview,
                            artist_name: song.artist.name,
                            album_title: song.album.title,
                            album_cover: song.album.cover_small,
                        };

            //console.log(songObj);
            drawSongList(songObj);
            playList.push(songObj);
        }

        // Turn off listener after the initial run or we gonna loop
        database.ref(dbRef).off("value", on_value_callback);

        // If recoverig from last session.
        if (currentSongNum != undefined) {
            loadNextSong();
        }

    });
}

function loadNextSong() {
    var song;

    // Prevent the selection goes past the end of the list.
    if (currentSongNum === playList.length - 1) {
        return;
    }

    // For when the list is played for the first time.  Ugly.
    if (currentSongNum == undefined ) {
        currentSongNum = 0;
        song = playList[currentSongNum];
        // Highlight the song in the song list.
        $("#song_" + song.id).addClass("active");
        audio.setAttribute("src", song.preview_url);
    } else if (currentSongNum >= 0) {

        song = playList[currentSongNum];
        // Un-highlight previous song in the play list
        $("#song_" + song.id).removeClass("active");

        currentSongNum++;
        song = playList[currentSongNum];

        // Highlight the song in the song list.
        $("#song_" + song.id).addClass("active");
        audio.setAttribute("src", song.preview_url);
    }
}

function loadPreviousSong() {
    var song;
    //console.log("Current song number is " + currentSongNum);

    // No song before first song?
    if (currentSongNum > 0 ) {
        song = playList[currentSongNum];
        $("#song_" + song.id).removeClass("active");

        currentSongNum--;

        song = playList[currentSongNum];
        $("#song_" + song.id).addClass("active");
        audio.setAttribute("src", song.preview_url);
    }
}

function recordCurrentTrackNum() {
    database.ref(dbRef).set({
        emotionCaptured : emotionCaptured,
        currentTrack : currentSongNum,
    });
}

function resetPlayList(){
    audio.removeAttribute("src", "");
    playList = [];
    currentSongNum = undefined;
    $("#songs").empty();
}

$("#playBtn").on("click", function(event) {
    // When music is simply paused before,
    // src will be populated
    if ( audio.getAttribute('src') === null ) {
        loadNextSong();
        recordCurrentTrackNum();
    }

    audio.play();
});

$("#pauseBtn").on("click", function(event) {
    audio.pause();
});

$("#prevBtn").on("click", function(event){
    audio.pause();
    loadPreviousSong();
    recordCurrentTrackNum();
    audio.play();
});

$("#nextBtn").on("click", function(event){
    audio.pause();
    loadNextSong();
    recordCurrentTrackNum();
    audio.play();
});

// When the current song is over, play next
audio.addEventListener('ended', function() {
    loadNextSong();
    recordCurrentTrackNum();
    this.play();
}, false);

$(document).ready( function() {

    console.log("Checking ");
    // Checking to see whether there was previous playList
    // If there is, pull the list and set the current list back
    // to the last one
     on_value_callback = database.ref(dbRef).on("value", function(snapshot) {
        console.log(snapshot.val());
        if (snapshot.val() != undefined) {
            //alert("connected");

            emotionCaptured = snapshot.val().emotionCaptured;
            currentSongNum = snapshot.val().currentTrack;
            getMusicPlayList(emotionCaptured);
        } else {
            //alert("not connected");
        }
    });



});

// Unit Test call
//getMusicPlayList('sad');
