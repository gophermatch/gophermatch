import { useState } from "react";
import SubleaseEntry from '../ui-components/SubleaseEntry.jsx';

export default function Sublease()
{
  const [subleases, setSubleases] = useState([]);

  const sampleSublease = {
    user_id: 1,
    building_name: "Sample Building",
    building_address: "123 Sample St, Sample City, Sample State, 12345",
    num_bathrooms: 2,
    num_bedrooms: 3,
    num_roommates: 2,
    rent_amount: 2000,
    housing_type: "Apartment",
    pets_allowed: "Limited",
    has_kitchen: "Full",
    has_laundry: "Included",
    has_parking: "Additional Cost",
    has_pool: true,
    is_furnished: "Partially",
    has_gym: false,
    sublease_start_date: "2024/04/01",
    sublease_end_date: "2025/04/01"
  };

  return(
    <div className="h-screen flex flex-col bg-offwhite items-center justify-center font-profile font-semibold">
      <div className={"overflow-y-auto flex-grow"} style={{
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          width: '0'
        }
      }}>

        <button className={"flex-1 w-[70vw] mt-[4vh] h-[50px] m-auto bg-white rounded-3xl text-lg text-black"}>
          Add a sublease
        </button>
        <SubleaseEntry sublease={sampleSublease}/>
        <SubleaseEntry sublease={sampleSublease}/>
        <SubleaseEntry sublease={sampleSublease}/>
        <SubleaseEntry sublease={sampleSublease}/>
        <SubleaseEntry sublease={sampleSublease}/>
        <SubleaseEntry sublease={sampleSublease}/>
      </div>
    </div>
  )
}