var video = document.querySelector("#videoElement");
 
if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(err0r) {
    console.log("Something went wrong!");
  });
}


/*var videoObj    = { "video": true },
    errBack        = function(error){
        // alert("Video capture error: ", error.code);
    };

// Ask the browser for permission to use the Webcam
if(navigator.getUserMedia){                    // Standard
    navigator.getUserMedia(videoObj, startWebcam, errBack);
}else if(navigator.webkitGetUserMedia){        // WebKit
    navigator.webkitGetUserMedia(videoObj, startWebcam, errBack);
}else if(navigator.mozGetUserMedia){        // Firefox
    navigator.mozGetUserMedia(videoObj, startWebcam, errBack);
};

function startWebcam(stream){

    var myOnlineCamera    = document.getElementById('myOnlineCamera'),
        video            = myOnlineCamera.querySelectorAll('video'),
        canvas            = myOnlineCamera.querySelectorAll('canvas');

    video.width = video.offsetWidth;

    if(navigator.getUserMedia){                    // Standard
        video.src = stream;
        video.play();
    }else if(navigator.webkitGetUserMedia){        // WebKit
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }else if(navigator.mozGetUserMedia){        // Firefox
        video.src = window.URL.createObjectURL(stream);
        video.play();
    };

    // Click to take the photo
    $('#webcam-popup .takephoto').click(function(){
        // Copying the image in a temporary canvas
        var temp = document.createElement('canvas');

        temp.width  = video.offsetWidth;
        temp.height = video.offsetHeight;

        var tempcontext = temp.getContext("2d"),
            tempScale = (temp.height/temp.width);

        temp.drawImage(
            video,
            0, 0,
            video.offsetWidth, video.offsetHeight
        );

        // Resize it to the size of our canvas
        canvas.style.height    = parseInt( canvas.offsetWidth * tempScale );
        canvas.width        = canvas.offsetWidth;
        canvas.height        = canvas.offsetHeight;
        var context        = canvas.getContext("2d"),
            scale        = canvas.width/temp.width;
        context.scale(scale, scale);
        context.drawImage(bigimage, 0, 0);
    });
};*/
