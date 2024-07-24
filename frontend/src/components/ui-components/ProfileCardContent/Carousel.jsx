import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../assets/css/carousel.module.css';

export default function Carousel({ editable, pictureUrls = [] }) {
    const [position, setPosition] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    function showOverlay() {
        const imageWrapper = document.getElementById("imageWrapper");
        if (editable && !isEditing) {
            if (imageWrapper.style.filter === "blur(2px)") {
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
        if (editable && !isEditing) {
            navigate("/PicUpload");
        }
    }

    useEffect(() => {
        setPosition(0);
    }, [pictureUrls]);

    if (!Array.isArray(pictureUrls) || pictureUrls.length === 0) {
        return <div>No images available</div>;
    }

    const carouselLen = pictureUrls.length;

    let dots = pictureUrls.map((url, i) => (
        i === position ? (
            <button key={url + i} className={styles.dotSolid}></button>
        ) : (
            <button key={url + i} className={styles.dotEmpty} onClick={() => setPosition(i)}></button>
        )
    ));

    const dotSection = (
        <div className={styles.dotSection + " mx-[2vw] mt-[0.5vh]"}>
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
            <div className="flex justify-center items-center" onMouseEnter={showOverlay} onMouseLeave={showOverlay}>
                {isHovering && <img src="../../assets/images/imageicon.png" className="absolute scale-[0.1]" />}
                <div id="imageWrapper" className="w-[70%] h-[70%] overflow-hidden rounded-[1vw] aspect-square">
                    <img src={pictureUrls[position]} className={"w-full h-full object-cover border-[3px] border-maroon_new rounded-[1vw] "} onClick={gotoUpload} />
                </div>
            </div>
            {carouselLen > 1 && dotSection}
        </div>
    );
}
