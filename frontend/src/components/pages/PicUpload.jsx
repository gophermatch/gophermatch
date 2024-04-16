import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import backend from "../../backend.js";
import currentUser from '../../currentUser';


const PicUpload = () => {
    const [pictureUrls, setPictureUrls] = useState(["", "", ""]);
    const [status, setStatusValue] = useState("");

    const setStatus = (newValue) => {
        // TODO: A fade out on the status would be nice here
        setStatusValue(newValue);
    };

    useEffect(() => {
        fetchPictureUrls();
    }, []);

    const fetchPictureUrls = async () => {
        try {
            const response = await backend.get("/profile/user-pictures", {
                params: {user_id: currentUser.user_id},
                withCredentials: true,
            });
            if (response) {

                console.log(response);

                const data = response.data;

                const newArray = [];

                for (let i = 0; i < 3; i++) {
                    if(data.pictureUrls.length <= i){
                        newArray[i] = "";
                    }else{
                        newArray[i] = data.pictureUrls[i];
                    }
                }
                setPictureUrls(newArray)
            } else {
                throw new Error("Failed to fetch picture URLs");
            }
        } catch (error) {
            console.error("Error fetching picture URLs:", error);
        }
    };

    const handleRemovePic = async (i) => {
        try {
            const response = await backend.delete('/profile/remove-picture', {
                params: {user_id: currentUser.user_id, pic_number: i},
                withCredentials: true,
            });

            setStatus('Profile pictured successfully removed!');
            console.log(response);

            console.log("Changing picture urls");
        } catch (error) {
            console.error('Error removing file:', error);
            setStatus('Failed to remove profile picture. Please try again later.');
        }

        //TODO: might be bad practice, but fixes for now
        await new Promise(resolve => setTimeout(resolve, 50));

        await fetchPictureUrls();
    }

    const uploadFile = async (file, i) => {

        console.log(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', currentUser.user_id);
        formData.append('pic_number', i);

        try {
            const response = await backend.post('/profile/upload-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatus('Profile picture uploaded successfully!');
            console.log(response.data);

            console.log("Changing picture urls");

            await fetchPictureUrls();
        } catch (error) {
            console.error('Error uploading file:', error);
            setStatus('Failed to upload picture. Please try again later.');
        }
    };
    
    
    

    const handleFileChange = (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);
            const firstEmptyIndex = pictureUrls.findIndex(url => url==="");
            if (firstEmptyIndex !== -1) {
                uploadFile(file, firstEmptyIndex);
            } else {
                console.log(pictureUrls)
                console.error("No empty photo slots available");
                setStatus("No empty photo slots available! Please remove one before uploading.");
                break;
            }
        }
    };

    const handleDoneClick = async () => {
    };
    

    return (
        <div className="h-screen w-screen bg-offwhite flex justify-center text-center items-center">
            <Link to="/profile" className="absolute top-[1.5%] right-[46.5%] w-[7%] h-[5%] bg-maroon rounded-[3vw] cursor-pointer flex justify-center text-center items-center"
                    onClick={handleDoneClick}
                >
                    <span className=" text-white w-[5vw] h-[4vh] text-[2.5vh]">Done</span>
                </Link>
            <div className="bg-white rounded-[3vh] pt-[38vh] pb-[45vh] pl-[50vw] pr-[12.5vw] mr-[12.5vw] shadow-lg relative">
                <div className="absolute bottom-0 left-0 w-full h-[60vh] flex flex-col justify-center items-center cursor-pointer">
                    <div className="cursor-pointer flex flex-col items-center w-full h-full">
                    <svg 
                        width="40vw" 
                        height="40vh" 
                        viewBox="0 0 64 64" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        stroke="#000000">
                            <path d="M42 44a14 14 0 1 0-4.46-27.26A12 12 0 0 0 16.71 28H16a8 8 0 0 0 0 16h6"/><polyline points="40 36 32 28 24 36"/><line x1="32" y1="28" x2="32" y2="52"/></svg>
                        <p className="text-[3vh] text-black">Drag and drop or click to browse</p>
                    </div>
                </div>
                <div className="absolute bottom-[60vh] left-0 w-full h-[3px] bg-black"></div>
                <div
                  className="absolute top-[4%] left-[20%] w-[10vw] h-[17vh] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[0] ? (
                        <>
                            <img src={pictureUrls[0]} alt="Profile 1" className="w-full h-full object-cover rounded-[1rem]" />
                            <button onClick={() => handleRemovePic(0)} className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                                X
                            </button>
                        </>
                    ) : (
                        <label htmlFor="fileInput" className="cursor-pointer flex flex-col justify-center items-center w-full h-full">
                            <span className="text-[4vh]">+</span>
                        </label>
                    )}
                </div>
                <div
                  className="absolute top-[4%] left-[40%] w-[10vw] h-[17vh] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[1] ? (
                        <>
                            <img src={pictureUrls[1]} alt="Profile 1" className="w-full h-full object-cover rounded-[1rem]" />
                            <button onClick={() => handleRemovePic(1)} className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                                X
                            </button>
                        </>
                    ) : (
                        <label htmlFor="fileInput" className="cursor-pointer flex flex-col justify-center items-center w-full h-full">
                            <span className="text-[4vh]">+</span>
                        </label>
                    )}
                </div>
                <div
                  className="absolute top-[4%] left-[60%] w-[10vw] h-[17vh] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[2] ? (
                        <>
                            <img src={pictureUrls[2]} alt="Profile 1" className="w-full h-full object-cover rounded-[1rem]" />
                            <button onClick={() => handleRemovePic(2)} className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                                X
                            </button>
                        </>
                    ) : (
                        <label htmlFor="fileInput" className="cursor-pointer flex flex-col justify-center items-center w-full h-full">
                            <span className="text-[4vh]">+</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PicUpload;
