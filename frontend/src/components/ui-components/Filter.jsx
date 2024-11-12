import React, { useEffect, useState } from 'react';
import qnaOptions from './qnaOptions.json';
import dropdownArrow from '../../assets/images/filterArrow.svg';
import resetImage from "../../assets/images/Reset.png";
import checkmarkImage from "../../assets/images/checkmark.png";

const defaultUserdata = {
    gender: {},
    college: {},
    graduating_year: {},
    building: {},
    alcohol: {},
    substances: {},
    room_activity: {}
}

const deepCloneArr = (items) => items.map(item => Array.isArray(item) ? deepCloneArr(item) : item);
const deepCloneObj = (items) => {
    const finalObj = {};
    for (let key of Object.keys(items)) {
        finalObj[key] = typeof items[key] !== "object" ? items[key] : deepCloneObj(items[key]);
    }
    return finalObj;
}

function toggleObjectItem(obj, item) {
    obj = { ...obj }
    if (item in obj) {
        delete obj[item];
    } else {
        obj[item] = true;
    }
    return obj;
}

function getIdFromOptionText(questionId, optionText) {

    const question = qnaOptions.find(v => v.id === questionId);

    if (question) {
        const option = question.options.find(item => item.text === optionText);

        if (option) {
            return option.option_id;
        }
    }

    return null;
}

function getOptionTextFromId(id) {
    for (const question of qnaOptions) {
        if (!question.options) continue;
        const option = question.options.find(item => item.option_id === id)
        if (option) return option.text
    }
}

const NormalFilterItem = function ({ optionId, filters, setFilters }) {
    return <label className="block hover:bg-[#EBE1BA]"><input type="checkbox" name={optionId} checked={filters.includes(optionId)} onChange={(e) => setFilters(s => e.target.checked ? [...s.filter(v => v !== optionId), optionId] : s.filter(v => v !== optionId))} /> {getOptionTextFromId(optionId)}</label>
}
const UserDataItem = function ({ k, value, userData, setUserData }) {
    return <label className="block hover:bg-[#EBE1BA]">
        <input
            type="checkbox"
            checked={value in userData[k]}
            name={value}
            className="mr-[0.25vw]"
            onChange={(e) => setUserData((prevData) => {
                prevData = deepCloneObj(prevData);
                if (e.target.checked) {
                    prevData[k][value] = true;
                } else {
                    delete prevData[k][value];
                }
                return prevData
            })}
        />
        {value}
    </label>
}

export default function Filter({ setFiltersExternal, setUserDataExternal, profileMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openedDropdowns, setOpenedDropdowns] = useState({});
    const [filters, setFilters] = useState([]);
    const [userData, setUserData] = useState(defaultUserdata);

    // Pass filters and userData to the parent component (Match.jsx)
    const updateExternals = () => {
        setFiltersExternal(filters);
        setUserDataExternal(userData);
    }

    const collapseAll = () => {
        setOpenedDropdowns([]);
    }

    return (
        <div className="">
            <div
                className={`flex absolute bg-dark_maroon h-[6vh] w-[80vw] left-[3%] rounded-b-xl items-center justify-center transition-transform duration-500 ${isOpen ? "translate-y-[0vh]" : "translate-y-[-6vh]"} z-50`}>
                <div
                    className="flex space-x-[0.5vw] text-black font-normal text-[1.2vh] sm:text-[1.1vw] lg:text-[0.8vw] font-roboto_slab font-medium border-5 items-center">
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Gender"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Gender
                        </button>
                        <div
                            className={`${openedDropdowns["Gender"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="gender" value="Male" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="gender" value="Female" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="gender" value="Non-Binary"
                                setUserData={setUserData} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "College"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">College
                        </button>
                        <div
                            className={`${openedDropdowns["College"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="college" value="Carlson" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="CBS" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="Design" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="CEHD" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="CFANS" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="CLA" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="CSE" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="college" value="Nursing" setUserData={setUserData} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Grad. Year"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Grad.
                            Year
                        </button>
                        <div
                            className={`${openedDropdowns["Grad. Year"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="graduating_year" value="2025"
                                setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="2026"
                                setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="2027"
                                setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="2028"
                                setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="2029"
                                setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="2030"
                                setUserData={setUserData} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Building"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Building
                        </button>
                        <div className={`${openedDropdowns["Building"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="building" value="17th" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Bailey" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Centennial" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Comstock" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Frontier" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Middlebrook" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Pioneer" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Sanford" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Territorial" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="building" value="Yudof" setUserData={setUserData} />
                        </div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Alcohol Use"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Alcohol Use
                        </button>
                        <div className={`${openedDropdowns["Alcohol Use"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="alcohol" value="Yes" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="alcohol" value="No" setUserData={setUserData} />
                        </div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Substances"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Substances
                        </button>
                        <div className={`${openedDropdowns["Substances"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="substances" value="Yes" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="substances" value="No" setUserData={setUserData} />
                        </div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Room Use"))}
                            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Room Use
                        </button>
                        <div className={`${openedDropdowns["Room Use"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="room_activity" value="Empty" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="room_activity" value="Friends" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="room_activity" value="Party" setUserData={setUserData} />
                        </div>
                    </div>

                </div>
                <div className="flex justify-between ml-[0.5vw] space-x-[0.7vw] w-[9.4vw] h-[4.5vh]">
                    <button onClick={() => {
                        updateExternals();
                        collapseAll();
                    }}
                        className="flex-1 p-[5px] bg-maroon_new hover:bg-gold rounded-md text-sm"><img
                            className="w-full h-full object-contain" alt="checkmark"
                            src={checkmarkImage}></img></button>
                    <button onClick={() => {
                        setFilters([]);
                        setUserData(defaultUserdata);
                        collapseAll();
                    }} className="flex-1 p-[5px] bg-maroon_new hover:bg-gold rounded-md text-sm"><img
                        className="w-full h-full object-contain"
                        alt="checkmark"
                        src={resetImage}></img>
                    </button>
                </div>
            </div>

            <button onClick={() => {
            if (isOpen) {
                collapseAll();
            }
                setIsOpen(isOpen => !isOpen);
            }}>
                <img className={`absolute duration-[400ms] right-[12vh] ml-auto mr-auto cursor cursor-pointer transform transition-transform ${isOpen ? `scale-y-[-1] translate-y-[50px]` : `scale-y-[1] translate-y-[0px]`}`} src={dropdownArrow}></img>
            </button>
        </div>
    );
}
