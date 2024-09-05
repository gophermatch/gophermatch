import React, { useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import styles from '../../assets/css/sublease.module.css';

export default function SubleaseEntry({ sublease, removeFunc, sublease_id }) {

  const [subleaseData, setSubleaseData] = useState({});

  useEffect(() => {

    if(!sublease && sublease_id)
    {
      fetchSubleaseData();
    } 
    else if (sublease)
    {
      setSubleaseData(sublease);
    }

  }, [sublease_id, sublease]);

  async function fetchSubleaseData () {
        
    const result = await backend.get('/sublease/get', {params: {
        sublease_id: sublease_id,
    }});

    await setSubleaseData(result.data);
  }

  async function save() {
    try {
      const res = await backend.post("/sublease/save", {
        user_id: currentUser.user_id, sublease_id: sublease.sublease_id,
      });

      removeFunc(sublease.sublease_id);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col mt-[2%] w-full overflow-none aspect-w-[1271] aspect-h-[222] duration-200 2xl:text-[32px] xl:text-[28px] lg:text-[24px] md:text-[18px] sm:text-[14px]">
            <div className="flex h-[23.9%] bg-maroon_new text-white 2xl:rounded-t-3xl xl:rounded-t-2xl lg:rounded-t-xl md:rounded-t-lg sm:rounded-t-md">
              <div className={"flex justify-between text-white w-full font-roboto_slab"}>
                <span className="flex flex-row justify-center font-semibold gap-[5%] h-full items-center whitespace-nowrap">
                  <p className={`${styles.lightBold} text-[100%] ml-[25%] flex-shrink-0`}>
                    {subleaseData.building_name}
                  </p>
                  <p className="text-white font-medium text-[75%]">
                    {subleaseData.building_address}
                  </p>
                </span>
                <span className={"flex inline-block text-right items-center font-medium text-[75%] pr-[2%]"}>
                  Available {DateTime.fromISO(subleaseData.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(subleaseData.sublease_end_date).toFormat('MM/dd/yyyy')}
                </span>
              </div>
            </div>
            <div className="flex bg-white flex-row w-full h-full 2xl:rounded-b-3xl xl:rounded-b-2xl lg:rounded-b-xl md:rounded-b-lg sm:rounded-b-md p-[1.5%] gap-[1.5%]">
                <div className="bg-inset_gray flex flex-col 2xl:rounded-3xl xl:rounded-2xl lg:rounded-xl md:rounded-lg sm:rounded-md w-[25%] items-center justify-center overflow-hidden">
                  <div className="flex flex-col w-full h-full p-[2%] gap-[1%] font-roboto_condensed text-[87.5%]">
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Pets</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.pets_allowed}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Kitchen</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.has_kitchen}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%]">
                      <span className="flex flex-grow text-maroon font-bold">Gym</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.has_gym ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-inset_gray flex flex-col 2xl:rounded-3xl xl:rounded-2xl lg:rounded-xl md:rounded-lg sm:rounded-md w-[25%] items-center justify-center overflow-hidden">
                  <div className="flex flex-col w-full h-full p-[2%] gap-[1%] font-roboto_condensed text-[87.5%]">
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Laundry</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.has_laundry}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Parking</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.has_parking}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%]">
                      <span className="flex flex-grow text-maroon font-bold">Furnished</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.is_furnished}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-inset_gray flex flex-col 2xl:rounded-3xl xl:rounded-2xl lg:rounded-xl md:rounded-lg sm:rounded-md w-[25%] items-center justify-center overflow-hidden">
                  <div className="flex flex-col w-full h-full p-[2%] gap-[1%] font-roboto_condensed text-[87.5%]">
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Bedrooms</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.num_bedrooms}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%] border-b-[1px] border-sublease_border">
                      <span className="flex flex-grow text-maroon font-bold">Bathrooms</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.num_bathrooms}</span>
                    </div>
                    <div className="flex justify-between flex-grow items-center flex-[1] px-[5%]">
                      <span className="flex flex-grow text-maroon font-bold">Roommates</span>
                      <span className="flex inline-block text-black font-normal inline-block text-right">{subleaseData.num_roommates}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-grow text-maroon gap-[10%] items-center justify-center overflow-hidden">
                  <div className={`flex flex-row w-full h-full gap-[3%] whitespace-nowrap font-roboto_slab`}>
                    <span className="font-extrabold text-[93.75%]">
                      ${subleaseData.rent_amount}
                    </span>
                    <span className="font-light text-[93.75%]">per month</span>
                  </div>
                  <div className={`flex flex-row w-full justify-end items-end h-full whitespace-nowrap`}>
                    <button className="flex items-center ml-auto justify-center w-[50%] h-[75%] text-[75%] font-bold text-white bg-maroon_new rounded-full font-roboto_slab hover:bg-maroon_dark" onClick={save}>Contact</button>
                  </div>
                </div>
            </div>
    </div>
  );

}
