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

        NotificationHandler();
    };

    const newPhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        ctx.clearRect(0, 0, photo.width, photo.height);
        setHasPhoto(false);
        getVideo();
    };

    useEffect(() => {
        localStorage.setItem("images", JSON.stringify(image));
        getVideo();
    }, [videoRef, hasPhoto, image]);

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

          <div className="result">
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