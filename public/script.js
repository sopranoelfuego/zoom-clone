


const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "5000",
});

// var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// /**
//  * 
//  * 
let myVideoStream;
 var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true, audio: true}, (stream) =>{
  myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    // here is where we have to put our chat
    let message=$('input')

    
    $('html').keydown( e =>{
         
      if(e.which == 13 && message.val().length !== 0){
    
        console.log(message.val())
        socket.emit('message',message.val())
        message.val('')
        scrollBottom()
      }
    })
    
    socket.on('createdMessage',message =>{
        $('ul').append(`<li class="message"><b>user<b> </br>${message}</li>`)
    })
    
}, function(err) {
  console.log('Failed to get local stream' ,err);
});
 


peer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  //console.log(`The new user:${userId}`);
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const muteUnmute=()=>{
  const enlabled=myVideoStream.getAudioTracks()[0].enlabled
  if(enlabled){
    setUnmutedButton()
    myVideoStream.getAudioTracks()[0].enabled=false
  }else {
    setMutedButton()
    myVideoStream.getAudioTracks()[0].enabled=true

  }
}
const setUnmutedButton=()=>{
  const html=`
    <i class=" unmute fas  fa-microphone"></></br>
    <span>unmute</span>
  `
  document.querySelector('.button_mute').innerHTML=html
}
const setMutedButton=()=>{
  const html=`
    <i class=" fas button_mute fa-microphone-slash"></><br/>
    <span>mute</span>
  `
  document.querySelector('.button_mute').innerHTML=html
}
const scrollBottom =()=>{

    let element=$('.main__chat')
     element.scrollTop(element.prop("scrollHeigth"))
}


const playStopVideo=()=>{
  const enlabled=myVideoStream.getVideoTracks()[0].enabled
  if(enlabled){
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled=false
    
  }else {
    setPlayVideo()
    myVideoStream.getVideoTracks()[0].enabled=true
  }
}
const setStopVideo=()=>{
  const html=`
    <i class="fas button fa-video"></span></br>
    <span>play</span>
  `
  document.querySelector('.video__mute').innerHTML=html

}
const setPlayVideo=()=>{
  const html=`
    <i class="fas button fa-video"></></br>
    <span>stop</span>
  `
  document.querySelector('.video__mute').innerHTML=html

}








