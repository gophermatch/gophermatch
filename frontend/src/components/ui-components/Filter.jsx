import React from 'react';

export default function Filter() {
    const [shouldShowIcon, setShowIcon] = React.useState(true);
    const [shouldShowUI, setShowUI] = React.useState(false);

    function expandFilterUI(){
        setShowIcon(!shouldShowIcon);
        setShowUI(!shouldShowUI);
    }

    return(
        <>
        {shouldShowIcon && <div class = "flex absolute right-0">
            <img class="object-scale-down h-[12vh] w-[18vh]" src="../assets/images/filter.png" onClick={expandFilterUI}></img>
        </div>}

        {shouldShowUI && <div class = "flex-column bg-[#D9D9D9] mt-[2vh] w-[50vw] h-[15vh] m-auto rounded-3xl items-center text-xs font-bold">
            <p class = "ml-[2vw] mb-[1vh] text-lg">Filter by..</p>
            <div class = "flex space-x-[1.25vw] ml-[1.5vw] text-[#E3E3E3] border-5 items-start drop-shadow-md">
                <select name="gender" id="gender" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                </select>
                <select name="building" id="building" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">Building</option>
                    <option value="Pioneer">Pioneer Hall</option>
                    <option value="Frontier">Frontier Hall</option>
                    <option value="Territorial">Territorial Hall</option>
                    <option value="Centennial">Centennial Hall</option>
                    <option value="Comstock">Comstock Hall</option>
                    <option value="Sanford">Sanford Hall</option>
                    <option value="Middlebrook">Middlebrook Hall</option>
                    <option value="Bailey">Bailey Hall</option>
                    <option value="17th">17th Avenue Residence Hall</option>
                </select>
                <select name="College" id="College" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">College</option>
                    <option value="CLA">College of Liberal Arts</option>
                    <option value="CSE">College of Science and Engineering</option>
                    <option value="CSOM">Carlson School of Management</option>
                    <option value="CBS">College of Biological Sciences</option>
                    <option value="CDES">College of Design</option>
                    <option value="CEHD">College of Education And Human Development</option>
                    <option value="CFANS">College of Food, Agricultural, and Natural Resource Sciences</option>
                    <option value="SN">School of Nursing</option>
                </select>
                <p class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">Other Options</p>
                <img class = "bg-[#A4BDA2] w-[2.5vw] h-[5vh] rounded-3xl object-scale-down px-[0.66vh] py-[0.66vh]" src="../assets/images/filtercheck.png" onClick={expandFilterUI}></img>
            </div>
        </div>}
        </>
    )
}
