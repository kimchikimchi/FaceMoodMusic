var emotions;
var strongestEmotion;
var userGender;
var video = document.querySelector("#videoElement");
var canvas = document.querySelector("#myCanvas");
var button = document.querySelector("#btnCapture");
var apiData;

window.onload = function(){
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err0r) {
            console.log("Something went wrong! " + err0r);
        });
    }
}

button.onclick = function(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    apiData = canvas.toDataURL('image/png');
    console.log("apiData: " + apiData);
}

var makeblob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

function processImage() {
    var subscriptionKey = "9941ab0052184dd0bda55396f3b58859";
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
        "age,gender,headPose,smile,facialHair,glasses,emotion," +
        "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            // xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        // data: '{"url": ' + '"' + sourceImageUrl + '"}',
        data: makeblob(apiData),
        processData: false
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        userGender = data[0].faceAttributes.gender;
        emotions = data[0].faceAttributes.emotion;
        strongestEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);            console.log("Data: " + data[0]);
        console.log("Gender: " + userGender);
        console.log("Emotions: " + JSON.stringify(emotions));
        console.log("Strongest Emotion: " + strongestEmotion);
        $("#resultEmotion").text(strongestEmotion);

        // Calling music playlist.
        resetPlayList();
        getMusicPlayList(strongestEmotion);
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ?
        "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ?
        "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
        jQuery.parseJSON(jqXHR.responseText).message :
        jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};
