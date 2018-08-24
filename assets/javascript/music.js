// Based on doc at https://market.mashape.com/deezerdevs/deezer-1#-search
/*
Just requires x-mashape-key.

curl --get --include 'https://deezerdevs-deezer.p.mashape.com/search?q=happy' \
  -H 'X-Mashape-Key: X5MJlUMUCkmshf6HrBRNBXlx0XEzp1JPUi5jsnQAcws16kSuXo' \
  -H 'Accept: text/plain'
*/

var playList = [];
var currentSongNum = undefined;
var audio = document.createElement("audio");


function drawSongList(song) {
    var a = $('<a href="#" class="list-group-item list-group-item-action">');
    a.attr('id', "song_" + song.id)
    a.html(`${song.title} by ${song.artist_name}`);
    $("#songs").append(a);
}

$.ajax({
    type: 'GET',
    url: 'https://deezerdevs-deezer.p.mashape.com/search',
    data: {
        q: 'sleepy'
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

        // To Do: Render song list html
        drawSongList(songObj);

        playList.push(songObj);
        // To Do: Add playlist to be played via HTML audio tag.
        // makeSongPlayist(songObj);
    }
});


// Based on audio play logic at https://stackoverflow.com/questions/8489710/play-an-audio-file-using-jquery-when-a-button-is-clicked

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


$("#playBtn").on("click", function(event) {
    // When music is simply paused before,
    // src will be populated
    if ( audio.getAttribute('src') === null ) {
        loadNextSong();
    }

    audio.play();
});

$("#pauseBtn").on("click", function(event) {
    audio.pause();
});

$("#prevBtn").on("click", function(event){
    audio.pause();
    loadPreviousSong();
    audio.play();
});

$("#nextBtn").on("click", function(event){
    audio.pause();
    loadNextSong();
    audio.play();
});

// When the current song is over, play next
audio.addEventListener('ended', function() {
    loadNextSong();
    this.play();
}, false);
