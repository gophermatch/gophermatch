import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from '../../assets/css/carousel.module.css'

export default function Carousel(props) {
    const [position, setPosition] = React.useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();
    const editable = props.editable;

    function showOverlay() {
        const imageWrapper = document.getElementById("imageWrapper");
        if (editable) {
            if (imageWrapper.style.filter == "blur(2px)") {
                imageWrapper.style.filter = "blur(0px)";
                imageWrapper.style.opacity = 1;
            } else {
                imageWrapper.style.filter = "blur(2px)";
                imageWrapper.style.opacity = 0.8;
            }
            setIsHovering(prev => !prev);
        }
    }

    function gotoUpload() {
        if (editable) {
            navigate("/PicUpload");
        }
    }

    const carouselLen = props.pictureUrls.length;

    let dots = props.pictureUrls.map((url, i) => {
        if (i == position) {
            return <button key={url + i} className={styles.dotSolid}></button>;
        } else {
            return <button key={url + i} className={styles.dotEmpty} onClick={() => setPosition(i)}></button>;
        }
    });

    const dotSection = (
        <div className={styles.dotSection}>
            <button className={styles.progressButton} onClick={() => setPosition((position - 1 + carouselLen) % carouselLen)}>
                &lt;
            </button>
            <div className={styles.dots}>{dots}</div>
            <button className={styles.progressButton} onClick={() => setPosition((position + 1) % carouselLen)}>
                &gt;
            </button>
        </div>
    );    

    return (
        <div className={styles.container}>
            <div className="flex justify-center items-center">
                {isHovering && <img src="../../assets/images/imageicon.png" className="absolute scale-[0.1]" />}
                <div id="imageWrapper" className="border-[0.33vw] w-[100%] h-[100%] overflow-hidden rounded-[1vw] border-maroon_new aspect-square">
                    <img src={props.pictureUrls[position]} className="w-full h-full object-cover rounded-[1vw]" onClick={gotoUpload} onMouseEnter={showOverlay} onMouseLeave={showOverlay} />
                </div>
            </div>
            {carouselLen > 1 && dotSection}
        </div>
    );
}
