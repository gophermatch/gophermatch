import React, { useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import styles from '../../assets/css/sublease.module.css';

export default function SubleaseEntry({ sublease, refreshFunc, sublease_id }) {
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);
  const containerRef4 = useRef(null);
  const rentAmountLength = sublease.rent_amount.toString().length;
  const marginLeft = rentAmountLength === 4 ? '28%' : '30%';


  const resizeFont = (ref, scale) => {
    if (ref.current) {
      const parentHeight = ref.current.clientHeight;
      const fontSize = parentHeight * scale;
      ref.current.style.fontSize = `${fontSize}px`;
    }
  };

  useEffect(() => {
    const observer1 = new ResizeObserver(() => resizeFont(containerRef1, 0.15));
    const observer2 = new ResizeObserver(() => resizeFont(containerRef2, 0.15));
    const observer3 = new ResizeObserver(() => resizeFont(containerRef3, 0.15));
    const observer4 = new ResizeObserver(() => resizeFont(containerRef4, 0.15));

    if (containerRef1.current) observer1.observe(containerRef1.current);
    if (containerRef2.current) observer2.observe(containerRef2.current);
    if (containerRef3.current) observer3.observe(containerRef3.current);
    if (containerRef4.current) observer4.observe(containerRef4.current);

    resizeFont(containerRef1, 0.15);
    resizeFont(containerRef2, 0.15);
    resizeFont(containerRef3, 0.15);
    resizeFont(containerRef4, 0.15);

    return () => {
      observer1.disconnect();
      observer2.disconnect();
      observer3.disconnect();
      observer4.disconnect();
    };
  }, []);

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

      refreshFunc();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={"mt-[10%] ml-[0%] min-h-[80px] h-[11vw] w-[90%] aspect-[16/3.3] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new h-full w-full bg-cream rounded-[20px]"}>
        <div className={`h-[1.5rem] lg:h-[2rem] xl:h-[2.5rem] relative top-[-1vh] w-full ${subleaseData.premium ? 'bg-gold': 'bg-maroon_new'} rounded-t-[20px]`}>
          <div className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh] font-roboto_slab"}>
            <span className="mt-[0.3%] ml-[1.5%] flex flex-row justify-center items-center whitespace-nowrap">
              <p className={`${styles.lightBold} text-[100%] flex-shrink-0`}>
                {subleaseData.building_name}
              </p>
              <p className="text-white xl:text-[15px] text-[9px] ml-[1vw] lg:text-[13px] sm:mt-[3.25px] xl:mt-[2px] flex-shrink-0">
                {subleaseData.building_address}
              </p>
            </span>
            <span className={"mt-[1%] mr-[3%] inline-block text-right font-light text-[80%]"}>
              Available {DateTime.fromISO(subleaseData.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(subleaseData.sublease_end_date).toFormat('MM/dd/yyyy')}
            </span>
          </div>
        </div>
        <div className={"relative flex flex-row ml-[4%] mr-[4%] mt-[0.5%] h-[60%] w-[90%] text-[100%]"}>
          <div className="flex flex-col w-[33%] bg-light_gray ml-[-1.75vw] rounded-[12px] font-roboto_condensed" ref={containerRef1}>
            <div className={`flex flex-col font-roboto_condensed`}>
              <div className="flex flex-row justify-between items-center">
                <span className="ml-[8%] mt-[3%]">Pets</span>
                <span className="mr-[8%] mt-[3%] font-light text-black">{subleaseData.pets_allowed}</span>
              </div>
              <div className="w-full flex justify-center mt-[4px]">
                <div className="h-[0.5px] w-[95%] bg-black"></div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[2%]">Furnished</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{sublease.is_furnished ? "Yes" : "No"}</span>
            </div>
            <div className="w-full flex justify-center mt-[3px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[2%]">Bedrooms</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{sublease.num_bedrooms}</span>
            </div>
          </div>
          <div className="flex flex-col ml-[10px] w-[33%] bg-light_gray rounded-[12px] font-roboto_condensed" ref={containerRef2}>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[3%]">Kitchen</span>
              <span className="mr-[8%] mt-[3%] font-light text-black justify-end">{subleaseData.has_kitchen}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[2%]">Laundry</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{subleaseData.has_laundry}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[2%]">Bathrooms</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{subleaseData.num_bathrooms}</span>
            </div>
          </div>
          <div className="flex flex-col ml-[12px] w-[33%] bg-light_gray rounded-[12px] font-roboto_condensed" ref={containerRef3}>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[3%]">Parking</span>
              <span className="mr-[8%] mt-[3%] whitespace-nowrap font-light text-black">{subleaseData.has_parking}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
            <div className="flex flex-row justify-between items-center"> 
              <span className="ml-[8%] mt-[2%]">Gym</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{subleaseData.has_gym ? "Yes" : "No"}</span>
            </div>
            <div className="w-full flex justify-center mt-[4px]">
              <div className="h-[0.5px] w-[95%] bg-black"></div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="ml-[8%] mt-[2%]">Roommates</span>
              <span className="mr-[8%] mt-[2%] font-light text-black">{subleaseData.num_roommates}</span>
            </div>
          </div>
          <div className={`flex flex-row items-center whitespace-nowrap mt-[-10%] font-roboto_slab`}>
            <span className="font-extrabold text-[1.25vw]" style={{ marginLeft: marginLeft }}>
              ${subleaseData.rent_amount}
            </span>
            <span className="font-light text-[1.25vw] ml-[6%] mt-[-1%]">per month</span>
          </div>
          <button className="absolute w-[10%] h-[30%] bottom-[0vh] right-[-5.5%] text-[1vw] text-white bg-maroon_new rounded-full font-roboto hover:bg-maroon_dark" onClick={save}>Contact</button>
        </div>
      </div>
    </div>
  );
}
