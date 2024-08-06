import React, { useEffect, useState } from "react";
import {DateTime} from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import styles from '../../assets/css/sublease.module.css';

export default function SubleaseEntry({ sublease, refreshFunc }) {

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
    <div
      className={"mt-[2.5vh] ml-[3vw] aspect-[16/3.3] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new lg:h-[11.5rem] md:h-[8.75rem] xl:w-[95%] xl:ml-0 lg:ml-0 lg:w-[90%] md:w-[70%] md:ml-[12%] md:mt-[5%] sm:w-[40%] sm:ml-[25%] bg-cream rounded-[20px]"}>
      <div className={`h-[2.5rem] relative top-[-1vh] w-full ${sublease.premium ? 'bg-gold': 'bg-maroon_new'} rounded-t-[20px]`}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh] font-roboto_slab"}>
          <span className={"mt-[0.3vh] flex flex-row font-light"}>
            <p className={styles.lightBold}>
              {sublease.building_name} 
            </p>
            <p className={"text-white text-[17px] ml-[1vw] mt-[0.65vh]"}>
            {sublease.building_address}
        </p>
          </span>
          <span className={"ml-[3vw] inline-block text-right mr-[2vw] mt-[0.7vh] font-light"}>
            Available {DateTime.fromISO(sublease.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(sublease.sublease_end_date).toFormat('MM/dd/yyyy')}
          </span>
        </p>
      </div>
      <div className={"relative flex flex-row ml-[2.5vw] mr-[2.5vw] mt-[0.5vh] h-[59%] w-[80%] text-[1.2vw]"}>
        <div className="flex flex-col w-[300px] bg-light_gray ml-[-1.75vw] rounded-[12px] font-roboto_condensed">
          <div className={`flex flex-col font-roboto_condensed`}>
            <div className="flex flex-row justify-between items-center">
              <span className="ml-[13px] mt-[7px]">Pets</span>
              <span className="mr-[13px] mt-[7px] font-light text-black">{sublease.pets_allowed}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Furnished</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{sublease.is_furnished ? "Yes" : "No"}</span>
          </div>
          <div className="w-full flex justify-center mt-[3px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Bedrooms</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{sublease.num_bedrooms}</span>
          </div>
        </div>
        <div className="flex flex-col ml-[10px] w-[300px] bg-light_gray rounded-[12px] font-roboto_condensed">
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[7px]">Kitchen</span>
            <span className="mr-[13px] mt-[7px] font-light text-black justify-end">{sublease.has_kitchen}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Laundry</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{sublease.has_laundry}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Bathrooms</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{sublease.num_bathrooms}</span>
          </div>
        </div>
        <div className="flex flex-col ml-[12px] w-[300px] bg-light_gray rounded-[12px] font-roboto_condensed">
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[7px]">Parking</span>
            <span className="mr-[13px] mt-[7px] whitespace-nowrap font-light text-black">{sublease.has_parking}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center"> 
            <span className="ml-[13px] mt-[4px]">Gym</span>
            <span className="mr-[13px] mt-[4px] font-light text-black">{sublease.has_gym ? "Yes" : "No"}</span>
          </div>
          <div className="w-full flex justify-center mt-[4px]">
            <div className="h-[0.5px] w-[95%] bg-black"></div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className="ml-[13px] mt-[4px]">Roommates</span>
            <span className="mr-[13px]  mt-[4px] font-light text-black">{sublease.num_roommates}</span>
          </div>
        </div>
        <div className="absolute sm:right-[-3.5rem] xl:right-[-9.15rem] md:right-[-6rem] font-roboto_slab">
          <span className={"font-extrabold"}>${sublease.rent_amount}</span> <span className={"font-light"}>per month</span></div>
          <button className="absolute bottom-[0vh] sm:bottom-[0.5rem] sm:right-[-3.5rem] md:right-[-6rem] xl:right-[-9.15rem] text-white bg-maroon_new rounded-full w-[6vw] font-roboto" onClick={save}>Contact</button>
        </div>
      </div>
    </div>
  )

}