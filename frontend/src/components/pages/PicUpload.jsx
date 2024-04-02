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
        <div className="h-screen w-screen bg-doc flex justify-center items-center">
            <div
              className="bg-white rounded-[1.5rem] pt-[16rem] pb-[16rem] pl-[40rem] pr-[10rem] mr-[15rem] shadow-lg relative">
                <div
                  className="absolute bottom-0 left-0 w-full h-2/3 flex flex-col justify-center items-center cursor-pointer">
                    <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center w-full h-full">
                        <img
                          src="https://www.svgrepo.com/show/344399/arrow-bar-up.svg"
                          alt="Upload File"
                          className="h-[12rem] w-[12rem] text-maroon mt-[3rem]"
                        />
                        <p className="mt-2">Drag and drop or click to browse</p>
                        <p className={"mt-2 text-maroon_new"}>{status}</p>
                    </label>
                </div>
                <div className="absolute bottom-[calc(66.67%)] left-0 w-full h-[1px] bg-black"></div>
                <Link to="/profile"
                      className="absolute top-[3%] right-[3%] w-[8%] h-[5%] bg-maroon rounded-[1rem] cursor-pointer flex justify-center items-center"
                      onClick={handleDoneClick}
                >
                    <span className="text-white">Done</span>
                </Link>
                <div
                  className="absolute top-[4%] left-[20%] w-[8rem] h-[8rem] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[0] && <img src={pictureUrls[0]} alt="Profile 1"
                                            className="w-[8rem] h-[8rem] object-cover rounded-[1rem]" />}
                    {pictureUrls[0] && <button onClick={() => handleRemovePic(0)}
                                               className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                        X
                    </button>}
                </div>
                <div
                  className="absolute top-[4%] left-[40%] w-[8rem] h-[8rem] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[1] && <img src={pictureUrls[1]} alt="Profile 2"
                                            className="w-[8rem] h-[8rem] object-cover rounded-[1rem]" />}
                    {pictureUrls[1] && <button onClick={() => handleRemovePic(1)}
                                               className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                        X
                    </button>}
                </div>
                <div
                  className="absolute top-[4%] left-[60%] w-[8rem] h-[8rem] bg-inactive_gray rounded-[1rem] flex justify-center items-center">
                    {pictureUrls[2] && <img src={pictureUrls[2]} alt="Profile 3"
                                            className="w-[8rem] h-[8rem] object-cover rounded-[1rem]" />}
                    {pictureUrls[2] && <button onClick={() => handleRemovePic(2)}
                                               className="absolute font-bold text-white bg-black bg-opacity-20 w-[25px] h-[25px] rounded-full transition duration-200 hover:bg-opacity-50">
                        X
                    </button>}
                </div>
            </div>
        </div>
    );
};

export default PicUpload;
