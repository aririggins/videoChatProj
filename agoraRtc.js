let handlefail = function(err){
    console.log(err)
}

function addVideoStream(streamId, username, streamOrder){
    console.log()
    document.getElementById(streamOrder).style.visibility = "visible";
    document.getElementById("name").textContent += ", " + username;
    let remoteContainer = document.getElementById(streamOrder);
    console.log(streamOrder);
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "100%";
    remoteContainer.appendChild(streamDiv)
}

let appId = "7c19d2247c074c8d978433766f49addb";
let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

function removeVideoStream(){
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}

function removeMyVideoStream(){
    globalStream.stop();
}

document.getElementById("leave").onclick = function () {
    client.leave(function(){
        console.log("Left!")
    },handlefail)
    removeMyVideoStream();
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    document.getElementById("name").textContent = Username;

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail)

    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream")
                console.log('App id: ${appId}\nChannel id: ${channelName}')
                client.publish(localStream)
            })
            globalStream = localStream;
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function (evt){
        console.log("Subscribed stream");
        let stream = evt.stream;
        if (document.getElementById("remoteStream").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream");
        }
        else if (document.getElementById("remoteStream1").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream1");
        }
        else if (document.getElementById("remoteStream2").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream2");
        }
        else if (document.getElementById("remoteStream3").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream3");
        }

        stream.play(stream.getId());
    })

    client.on("peer-leave", function (evt){
        console.log("Peer has left");
        removeVideoStream(evt);
    })

}

document.getElementById("video-mute").onclick() = function(){
    if(!isVideoMuted){
        globalStream.muteVideo();
        isVideoMuted = true;
    }
    else {
        globalStream.unmuteVideo();
        isVideoMuted = false;
    }
}

document.getElementById("audio-mute").onclick() = function(){
    if(!isAudioMuted){
        globalStream.muteAudio();
        isAudioMuted = true;
    }
    else {
        globalStream.unmuteAudio();
        isAudioMuted = false;
    }
}

