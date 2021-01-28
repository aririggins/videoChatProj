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

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    document.getElementById("name").textContent = Username;
    let appId = "7c19d2247c074c8d978433766f49addb";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

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
        else if (document.getElementById("remoteStream2").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream2");
        }
        else if (document.getElementById("remoteStream3").style.visibility == "hidden") {
            addVideoStream(stream.getId(), stream.getId(Username), "remoteStream3");
        }

        stream.play(stream.getId());
    })
}

