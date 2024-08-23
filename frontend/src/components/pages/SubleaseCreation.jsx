import { useEffect, useState } from "react";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import { DateTime } from "luxon";
import { useNavigate } from 'react-router-dom';

export default function SubleaseCreation()
{
  const navigate = useNavigate();

  async function submit() {
    if (editingMode) {
      try {
        const res = await backend.put("/sublease/update", {
          sublease_data: {
            user_id: currentUser.user_id,//currentUser.user_id,
            ...formData, // Now includes the form data in the request
          }
        });

        navigate("/sublease");

      } catch (err) {
        console.error(err);
      }
    } else {
    try {
      const res = await backend.put("/sublease/insert", {
        sublease_data: {
          user_id: currentUser.user_id,//currentUser.user_id,
          ...formData, // Now includes the form data in the request
        }
      });

      navigate("/sublease");

    } catch (err) {
      console.error(err);
    }
  }
  }  

  const [formData, setFormData] = useState({
    building_name: '',
    building_address: '',
    num_bathrooms: '',
    num_bedrooms: '',
    num_roommates: '',
    rent_amount: '',
    housing_type: 'House',
    pets_allowed: 'Any',
    has_kitchen: 'Full',
    has_laundry: 'None',
    has_parking: 'None',
    has_pool: false,
    is_furnished: 'Fully',
    has_gym: false,
    sublease_start_date: '',
    sublease_end_date: '',
    premium: false,
  });

  let [userSublease, setUserSublease] = useState(null);

  let [editingMode, setEditingMode] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    let convertedValue = value;

    // Convert "Yes" to true and "No" to false
    if (value === "Yes" || value === "No") {
      convertedValue = (value === "Yes");
    }

    setFormData({
      ...formData,
      [name]: convertedValue
    });
  };

  const handleSubmit = async (e) => {
    console.log("submitting")
    e.preventDefault(); // Prevent the default form submission behavior
    await submit(); // Call the submit function that sends data to the backend
  };

  const validateData = () => {
    const startDate = DateTime.fromFormat(formData.sublease_start_date, "yyyy-MM-dd");
    const endDate = DateTime.fromFormat(formData.sublease_end_date, "yyyy-MM-dd");

    const validDate = startDate < endDate && startDate >= DateTime.now();

    return validDate && formData.num_roommates >= 0 && formData.num_roommates !== "" && formData.num_bedrooms >= 0 && formData.num_bedrooms !== "" && formData.num_bathrooms >= 0 && formData.num_bathrooms !== "" && formData.building_name != "";
  }

  useEffect(() => {
    fetchUserSublease();
  }, []);

  const fetchUserSublease = async () => {

    try {
      let singleRes = null;
      if (userSublease === null) {
        singleRes = await backend.get("/sublease/get", {
          params: { user_id: currentUser.user_id }
        });
      }

      if(singleRes != null) {
        setEditingMode(true);

        const formData = { ...singleRes.data };
        delete formData.user_id;

        formData.sublease_start_date = DateTime.fromISO(formData.sublease_start_date).toFormat("yyyy-MM-dd");
        formData.sublease_end_date = DateTime.fromISO(formData.sublease_end_date).toFormat("yyyy-MM-dd");

        setFormData(formData);
      }
    } catch (err) {
      console.log(err);
      setUserSublease(null);
    }
  }
  

  return (
    <div className="max-w-lg mx-auto font-roboto_condensed text-black">
      <br></br>
      <h2 className="text-xl font-extrabold font-roboto_slab text-maroon_dark mb-4">Sublease Form</h2>
      <form className="overflow-y-scroll max-h-[90vh]" onSubmit={handleSubmit} style={{
        WebkitOverflowScrolling: 'touch',
        '&::WebkitScrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        '&::WebkitScrollbar': {
          width: '0'
        }
      }}>
        <div className="mb-4 flex">
          <div className="w-2/3 pr-2">
            <label htmlFor="building_name" className="block mb-1 text-maroon">Building Name</label>
            <input type="text" id="building_name" name="building_name" value={formData.building_name} onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full" placeholder="Enter building name" />
          </div>
          <div className="w-1/3 pl-2">
            <label htmlFor="housing_type" className="block mb-1 text-maroon">Building Type</label>
            <select id="housing_type" name="housing_type" value={formData.housing_type} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="building_address" className="block mb-1 text-maroon">Building Address (Optional)</label>
          <input type="text" id="building_address" name="building_address" value={formData.building_address}
                 onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full"
                 placeholder="Street Address, City, State, Zip Code" />
        </div>

        <div className="mb-4 flex">
          <div className="w-1/3 pr-2">
            <label htmlFor="num_bedrooms" className="block mb-1 text-maroon">Bedrooms</label>
            <input type="number" id="num_bedrooms" name="num_bedrooms" value={formData.num_bedrooms}
                   onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full"
                   placeholder="Enter number of bedrooms" min={0}/>
          </div>
          <div className="w-1/3 pl-2 pr-2">
            <label htmlFor="num_bathrooms" className="block mb-1 text-maroon">Bathrooms</label>
            <input type="number" id="num_bathrooms" name="num_bathrooms" value={formData.num_bathrooms}
                   onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full"
                   placeholder="Enter number of bathrooms" min={0}/>
          </div>
          <div className="w-1/3 pl-2">
            <label htmlFor="num_roommates" className="block mb-1 text-maroon">Roommates</label>
            <input type="number" id="num_roommates" name="num_roommates" value={formData.num_roommates}
                   onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full"
                   placeholder="Enter number of roommates" min={0}/>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="rent_amount" className="block mb-1 text-maroon">Monthly Rent</label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <input type="number" id="rent_amount" name="rent_amount" value={formData.rent_amount}
                   onChange={handleChange} className="border border-maroon_dark rounded px-3 py-2 w-full"
                   placeholder="Enter rent amount" min={0} max={10000}/>
          </div>
        </div>

        {/* Dropdowns for amenities */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="pets_allowed" className="block mb-1 text-maroon">Pets Allowed</label>
            <select id="pets_allowed" name="pets_allowed" value={formData.pets_allowed} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Any">Any</option>
              <option value="Limited">Limited</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_kitchen" className="block mb-1 text-maroon">Kitchen</label>
            <select id="has_kitchen" name="has_kitchen" value={formData.has_kitchen} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Full">Full</option>
              <option value="Partial">Partial</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_laundry" className="block mb-1 text-maroon">Laundry</label>
            <select id="has_laundry" name="has_laundry" value={formData.has_laundry} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Included">Included</option>
              <option value="Additional Cost">Additional Cost</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_pool" className="block mb-1 text-maroon">Pool</label>
            <select id="has_pool" name="has_pool" value={(formData.has_pool === true ? "Yes" : "No")} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_gym" className="block mb-1 text-maroon">Gym</label>
            <select id="has_gym" name="has_gym" value={(formData.has_gym === true ? "Yes" : "No")} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="is_furnished" className="block mb-1 text-maroon">Furnished</label>
            <select id="is_furnished" name="is_furnished" value={formData.is_furnished} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Fully">Fully</option>
              <option value="Partially">Partially</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_parking" className="block mb-1 text-maroon">Parking</label>
            <select id="has_parking" name="has_parking" value={formData.has_parking} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Included">Included</option>
              <option value="Additional Cost">Additional Cost</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="premium" className="block mb-1 text-maroon">Premium Sublease</label>
            <select id="premium" name="premium" value={(formData.premium === true ? "Yes" : "No")} onChange={handleChange}
                    className="border border-maroon_dark rounded px-3 py-2 w-full">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="sublease_start_date" className="block mb-1 text-maroon">Sublease Start Date</label>
          <input
            type="date"
            id="sublease_start_date"
            name="sublease_start_date"
            value={formData.sublease_start_date}
            onChange={handleChange}
            className="border border-maroon_dark rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sublease_end_date" className="block mb-1 text-maroon">Sublease End Date</label>
          <input
            type="date"
            id="sublease_end_date"
            name="sublease_end_date"
            value={formData.sublease_end_date}
            onChange={handleChange}
            className="border border-maroon_dark rounded px-3 py-2 w-full"
          />
        </div>

        <div><button type="submit" className={`text-white mt-4 px-4 w-full py-2 rounded ${validateData() ? 'bg-maroon_new opacity-100' : 'bg-maroon_new pointer-events-none opacity-40'}`}>Submit</button></div>


      </form>
    </div>
  );
}