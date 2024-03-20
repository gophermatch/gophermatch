import React, { useState } from 'react';
import currentUser from '../../currentUser';
import backend from '../../backend';

export default function Filter() {
    const [shouldShowIcon, setShowIcon] = useState(true);
    const [shouldShowUI, setShowUI] = useState(false);

    function expandFilterUI() {
        setShowIcon(!shouldShowIcon);
        setShowUI(!shouldShowUI);
    }

    // Function to handle applying filters
    const handleApplyFilters = async () => {
        // Collect the selected options
        const filters = {
          gender: document.getElementById('gender').value,
          college: document.getElementById('College').value,
          // Note: Building filter is collected
        };
        try {
          const response = await backend.post('/match/filter-results', filters, {
            withCredentials: true, // If you need to send cookies with the request for session management
          });
      
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log('Filters applied, user IDs:', response.data); // Assuming the backend returns an array of user_ids
          } else {
            console.log('No matching users found.');
          }
        } catch (error) {
          console.error('Error applying filters:', error);
        }
      };
      

    return (
        <>
            {shouldShowIcon && <div className="flex absolute right-0">
                <img className="object-scale-down h-[12vh] w-[18vh]" src="../assets/images/filter.png" onClick={expandFilterUI}></img>
            </div>}

            {shouldShowUI && <div className="flex-column bg-[#D9D9D9] mt-[2vh] w-[50vw] h-[15vh] m-auto rounded-3xl items-center text-xs font-bold">
                <p className="ml-[2vw] mb-[1vh] text-lg">Filter by..</p>
                <div className="flex space-x-[1.25vw] ml-[1.5vw] text-[#E3E3E3] border-5 items-start drop-shadow-md">
                <select name="gender" id="gender" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                </select>
                <select name="building" id="building" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">Building</option>
                    <option value="Pioneer">Pioneer Hall</option>
                    <option value="Frontier">Frontier Hall</option>
                    <option value="Territorial">Territorial Hall</option>
                    <option value="Centennial">Centennial Hall</option>
                    <option value="Comstock">Comstock Hall</option>
                    <option value="Sanford">Sanford Hall</option>
                    <option value="Middlebrook">Middlebrook Hall</option>
                    <option value="Bailey">Bailey Hall</option>
                    <option value="17th">17th Avenue Residence Hall</option>
                </select>
                <select name="College" id="College" class = "bg-[#B7B7B7] w-[10vw] h-[5vh] rounded-2xl px-[1.5vh] py-[1vh]">
                    <option value="">College</option>
                    <option value="CLA">College of Liberal Arts</option>
                    <option value="CSE">College of Science and Engineering</option>
                    <option value="CSOM">Carlson School of Management</option>
                    <option value="CBS">College of Biological Sciences</option>
                    <option value="CDES">College of Design</option>
                    <option value="CEHD">College of Education And Human Development</option>
                    <option value="CFANS">College of Food, Agricultural, and Natural Resource Sciences</option>
                    <option value="SN">School of Nursing</option>
                </select>
                    <button className="bg-[#A4BDA2] w-[2.5vw] h-[5vh] rounded-3xl object-scale-down px-[0.66vh] py-[0.66vh]" onClick={handleApplyFilters}>
                        <img src="../assets/images/filtercheck.png" alt="Apply Filters" />
                    </button>
                </div>
            </div>}
        </>
    );

}
