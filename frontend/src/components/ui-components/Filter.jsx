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

    if(question) {
        const option = question.options.find(item => item.text === optionText);

        if (option) {
            return option.option_id;
        }
    }

    return null;
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

export default function Filter({setFilterResults}) {
    const [isOpen, setIsOpen] = useState(false);
    const [openedDropdowns, setOpenedDropdowns] = useState({});
    const [filters, setFilters] = useState([]);
    const [userData, setUserData] = useState(defaultUserdata);

    function requestFilterResults() {
        backend.post('/match/filter-results', {userData, filters}, {withCredentials: true}).then((res) => {
            setFilterResults(res.data)
            console.log("Filtered profiles: ", res.data);
        });
    }

    useEffect(requestFilterResults, []);

    return(
        <div>
              <div
                className={`flex absolute bg-dark_maroon h-[6vh] w-[80vw] left-[3%] rounded-b-xl items-center justify-center transition-transform duration-500 ${isOpen ? "translate-y-[0vh]" : "translate-y-[-6vh]"}`}>
                  <div
                    className="flex space-x-[0.5vw] text-black font-normal text-[1.1vw] font-inconsolata border-5 items-center">
                      <div className="relative">
                          <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Gender"))}
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Gender</button>
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
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">College</button>
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
                              Year</button>
                          <div
                            className={`${openedDropdowns["Grad. Year"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                              <UserDataItem userData={userData} k="graduating_year" value="Freshman"
                                            setUserData={setUserData} />
                              <UserDataItem userData={userData} k="graduating_year" value="Sophomore"
                                            setUserData={setUserData} />
                              <UserDataItem userData={userData} k="graduating_year" value="Junior"
                                            setUserData={setUserData} />
                              <UserDataItem userData={userData} k="graduating_year" value="Senior"
                                            setUserData={setUserData} />
                          </div>
                      </div>
                      <div className="relative">
                          <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Building"))}
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Building</button>
                          <div
                            className={`${openedDropdowns["Building"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                              <NormalFilterItem optionId={getIdFromOptionText(2, "17th")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Bailey")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Centennial")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Comstock")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Frontier")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Middlebrook")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Pioneer")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Sanford")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Territorial")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(2, "Yudof")} filters={filters}
                                                setFilters={setFilters} />
                          </div>
                      </div>
                      <div className="relative">
                          <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Alcohol Use"))}
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Alcohol
                              Use</button>
                          <div
                            className={`${openedDropdowns["Alcohol Use"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                              <NormalFilterItem optionId={getIdFromOptionText(4, "Yes")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(4, "No")} filters={filters}
                                                setFilters={setFilters} />
                          </div>
                      </div>
                      <div className="relative">
                          <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Substances"))}
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Substances</button>
                          <div
                            className={`${openedDropdowns["Substances"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                              <NormalFilterItem optionId={getIdFromOptionText(1, "Yes")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(1, "No")} filters={filters}
                                                setFilters={setFilters} />
                          </div>
                      </div>
                      <div className="relative">
                          <button onClick={() => setOpenedDropdowns(s => toggleObjectItem(s, "Room Use"))}
                                  className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white">Room
                              Use</button>
                          <div
                            className={`${openedDropdowns["Room Use"] ? "block" : "hidden"} absolute bg-white border-[0.5px] border-black mt-2 rounded-lg left-0 right-0 overflow-hidden p-[5px]`}>
                              <NormalFilterItem optionId={getIdFromOptionText(3, "Empty")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(3, "Friends")} filters={filters}
                                                setFilters={setFilters} />
                              <NormalFilterItem optionId={getIdFromOptionText(3, "Party")} filters={filters}
                                                setFilters={setFilters} />
                          </div>
                      </div>
                      <div className="flex justify-between space-x-[0.7vw] w-[9.4vw] h-[4.5vh]">
                          <button onClick={requestFilterResults} className="flex-1 p-[5px] bg-maroon_new hover:bg-gold rounded-md text-sm"><img className="w-full h-full object-contain" alt="checkmark" src={"../assets/images/checkmark.png"}></img></button>
                          <button onClick={() => {
                              setFilters([]);
                              setUserData(defaultUserdata);
                          }} className="flex-1 p-[5px] bg-maroon_new hover:bg-gold rounded-md text-sm"><img className="w-full h-full object-contain"
                                                                                alt="checkmark"
                                                                                src={"../assets/images/Reset.png"}></img>
                          </button>
                      </div>
                  </div>
              </div>
            <img onClick={() => setIsOpen(isOpen => !isOpen)}
                 src={`../assets/images/${isOpen ? "dropup" : "dropdown"}.png`}
                 className={`absolute ${isOpen ? "top-[13vh]" : "top-0"} right-[10vh] ml-auto mr-auto w-[7vh] h-[7vh]`} />
        </div>
    );
}
