import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTh } from "react-icons/fa"
import '../style/camera.css';

function Camera() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const existingImage = JSON.parse(localStorage.getItem("images")) || [];
    const [image, setImage] = useState(existingImage);

    const [hasPhoto, setHasPhoto] = useState(false);

    let navigate = useNavigate();
    
    const NotificationHandler = () => {
        if (Notification.permission === "granted") {
          new Notification("WeddingPhotoApp", {
            body: "Picture is saved!",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            console.log(permission);
          });
        }
      };

    const getVideo = () => {
        if (!hasPhoto) {
          navigator.mediaDevices
              .getUserMedia({ 
                video: { width: 1920, height: 1080 }
              })
              .then(stream => {
                  let video = videoRef.current;
                  video.srcObject = stream;
                  video.play();
              })
              .catch(err => {
                  console.error(err);
              });
        } else {
            return;
        }
    };

    const takePhoto = async () => {
        const width = 414;
        const height = width / (16/9);

        document.querySelector('.hide').style.display='flex';

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);
        const canvas = document.getElementById("canvas");
        const date = new Date();
        const stringDate = date.toISOString().slice(0, 10).replace(/-/g, "-");
    
        const imageData = {
        src: canvas.toDataURL("image/png"),
        id: image.length,
        date: stringDate
        };

        setImage([...image, imageData]);
        localStorage.setItem("images", JSON.stringify(imageData));

        updatePhotosJSONbin()
        NotificationHandler();
    };

    const newPhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        document.querySelector('.hide').style.display='none';

        ctx.clearRect(0, 0, photo.width, photo.height);
        setHasPhoto(false);
        getVideo();
    };

    useEffect(() => {
        localStorage.setItem("images", JSON.stringify(image));
        getVideo();
    }, [videoRef, hasPhoto, image]);

// -------------------------- JSON BIN START -------------------------- //

const ACCES_URL = "https://api.jsonbin.io/b/6298ef93402a5b38021a333c"
const X_MASTER_KEY = "$2b$10$wmk87m0u8d5ZMbBqAjbXMu/kwayHjJbgEKZ2cu5.g.o0hn3MXD9Z."


async function getFromJsonBIN () {
  const responce = await fetch(`${ACCES_URL}/latest`, {
    headers: {
      'X-Master-Key': X_MASTER_KEY,
    }
  });
  const data = await responce.json()

  let newArray = { pictures: [] }

  console.log('newArray: ', newArray);

  localStorage.setItem('cameraApp', JSON.stringify(newArray));

  return newArray
}

async function updatePhotosJSONbin () {

    console.log('updatePhotosToJSONbin körs');

  const fromStorage = window.localStorage.getItem('images')

  const responce = await fetch(ACCES_URL, {
    method: 'PUT',
    body: fromStorage,
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': X_MASTER_KEY
    }
});

const data = await responce.json();

console.log(data);
}

// -------------------------- JSON BIN END -------------------------- //


  return (
    
        <div className="camera-page">
          <div className="gallery_icon_area">
              <div className="gallery_icon">
                  <FaTh onClick={() => { navigate("/gallery"); } } />
              </div>
          </div>

          <div className="camera">
              {!hasPhoto && (
                  <video ref={videoRef}></video>
              )}
          </div>

          <div className="result hide">
              <canvas id="canvas" ref={photoRef}></canvas>
          </div>
      
          <div className="button-area">
              {!hasPhoto && (
                  <button onClick={takePhoto}>FÖREVIGA ETT ÖGONBLICK</button>
              )}
              {hasPhoto && (
                  <button onClick={newPhoto}>FÖREVIGA ETT NYTT ÖGONBLICK</button>
              )}
          </div>
        </div>
    
  );
};

export default Camera;