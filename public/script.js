const video = document.getElementById("camera");
const startBtn = document.getElementById("startBtn");
const countdownEl = document.getElementById("countdown");
const downloadZip = document.getElementById("downloadZip");
let photos = [];

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
  video.srcObject = stream;
}

function countdown(seconds) {
  return new Promise(resolve => {
    let time = seconds;
    countdownEl.textContent = time;
    countdownEl.classList.add("count-animate");
    const interval = setInterval(() => {
      time--;
      countdownEl.textContent = time;
      if(time===0){
        clearInterval(interval);
        countdownEl.textContent = "";
        countdownEl.classList.remove("count-animate");
        resolve();
      }
    },1000);
  });
}

function takePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);
  return canvas.toDataURL("image/png");
}

async function uploadPhoto(img,i){
  await fetch("/upload",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({image:img,index:i})
  });
}

async function startSession(){
  startBtn.style.display="none";
  photos=[];
  for(let i=0;i<5;i++){
    await countdown(3);
    let img = takePhoto();
    photos.push(img);
    await uploadPhoto(img,i);
  }
  makeZip();
}

function makeZip(){
  downloadZip.style.display="block";
  JSZip.loadAsync(new Blob()).then(zip => {
    zip = new JSZip();
    photos.forEach((img,i)=>{
      zip.file("photo_"+(i+1)+".png",img.split(",")[1],{base64:true});
    });
    zip.generateAsync({type:"blob"}).then(content=>{
      let url = URL.createObjectURL(content);
      downloadZip.href = url;
      downloadZip.download = "photos.zip";
      downloadZip.textContent = "Download ZIP";
    });
  });
}

startCamera();
startBtn.onclick=startSession;
