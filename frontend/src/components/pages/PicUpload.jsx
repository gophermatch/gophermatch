import React from "react";

const PicUpload = () => {
    const handleFileUpload = () => {
        // Handle file upload logic here
        console.log("File upload clicked");
    };

    const handleDoneClick = () => {
        // Handle "done" button click logic here
        console.log("Done button clicked");
    };

    return (
        <div className="h-screen w-screen bg-doc flex justify-center items-center">
            <div className="bg-white rounded-[1.5rem] pt-[16rem] pb-[16rem] pl-[40rem] pr-[10rem] mr-[15rem] shadow-lg relative">
                <div
                    className="absolute bottom-0 left-0 w-full h-2/3 flex flex-col justify-center items-center cursor-pointer"
                    onClick={handleFileUpload}
                >
                    <img
                        src="https://www.svgrepo.com/show/344399/arrow-bar-up.svg"
                        alt="Upload File"
                        className="h-[12rem] w-[12rem] text-maroon"
                    />
                    <p className="ml-2">Drag and drop or click to browse</p>
                </div>
                <div className="absolute bottom-[calc(66.67%)] left-0 w-full h-[1px] bg-black"></div>
                <div className="absolute top-[3%] right-[3%] w-[8%] h-[5%] bg-maroon rounded-[1rem] cursor-pointer flex justify-center items-center" onClick={handleDoneClick}>
                    <span className="text-white">Done</span>
                </div>
                <div className="absolute top-[3%] left-[10%] w-[20%] h-[27%] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>1</span>
                </div>
                <div className="absolute top-[3%] left-[37%] w-[20%] h-[27%] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>2</span>
                </div>
                <div className="absolute top-[3%] left-[64%] w-[20%] h-[27%] bg-gray-200 rounded-[1rem] flex justify-center items-center">
                    <span>3</span>
                </div>
            </div>
        </div>
    );
};

export default PicUpload;
