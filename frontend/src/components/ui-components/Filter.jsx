import React, { useEffect, useState } from 'react';
import backend from '../../backend';
import qnaOptions from './qnaOptions.json';

function getIdFromOptionText(questionId, optionText) {
    const question = qnaOptions.find(v => v.id === questionId);
    return question.options.find(item => item.text === optionText).option_id;
}

function getOptionTextFromId(id) {
    for (const question of qnaOptions) {
        const option = question.options.find(item => item.option_id === id)
        if (option) return option.text
    }
}

const NormalFilterItem = function({optionId, filters, setFilters}) {
    return <label onChange={(e) => setFilters(s => e.target.checked ? [...s.filter(v => v!== optionId), optionId] : s.filter(v => v!== optionId))} className="block hover:bg-[#EBE1BA]"><input type="checkbox" name={optionId} checked={filters.includes(optionId)} /> {getOptionTextFromId(optionId)}</label>
}
const UserDataItem = function({k, value, setUserData}) {
    return <label
        onChange={(e) => setUserData((prevData) => {
            if (e.target.checked) {
                prevData[k][value] = true;
            } else {
                delete prevData[k][value];
            }
            return prevData
        })}
        className="block hover:bg-[#EBE1BA]"
    ><input type="checkbox" name={value}/> {value}</label>
}

export default function Filter() {
    const [isOpen, setIsOpen] = useState(false);
    const [openedDropdown, setOpenedDropdown] = useState(null);
    const [filters, setFilters] = useState([]);
    const [userData, setUserData] = useState({gender: {}, college: {}, graduating_year: {}});

    console.log(filters)

    const [filterResults, setFilterResults] = useState(null);

    useEffect(() => {
        backend.post('/match/filter-results', {userData, filters}, {withCredentials: true}).then((res) => {
            setFilterResults(res.data)
            console.log(res.data);
        })
    }, [isOpen]);

    // const userdataFilters = {
    //     gender: "Male",
    //     college: "College of Science and Engineering",
    //     graduating_year: "2027"
    // }

    // const handleApplyFilters = async () => {
    //     // Collect the selected options for userdata filters
    //     const userdataFilters = {
    //         gender: document.getElementById('gender').value,
    //         college: document.getElementById('college').value,
    //         graduating_year: document.getElementById('graduating_year').value,
    //     };

    //     // Prepare the qnaFilters payload by finding the selected option_ids
    //     const qnaFilterSelections = {
    //         'Building?': document.getElementById('Building?').value,
    //         'Alcohol?': document.getElementById('Alcohol?').value,
    //         'Substances?': document.getElementById('Substances?').value,
    //         'Room Activity?': document.getElementById('Room Activity?').value,
    //     };

    //     const qnaFilters = Object.entries(qnaFilterSelections).reduce((acc, [questionText, selectedOptionText]) => {
    //         if (selectedOptionText) {
    //             const question = qnaOptions.find(q => q.question === questionText);
    //             if (question) {
    //                 const option = question.options.find(o => o.text === selectedOptionText);
    //                 if (option) acc.push(option.option_id);
    //             }
    //         }
    //         return acc;
    //     }, []);
    //     console.log(qnaFilters);

    //     try {
    //         // Adjust the backend call as necessary to handle the two payloads
    //         const response = await backend.post('/match/filter-results', { userdataFilters, qnaFilters }, {
    //             withCredentials: true, // If you need to send cookies with the request for session management
    //         });

    //         if (response.data && Array.isArray(response.data) && response.data.length > 0) {
    //             console.log('Filters applied, user IDs:', response.data); // Assuming the backend returns an array of user_ids
    //         } else {
    //             console.log('No matching users found.');
    //         }
    //     } catch (error) {
    //         console.error('Error applying filters:', error);
    //     }

    //     expandFilterUI();
    // };

    return(
        <>
        {!isOpen &&
        <div className="flex absolute right-0">
            <img onClick={() => setIsOpen(true)} className="object-scale-down h-[12vh] w-[18vh]" src="../assets/images/filter.png"></img>
        </div>
        }

        {isOpen &&
        <div class = "flex absolute bg-maroon w-[80vw] h-[12.5vh] left-[3%] rounded-b-3xl items-center justify-center">
            <div class = "flex space-x-[0.5vw] text-black text-[1vw] font-lora border-5 items-center">

                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Gender" ? null : "Gender")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Gender&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Gender" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <UserDataItem k="gender" value="Male" setUserData={setUserData} />
                        <UserDataItem k="gender" value="Female" setUserData={setUserData} />
                        <UserDataItem k="gender" value="Non-Binary" setUserData={setUserData} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "College" ? null : "College")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">College&emsp;&darr;</button>
                    <div className={`${openedDropdown === "College" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <UserDataItem k="college" value="Carlson" setUserData={setUserData} />
                        <UserDataItem k="college" value="CBS" setUserData={setUserData} />
                        <UserDataItem k="college" value="Design" setUserData={setUserData} />
                        <UserDataItem k="college" value="CEHD" setUserData={setUserData} />
                        <UserDataItem k="college" value="CFANS" setUserData={setUserData} />
                        <UserDataItem k="college" value="CLA" setUserData={setUserData} />
                        <UserDataItem k="college" value="CSE" setUserData={setUserData} />
                        <UserDataItem k="college" value="Nursing" setUserData={setUserData} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Grad. Year" ? null : "Grad. Year")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Grad. Year&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Grad. Year" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <UserDataItem k="graduating_year" value="Freshman" setUserData={setUserData} />
                        <UserDataItem k="graduating_year" value="Sophomore" setUserData={setUserData} />
                        <UserDataItem k="graduating_year" value="Junior" setUserData={setUserData} />
                        <UserDataItem k="graduating_year" value="Senior" setUserData={setUserData} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Building" ? null : "Building")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Building&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Building" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <NormalFilterItem optionId={getIdFromOptionText(5, "17th")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Bailey")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Centennial")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Comstock")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Frontier")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Middlebrook")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Pioneer")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Sanford")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Territorial")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(5, "Yudof")} filters={filters} setFilters={setFilters} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Alcohol Use" ? null : "Alcohol Use")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Alcohol Use&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Alcohol Use" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <NormalFilterItem optionId={getIdFromOptionText(7, "Yes")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(7, "No")} filters={filters} setFilters={setFilters} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Substances" ? null : "Substances")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Substances&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Substances" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <NormalFilterItem optionId={getIdFromOptionText(1, "Yes")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(1, "No")} filters={filters} setFilters={setFilters} />
                    </div>
                </div>
                <div className="relative">
                    <button onClick={() => setOpenedDropdown(openedDropdown === "Room Use" ? null : "Room Use")} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Room Use&emsp;&darr;</button>
                    <div className={`${openedDropdown === "Room Use" ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                        <NormalFilterItem optionId={getIdFromOptionText(6, "Empty")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(6, "Friends")} filters={filters} setFilters={setFilters} />
                        <NormalFilterItem optionId={getIdFromOptionText(6, "Party")} filters={filters} setFilters={setFilters} />
                    </div>
                </div>
                <img onClick={() => setIsOpen(false)} className="bg-[#FFCC33] w-[6vh] h-[6vh] rounded-full object-scale-down px-[0.8vh] py-[0.8vh] cursor-pointer" src="../assets/images/filtercheck.png"></img>
            </div>
        </div>
        }
        </>
    );

}
