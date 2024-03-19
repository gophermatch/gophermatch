import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";

const PicUpload = () => {
    const [file, setFile] = useState(null);
    const [pictureUrls, setPictureUrls] = useState([]);

    useEffect(() => {
        const fetchPictureUrls = async () => {
            try {
                const response = await fetch("/api/profile/user-pictures");
                if (response.ok) {
                    const data = await response.json();
                    setPictureUrls(data.pictureUrls);
                } else {
                    throw new Error("Failed to fetch picture URLs");
                }
            } catch (error) {
                console.error("Error fetching picture URLs:", error);
            }
        };

        fetchPictureUrls();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDoneClick = async () => {
        // File upload logic

        // Redirect to profile page
    };

    return (
        <div className="h-screen w-screen bg-doc flex justify-center items-center">
            <div className="bg-white rounded-[1.5rem] pt-[16rem] pb-[16rem] pl-[40rem] pr-[10rem] mr-[15rem] shadow-lg relative">
                {pictureUrls.slice(0, 3).map((url, index) => (
                    <div key={index} className={`absolute top-[4%] left-[${20 + index * 20}%] w-[8rem] h-[8rem] bg-gray-200 rounded-[1rem] flex justify-center items-center`}>
                        <img src={url} alt={`Profile ${index + 1}`} className="w-[6rem] h-[6rem] object-cover rounded-[1rem]" />
                    </div>
                ))}
                <div className="absolute bottom-0 left-0 w-full h-2/3 flex flex-col justify-center items-center cursor-pointer">
                    <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center w-full h-full">
                        <img
                            src="https://www.svgrepo.com/show/344399/arrow-bar-up.svg"
                            alt="Upload File"
                            className="h-[12rem] w-[12rem] text-maroon mt-[3rem]"
                        />
                        <p className="mt-2">Drag and drop or click to browse</p>
                    </label>
                </div>
                <div className="absolute bottom-[calc(66.67%)] left-0 w-full h-[1px] bg-black"></div>
                <Link to = "/profile" className="absolute top-[3%] right-[3%] w-[8%] h-[5%] bg-maroon rounded-[1rem] cursor-pointer flex justify-center items-center"
                    onClick={handleDoneClick}
                >
                    <span className="text-white">Done</span>
                </Link>
                <div className="absolute top-[4%] left-[20%] w-[8rem] h-[8rem] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>1</span>
                </div>
                <div className="absolute top-[4%] left-[40%] w-[8rem] h-[8rem] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>2</span>
                </div>
                <div className="absolute top-[4%] left-[60%] w-[8rem] h-[8rem] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>3</span>
                </div>
            </div>
        </div>
    );
    
};

export default PicUpload;
