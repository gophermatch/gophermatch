import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
                        {file && index === 0 && (
                            <img src={URL.createObjectURL(file)} alt="Profile" className="w-[6rem] h-[6rem] object-cover rounded-[1rem]" />
                        )}
                        {!file && (
                            <img src={url} alt={`Profile ${index + 1}`} className="w-[6rem] h-[6rem] object-cover rounded-[1rem]" />
                        )}
                    </div>
                ))}
                <div className="absolute bottom-0 left-0 w-full h-2/3 flex flex-col justify-center items-center cursor-pointer">
                    <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="fileInput" className="cursor-pointer">
                        {file ? (
                            <img src={URL.createObjectURL(file)} alt="Upload" className="w-[12rem] h-[12rem] text-maroon" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[12rem] h-[12rem] text-maroon" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 6a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 10 6zM6.75 10.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-1.5 0v-2.5zM12.75 9.25a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-1.5 0v-5z"/>
                            </svg>
                        )}
                        <p className="ml-2">{file ? file.name : "Drag and drop or click to browse"}</p>
                    </label>
                </div>
                <div className="absolute bottom-[calc(66.67%)] left-0 w-full h-[1px] bg-black"></div>
                <Link to="/profile" className="absolute top-[3%] right-[3%] w-[8%] h-[5%] bg-maroon rounded-[1rem] cursor-pointer flex justify-center items-center" onClick={handleDoneClick}>
                    <span className="text-white">Done</span>
                </Link>
                {[0, 1, 2].map((num, index) => (
                    <div key={index} className={`absolute top-[4%] left-[${(20 * num) + 20}%] w-[8rem] h-[8rem] bg-gray-200 rounded-[1rem] flex justify-center items-center`}>
                        <span>{num + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PicUpload;
