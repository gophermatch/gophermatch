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
            <div className="bg-white rounded-[1.5rem] pt-[42.5vh] pb-[42.5vh] pl-[50vw] pr-[12.5vw] mr-[12.5vw] shadow-lg relative">
            {[0, 1, 2].map((index) => (
                <div key={index} className={`absolute top-[4%] left-[${20 + index * 20}%] w-[10vw] h-[20vh] bg-inactive_gray rounded-[1rem] flex justify-center items-center`}>
                    <span className="text-[5vw]">+</span>
                    {pictureUrls[index] && <img src={pictureUrls[index]} alt={`Profile ${index + 1}`} className="absolute w-full h-full object-cover rounded-[1rem]" />}
                </div>
            ))}
                <div className="absolute bottom-0 left-0 w-full h-[60vh] flex flex-col justify-center items-center cursor-pointer">
                    <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center w-full h-full">
                        <img
                            src="https://www.svgrepo.com/show/344399/arrow-bar-up.svg"
                            alt="Upload File"
                            className="h-[35vh] w-[35vw] text-maroon mt-[5vh]"
                        />
                        <p className="mt-[1vh] text-[3vh]">Drag and drop or click to browse</p>
                    </label>
                </div>
                <div className="absolute bottom-[60vh] left-0 w-full h-[1px] bg-black"></div>
                <Link to="/profile" className="absolute top-[3%] right-[3%] w-[8%] h-[5%] bg-maroon rounded-[1rem] cursor-pointer flex justify-center items-center"
                    onClick={handleDoneClick}
                >
                    <span className="text-white w-[5vw] h-[4vh] text-[2.5vh] ml-[1vw]">Done</span>
                </Link>
                
            </div>
        </div>
    );
};

export default PicUpload;

