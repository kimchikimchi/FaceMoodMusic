// Based on doc at https://market.mashape.com/deezerdevs/deezer-1#-search
/*
Just requires x-mashape-key.

curl --get --include 'https://deezerdevs-deezer.p.mashape.com/search?q=happy' \
  -H 'X-Mashape-Key: X5MJlUMUCkmshf6HrBRNBXlx0XEzp1JPUi5jsnQAcws16kSuXo' \
  -H 'Accept: text/plain'
*/

$.ajax({
    type: 'GET',
    url: 'https://deezerdevs-deezer.p.mashape.com/search',
    data: {
        q: 'happy'
    },
    headers: {
        'X-Mashape-Key': 'X5MJlUMUCkmshf6HrBRNBXlx0XEzp1JPUi5jsnQAcws16kSuXo'
    }
}).then(function(response){
//    console.log(response);

    var songlist = response.data;

    songlist.forEach(function(song){
        var song_obj = {
                        title : song.title,
                        preview_url: song.preview,
                        artist_name: song.artist.name,
                        album_title: song.album.title,
                        album_cover: song.album.cover_small,
                    };

        console.log(song_obj);
    });

});
