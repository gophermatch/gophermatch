import React, { useEffect, useState, useRef } from "react";
import {DateTime} from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import styles from '../../assets/css/sublease.module.css';

export default function SubleaseEntry({ sublease, refreshFunc }) {
  const containerRef = useRef(null);

  const resizeFont = () => {
    if (containerRef.current) {
      const parentHeight = containerRef.current.clientHeight;
      const fontSize = parentHeight * 0.15; 
      containerRef.current.style.fontSize = `${fontSize}px`;
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(resizeFont);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    resizeFont();

    return () => {
      observer.disconnect();
    };
  }, []);

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
    <div className={"mt-[10%] ml-[0%] min-h-[80px] h-[11vw] w-[90%] aspect-[16/3.3] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new h-full w-full bg-cream rounded-[20px]"}>
      <div className={`h-[1.5rem] lg:h-[2rem] xl:h-[2.5rem] relative top-[-1vh] w-full ${sublease.premium ? 'bg-gold': 'bg-maroon_new'} rounded-t-[20px]`}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh] font-roboto_slab"}>
          <span className="mt-[0.3%] ml-[1.5%] flex flex-row justify-center items-center whitespace-nowrap">
            <p className={`${styles.lightBold} text-[100%] flex-shrink-0`}>
              {sublease.building_name}
            </p>
            <p className="text-white xl:text-[15px] text-[9px] ml-[1vw] lg:text-[13px] sm:mt-[3.25px] xl:mt-[2px] flex-shrink-0">
              {sublease.building_address}
            </p>
          </span>
          <span className={"mt-[1%] mr-[3%] inline-block text-right font-light text-[80%]"}>
            Available {DateTime.fromISO(sublease.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(sublease.sublease_end_date).toFormat('MM/dd/yyyy')}
          </span>
        </p>
      </div>
      <div className={"relative flex flex-row ml-[4%] mr-[4%] mt-[0.5%] h-[60%] w-[80%] text-[100%]"}>
        <div className="flex flex-col w-[33%] bg-light_gray ml-[-1.75vw] rounded-[12px] font-roboto_condensed" ref={containerRef}>
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
        <div className="flex flex-col ml-[10px] w-[33%] bg-light_gray rounded-[12px] font-roboto_condensed" ref={containerRef}>
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
        <div className="flex flex-col ml-[12px] w-[33%] bg-light_gray rounded-[12px] font-roboto_condensed" ref={containerRef}>
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
        <div className="absolute text-[7px] xl:text-[17px] lg:text-[14px] md:text-[10px] sm:text-[8px] right-[-3.5rem] sm:right-[-4.25rem] xl:right-[-9.15rem] lg:right-[-8.25rem] md:right-[-6rem] font-roboto_slab">
          <span className={"font-extrabold"}>${sublease.rent_amount}</span> <span className={"font-light"}>per month</span></div>
          <button className="absolute w-[2rem] xl:text-[15px] xl:h-[1.75rem] xl:w-[4.4rem] lg:text-[13px] lg:w-[4rem] lg:h-[1.5rem] sm:w-[2.75rem] md:w-[3.25rem]  bottom-[0vh] md:h-[18px] md:text-[10px] h-[14px] sm:h-[16px] sm:text-[8px] text-[6px] right-[-3.5rem] sm:bottom-[0.5rem] sm:right-[-4.25rem] md:right-[-6rem] lg:right-[-8.25rem] xl:right-[-9.15rem] text-white bg-maroon_new rounded-full font-roboto hover:bg-maroon_dark" onClick={save}>Contact</button>
        </div>
      </div>
    </div>
  )

}