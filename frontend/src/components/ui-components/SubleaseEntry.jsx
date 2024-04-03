import React, { useEffect, useState } from "react";

export default function SubleaseEntry({ sublease }) {

  async function accept() {
      //TODO: connect to backend route
  }

  return (
    <div
      className={"mt-[3vh] h-[30vh] w-[70vw] flex-col items-center justify-center font-profile font-bold bg-cream text-maroon_new rounded-3xl scale-100"}>
      <div className={"bg-maroon_new h-[33%] w-full self-start rounded-t-3xl"}>
        <p className={"flex justify-between text-white text-[1.5vw] w-full ml-[1vw] mt-[1vh]"}>
          <span className={"mt-[0.7vh]"}>{sublease.building_name}, ${sublease.rent_amount} per
          month, {sublease.num_bedrooms} bed {sublease.num_bathrooms} bath
          </span>
          <span>{/* Empty span for spacing */}</span>
          <span className={"ml-[3vw] inline-block text-right mr-[2vw] mt-[0.7vh]"}>
            Available {sublease.sublease_start_date}-{sublease.sublease_end_date}
          </span>
        </p>
        <p className={"text-white text-[1vw] ml-[1vw] mt-[0vh]"}>
          {sublease.building_address} ({sublease.num_roommates} roommates)
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

      <button className={"absolute right-0 bottom-0 w-[50px] h-[50px] bg-light_gray"}>

      </button>

    </div>
  )

}