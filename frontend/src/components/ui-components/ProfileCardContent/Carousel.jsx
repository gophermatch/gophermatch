import React, { useState, useEffect } from 'react';
import { useFetcher, useNavigate } from 'react-router-dom';
import styles from '../../../assets/css/carousel.module.css';
import backend from "../../../backend.js";

export default function Carousel({ user_id, editable }) {
    const [position, setPosition] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [pictureUrls, setPictureUrls] = useState();

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

    useEffect(() => {
        fetchPictureUrls();
    }, []);

    const fetchPictureUrls = async () => {
        try {

            if (!user_id) {
                console.error("User ID is missing");
                return;
            }

            const response = await backend.get("/profile/user-pictures", {
                params: { user_id: user_id },
                withCredentials: true,
            });
            if (response && response.data) {
                console.log("Picture URLs:", response.data.pictureUrls);
                setPictureUrls(response.data.pictureUrls);
            } else {
                console.error("Failed to fetch picture URLs");
            }
        } catch (error) {
            console.error("Error fetching picture URLs:", error);
        }
    };

    function gotoUpload() {
        if (editable && !isEditing) {
            navigate("/PicUpload");
        }
    }

    useEffect(() => {
        setPosition(0);
    }, [pictureUrls]);

    const carouselLen = Array.isArray(pictureUrls) ? pictureUrls.length : 0;

    let dots = Array.isArray(pictureUrls) ? pictureUrls.map((url, i) => (
        i === position ? (
            <button key={url + i} className={styles.dotSolid}></button>
        ) : (
            <button key={url + i} className={styles.dotEmpty} onClick={() => setPosition(i)}></button>
        )
    )) : null;

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
        <div className="relative h-full w-full">
            <div className="relative w-full h-[95%] overflow-hidden">
                <div className="relative w-full h-full mx-auto"> {/* Aspect ratio 9:16 */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <img
                            src={(Array.isArray(pictureUrls) && pictureUrls.length > 0) ? pictureUrls[position] : null}
                            className="w-full h-full object-cover border-[3px] border-maroon_new rounded-[1vw]"
                            onClick={gotoUpload}
                        />
                    </div>
                </div>
            </div>
            {carouselLen > 1 && dotSection}
        </div>
    );    
    
}
