import React, { useEffect, useState } from "react";
import {DateTime} from "luxon";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";

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
      className={"mt-[3vh] ml-[7.5vw] aspect-[16/3.3] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new h-full w-[90%] bg-cream rounded-md"}>
      <div className={`h-[33%] relative top-[-1vh] w-full ${sublease.premium ? 'bg-gold': 'bg-maroon_new'} rounded-t-md`}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh]"}>
          <span className={"mt-[0.7vh]"}>{sublease.building_name}
          </span>
          <span></span>
          <span className={"ml-[3vw] inline-block text-right mr-[2vw] mt-[0.7vh]"}>
            Available {DateTime.fromISO(sublease.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(sublease.sublease_end_date).toFormat('MM/dd/yyyy')}
          </span>
        </p>
        <p className={"text-white text-[1vw] ml-[1vw] mt-[0vh]"}>
          {sublease.building_address}
        </p>
      </div>
      <div className={"relative ml-[2.5vw] mr-[2.5vw] mt-[0.5vh] h-[55%] w-[70%] grid grid-cols-6 text-[1.2vw]"}>
        <span>Pets</span>
        <span className="font-light text-black">{sublease.pets_allowed}</span>
        <span>Furnished</span>
        <span className="font-light text-black">{sublease.is_furnished ? "Yes" : "No"}</span>
        <span>Bedrooms</span>
        <span className="font-light text-black">{sublease.num_bedrooms}</span>
        <span>Kitchen</span>
        <span className="font-light text-black">{sublease.has_kitchen}</span>
        <span>Laundry</span>
        <span className="font-light text-black">{sublease.has_laundry}</span>
        <span>Bathrooms</span>
        <span className="font-light text-black">{sublease.num_bathrooms}</span>
        <span>Parking</span>
        <span className="whitespace-nowrap font-light text-black">{sublease.has_parking}</span>
        <span>Gym</span>
        <span className="font-light text-black">{sublease.has_gym ? "Yes" : "No"}</span>
        <span>Roommates</span>
        <span className="font-light text-black">{sublease.num_roommates}</span>
        <div className="absolute right-[-13.5vw]"><span className={"font-extrabold"}>${sublease.rent_amount}</span> <span className={"font-light"}>per month</span></div>
        <button className="absolute bottom-[0vh] right-[-13.5vw] text-white bg-maroon_new rounded-lg w-[6vw] font-roboto" onClick={save}>Contact</button>
      </div>
      </div>

    </div>
  )

}