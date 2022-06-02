import React, { useEffect, useState } from 'react'
import "../style/gallery.css"
import { useNavigate } from "react-router-dom";
import {IoIosArrowBack} from 'react-icons/io';
import {TiDelete} from 'react-icons/ti';

function Gallery() {
    let images;
    const initLocal = JSON.parse(localStorage.getItem("images") || [])
    const [local, setLocal] = useState(initLocal)
    
    if(local.length !== 0){
        images = local;
    }

    let navigate = useNavigate();
    
    const deleteLocal = (key,data) => {
      console.log(data)
      const updatedImages =  local.filter(i => data.id !== i.id)
       setLocal([...updatedImages])
       
    }


   useEffect(() => {
       localStorage.setItem('images', JSON.stringify(local))
   },[local])

  return (
    <div className='gallery'>
        
        <h1>PHOTOCOLLECTION</h1>
        <div className="backButton-area">
            <IoIosArrowBack onClick={() => {navigate("/")}}/>
        </div>
        <div className='picture-grid' >
          {local.length > 0 ?
          images.map((image,index) => (

          <div className="picture-area" key={index}>
            <div className="image-container">
              <div className="deleteButton-area">
                <TiDelete onClick={() => deleteLocal(index,image)}/>
              </div>
              <img  src={image.src} alt={image.date} />
              <div className="title">
                <p>{image.date}</p>
              </div>
            </div>
          </div>
         ))
           : <h2>Nothing to see yet, go back and take some photos! </h2>
          }
        </div>


    </div>
  );
}

export default Gallery;