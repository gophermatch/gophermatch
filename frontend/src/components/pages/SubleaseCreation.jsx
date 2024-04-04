import { useState } from "react";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import { DateTime } from "luxon";

export default function SubleaseCreation()
{
  async function submit(){
    try {
      const res = await backend.put("/sublease/insert", {
        sublease_data: {
          user_id: currentUser.user_id,
          //todo: insert form data here
        }
      })

      console.log(res.data.message);

      currentUser.user_data = await currentUser.getAccount();

      //TODO: navigate back to sublease page when done

    } catch(err) {
      console.error(err)
    }
  }

  const [formData, setFormData] = useState({
    user_id: '',
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to backend or perform any other action
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto">
      <br></br>
      <h2 className="text-xl font-semibold mb-4">Sublease Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex">
          <div className="w-2/3 pr-2">
            <label htmlFor="building_name" className="block mb-1">Building Name</label>
            <input type="text" id="building_name" name="building_name" value={formData.building_name} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" placeholder="Enter building name" />
          </div>
          <div className="w-1/3 pl-2">
            <label htmlFor="building_type" className="block mb-1">Building Type</label>
            <select id="building_type" name="building_type" value={formData.building_type} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="building_address" className="block mb-1">Building Address (Optional)</label>
          <input type="text" id="building_address" name="building_address" value={formData.building_address}
                 onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full"
                 placeholder="Enter building address" />
        </div>

        <div className="mb-4 flex">
          <div className="w-1/3 pr-2">
            <label htmlFor="num_bedrooms" className="block mb-1">Bedrooms</label>
            <input type="number" id="num_bedrooms" name="num_bedrooms" value={formData.num_bedrooms}
                   onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full"
                   placeholder="Enter number of bedrooms" />
          </div>
          <div className="w-1/3 pl-2 pr-2">
            <label htmlFor="num_bathrooms" className="block mb-1">Bathrooms</label>
            <input type="number" id="num_bathrooms" name="num_bathrooms" value={formData.num_bathrooms}
                   onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full"
                   placeholder="Enter number of bathrooms" />
          </div>
          <div className="w-1/3 pl-2">
            <label htmlFor="num_roommates" className="block mb-1">Roommates</label>
            <input type="number" id="num_roommates" name="num_roommates" value={formData.num_roommates}
                   onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full"
                   placeholder="Enter number of roommates" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="rent_amount" className="block mb-1">Monthly Rent</label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <input type="number" id="rent_amount" name="rent_amount" value={formData.rent_amount}
                   onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full"
                   placeholder="Enter rent amount" />
          </div>
        </div>

        {/* Dropdowns for amenities */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="pets_allowed" className="block mb-1">Pets Allowed</label>
            <select id="pets_allowed" name="pets_allowed" value={formData.pets_allowed} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Any">Any</option>
              <option value="Limited">Limited</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_kitchen" className="block mb-1">Kitchen</label>
            <select id="has_kitchen" name="has_kitchen" value={formData.has_kitchen} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Full">Full</option>
              <option value="Partial">Partial</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_laundry" className="block mb-1">Laundry</label>
            <select id="has_laundry" name="has_laundry" value={formData.has_laundry} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Included">Included</option>
              <option value="Additional Cost">Additional Cost</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_pool" className="block mb-1">Pool</label>
            <select id="has_pool" name="has_pool" value={formData.has_pool} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_gym" className="block mb-1">Gym</label>
            <select id="has_gym" name="has_gym" value={formData.has_gym} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="is_furnished" className="block mb-1">Furnished</label>
            <select id="is_furnished" name="is_furnished" value={formData.is_furnished} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Fully">Fully</option>
              <option value="Partially">Partially</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="has_parking" className="block mb-1">Parking</label>
            <select id="has_parking" name="has_parking" value={formData.has_parking} onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="Included">Included</option>
              <option value="Additional Cost">Additional Cost</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        {/* Fill out the rest of the inputs similarly */}

        <button type="submit" className="bg-maroon_new text-white mt-4 px-4 w-full py-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
}