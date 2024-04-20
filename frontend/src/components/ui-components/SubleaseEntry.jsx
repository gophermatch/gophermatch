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
      className={"mt-[3vh] h-[30vh] w-[70vw] flex items-center"}>
      <div className={"font-profile font-bold p-0 text-maroon_new h-full w-[90%] bg-cream rounded-3xl"}>
      <div className={`h-[33%] relative top-[-1vh] w-full rounded-t-3xl ${sublease.premium ? 'bg-gold': 'bg-maroon_new'}`}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh]"}>
          <span className={"mt-[0.7vh]"}>{sublease.building_name}, ${sublease.rent_amount} per
          month, {sublease.num_bedrooms} bed {sublease.num_bathrooms} bath
          </span>
          <span></span>
          <span className={"ml-[3vw] inline-block text-right mr-[2vw] mt-[0.7vh]"}>
            Available {DateTime.fromISO(sublease.sublease_start_date).toFormat('MM/dd/yyyy')}-{DateTime.fromISO(sublease.sublease_end_date).toFormat('MM/dd/yyyy')}
          </span>
        </p>
        <p className={"text-white text-[1vw] ml-[1vw] mt-[0vh]"}>
          {sublease.building_address} ({sublease.num_roommates} roommate{sublease.num_roommates !== 1 && 's'})
        </p>
      </div>

      <div className={"ml-[2.5vw] mr-[2.5vw] mt-[2.5vh] h-[55%] w-[95%] grid grid-cols-4 text-[1.2vw]"}>
        <span>Pets</span>
        <span className="font-light">{sublease.pets_allowed}</span>
        <span>Kitchen</span>
        <span className="font-light">{sublease.has_kitchen}</span>
        <span>Laundry</span>
        <span className="font-light">{sublease.has_laundry}</span>
        <span>Parking</span>
        <span className="whitespace-nowrap font-light">{sublease.has_parking}</span>
        <span>Pool</span>
        <span className="font-light">{sublease.has_pool ? "Yes" : "No"}</span>
        <span>Gym</span>
        <span className="font-light">{sublease.has_gym ? "Yes" : "No"}</span>
      </div>
      </div>

      <button className={"bg-maroon_new ml-5 w-[50px] h-[50px] bg-black text-white rounded-2xl duration-200 hover:pl-3"} onClick={save}>
        →
      </button>

    </div>
  )

}