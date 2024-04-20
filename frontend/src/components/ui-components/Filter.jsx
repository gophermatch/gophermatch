import React, { useEffect, useState } from 'react';
import backend from '../../backend';
import qnaOptions from './qnaOptions.json';

const defaultUserdata = {
    gender: {},
    college: {},
    graduating_year: {}
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
    obj = {...obj}
    if (item in obj) {
        delete obj[item];
    } else {
        obj[item] = true;
    }
    return obj;
}

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
    return <label className="block hover:bg-[#EBE1BA]"><input type="checkbox" name={optionId} checked={filters.includes(optionId)} onChange={(e) => setFilters(s => e.target.checked ? [...s.filter(v => v!== optionId), optionId] : s.filter(v => v!== optionId))} /> {getOptionTextFromId(optionId)}</label>
}
const UserDataItem = function({k, value, userData, setUserData}) {
    return <label className="block hover:bg-[#EBE1BA]">
            <input
                type="checkbox"
                checked={value in userData[k]}
                name={value}
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

export default function Filter(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [openedDropdowns, setOpenedDropdowns] = useState({});
    const [filters, setFilters] = useState([]);
    const [userData, setUserData] = useState(defaultUserdata);

    function requestFilterResults(props) {
        backend.post('/match/filter-results', {userData, filters}, {withCredentials: true}).then((res) => {
            setFilterResults(res.data)
            console.log("Filtered profiles: ", res.data);
        });
    }

    useEffect(requestFilterResults, []);

    const setFilterResults = props.setFilterResults;

    return(
        <div>
            {isOpen &&
            <div className = "flex absolute bg-maroon w-[80vw] h-[12.5vh] left-[3%] rounded-b-3xl items-center justify-center">
                <div className = "flex space-x-[0.5vw] text-black text-[1vw] font-lora border-5 items-center">

                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Gender"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Gender&emsp;&darr;</button>
                        <div className={`${openedDropdowns["Gender"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="gender" value="Male" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="gender" value="Female" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="gender" value="Non-Binary" setUserData={setUserData} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "College")) } className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">College&emsp;&darr;</button>
                        <div className={`${openedDropdowns["College"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
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
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Grad. Year"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Grad. Year&emsp;&darr;</button>
                        <div className={`${openedDropdowns["Grad. Year"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <UserDataItem userData={userData} k="graduating_year" value="Freshman" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="Sophomore" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="Junior" setUserData={setUserData} />
                            <UserDataItem userData={userData} k="graduating_year" value="Senior" setUserData={setUserData} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Building"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Building&emsp;&darr;</button>
                        <div className={`${openedDropdowns["Building"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
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
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Alcohol Use"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Alcohol Use&emsp;&darr;</button>
                        <div className={`${openedDropdowns["Alcohol Use"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <NormalFilterItem optionId={getIdFromOptionText(7, "Yes")} filters={filters} setFilters={setFilters} />
                            <NormalFilterItem optionId={getIdFromOptionText(7, "No")} filters={filters} setFilters={setFilters} />
                        </div>
                    </div>
                    <div className="relative">
                        {/* <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Substances"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Substances&emsp;&darr;</button> */}
                        <div className={`${openedDropdowns["Substances"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <NormalFilterItem optionId={getIdFromOptionText(1, "Yes")} filters={filters} setFilters={setFilters} />
                            <NormalFilterItem optionId={getIdFromOptionText(1, "No")} filters={filters} setFilters={setFilters} />
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Room Use"))} className="bg-[#DED7D7] w-[10vw] h-[6vh] rounded-md px-[1.5vh] py-[1vh] shadow-xl hover:opacity-95">Room Use&emsp;&darr;</button>
                        <div className={`${openedDropdowns["Room Use"] ? "block" : "hidden"} absolute bg-[#DED7D7] mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                            <NormalFilterItem optionId={getIdFromOptionText(6, "Empty")} filters={filters} setFilters={setFilters} />
                            <NormalFilterItem optionId={getIdFromOptionText(6, "Friends")} filters={filters} setFilters={setFilters} />
                            <NormalFilterItem optionId={getIdFromOptionText(6, "Party")} filters={filters} setFilters={setFilters} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-[10vh] h-[6vh]">
                        <button onClick={requestFilterResults} className="bg-gold rounded-md text-sm" >Confirm</button>
                        <button onClick={() => {setFilters([]); setUserData(defaultUserdata)}} className="bg-gold rounded-md text-sm" >Reset</button>
                    </div>
                </div>
            </div>
            }
            <img onClick={() => setIsOpen(isOpen => !isOpen)} src={`../assets/images/${isOpen ? "dropup" : "dropdown"}.png`} className={`absolute ${isOpen ? "top-[13vh]" : "top-0"} right-[10vh] ml-auto mr-auto w-[7vh] h-[7vh]`} />
        </div>
    );
}
