import React, { useEffect, useState } from "react";
import {DateTime} from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import styles from '../../assets/css/sublease.module.css';

export default function SubleaseEntry({ sublease, sublease_id, refreshFun, hideContact }) {

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
      console.log(sublease);

      const res = await backend.post("/sublease/save", {
        user_id: currentUser.user_id, sublease_id: sublease.sublease_id,
      });

      refreshFunc();

    } catch (err) {
      // If no profiles are found in our query, don't try to load more in the future
      console.error(err);
    }
  }

  return (
    <div className={"mt-[2.5vh] ml-[3vw] aspect-[16/3.3] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new h-[6rem] ml-[33rem] w-[26%] sm:h-[6.3rem] sm:w-[50%] xl:w-[95%] xl:ml-0 lg:ml-[6rem] lg:h-[67%] xl:h-[78%] lg:w-[79%] md:w-[50%] md:ml-[19rem] md:mt-[5%] sm:ml-[25%] bg-cream rounded-[20px]"}>
      <div className={`h-[1.5rem] lg:h-[2rem] xl:h-[2.5rem] relative top-[-1vh] w-full ${subleaseData.premium ? 'bg-gold': 'bg-maroon_new'} rounded-t-[20px]`}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh] font-roboto_slab"}>
          <span className={"mt-[2vh] ml-[2vw] md:ml-[0.5rem] xl:ml-[0.2rem] xl:mt-[0.75vh] text-[11px] xl:text-[17px] sm:text-[12px] lg:text-[15.5px] sm:mt-[4px] flex flex-row font-light"}>
            <p className={styles.lightBold}>
              {subleaseData.building_name} 
            </p>
            <p className={"text-white xl:text-[15px] text-[9px] ml-[1vw] mt-[1vh] lg:text-[13px] sm:mt-[3.25px] xl:mt-[2px]"}>
            {subleaseData.building_address}
        </p>
          </span>
          <span className={"ml-[3vw] inline-block text-right xl:mr-[2rem] xl:mt-[1vh] lg:text-[15px] text-[10px] sm:text-[11px] sm:mt-[3.5px] mr-[4vw] mt-[2vh] font-light"}>
            Available {DateTime.fromISO(subleaseData.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(subleaseData.sublease_end_date).toFormat('MM/dd/yyyy')}
          </span>
        </p>
      </div>
      <div className={"relative flex flex-row ml-[2.5vw] mr-[2.5vw] mt-[0.5vh] h-[60%] w-[80%] text-[1.2vw]"}>
        <div className="flex flex-col w-[300px] bg-light_gray ml-[-1.75vw] rounded-[12px] text-[7px] lg:text-[13px] xl:text-[14px] font-roboto_condensed">
          <div className={`flex flex-col font-roboto_condensed`}>
            <div className="flex flex-row justify-between items-center">
              <span className="ml-[13px] mt-[7px]">Pets</span>
              <span className="mr-[13px] mt-[7px] font-light text-black">{subleaseData.pets_allowed}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Furnished</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{subleaseData.is_furnished ? "Yes" : "No"}</span>
          </div>
          <div className="w-full flex justify-center mt-[3px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Bedrooms</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{subleaseData.num_bedrooms}</span>
          </div>
        </div>
        <div className="flex flex-col ml-[10px] w-[300px] bg-light_gray rounded-[12px] xl:text-[14px] lg:text-[13px] text-[7px] font-roboto_condensed">
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[7px]">Kitchen</span>
            <span className="mr-[13px] mt-[7px] font-light text-black justify-end">{subleaseData.has_kitchen}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Laundry</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{subleaseData.has_laundry}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Bathrooms</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{subleaseData.num_bathrooms}</span>
          </div>
        </div>
        <div className="flex flex-col ml-[12px] w-[300px] bg-light_gray rounded-[12px] xl:text-[14px] lg:text-[13px] text-[7px] font-roboto_condensed">
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[7px]">Parking</span>
            <span className="mr-[13px] mt-[7px] whitespace-nowrap font-light text-black">{subleaseData.has_parking}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Gym</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{subleaseData.has_gym ? "Yes" : "No"}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className="ml-[13px] mt-[4px]">Roommates</span>
            <span className="mr-[13px]  mt-[4px] font-light text-black">{subleaseData.num_roommates}</span>
          </div>
        </div>
        <div className="absolute text-[7px] xl:text-[17px] lg:text-[14px] md:text-[10px] sm:text-[8px] right-[-3.5rem] sm:right-[-4.25rem] xl:right-[-9.15rem] lg:right-[-8.25rem] md:right-[-6rem] font-roboto_slab">
          <span className={"font-extrabold"}>${subleaseData.rent_amount}</span> <span className={"font-light"}>per month</span></div>
          {hideContact || <button className="absolute w-[2rem] xl:text-[15px] xl:h-[1.75rem] xl:w-[4.4rem] lg:text-[13px] lg:w-[4rem] lg:h-[1.5rem] sm:w-[2.75rem] md:w-[3.25rem]  bottom-[0vh] md:h-[18px] md:text-[10px] h-[14px] sm:h-[16px] sm:text-[8px] text-[6px] right-[-3.5rem] sm:bottom-[0.5rem] sm:right-[-4.25rem] md:right-[-6rem] lg:right-[-8.25rem] xl:right-[-9.15rem] text-white bg-maroon_new rounded-full font-roboto hover:bg-maroon_dark" onClick={save}>Contact</button>}
        </div>
      </div>
    </div>
  )

}