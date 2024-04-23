import React, { useState } from 'react';
import currentUser from '../../currentUser';
import backend from '../../backend';
import qnaOptions from './qnaOptions.json';

export default function Filter({user_id_setter}) {
    const [shouldShowIcon, setShowIcon] = useState(true);
    const [shouldShowUI, setShowUI] = useState(false);

    function expandFilterUI() {
        setShowIcon(!shouldShowIcon);
        setShowUI(!shouldShowUI);
    }

    const handleApplyFilters = async () => {
        // Collect the selected options for userdata filters
        const userdataFilters = {
            gender: document.getElementById('gender').value,
            college: document.getElementById('college').value,
            graduating_year: document.getElementById('graduating_year').value,
        };

        // Prepare the qnaFilters payload by finding the selected option_ids
        const qnaFilterSelections = {
            'Building?': document.getElementById('Building?').value,
            'Alcohol?': document.getElementById('Alcohol?').value,
            'Substances?': document.getElementById('Substances?').value,
            'Room Activity?': document.getElementById('Room Activity?').value,
        };

        const qnaFilters = Object.entries(qnaFilterSelections).reduce((acc, [questionText, selectedOptionText]) => {
            if (selectedOptionText) {
                const question = qnaOptions.find(q => q.question === questionText);
                if (question) {
                    const option = question.options.find(o => o.text === selectedOptionText);
                    if (option) acc.push(option.option_id);
                }
            }
            return acc;
        }, []);
        console.log(qnaFilters);

        try {
            // Adjust the backend call as necessary to handle the two payloads
            const response = await backend.post('/match/filter-results', { userdataFilters, qnaFilters }, {
                withCredentials: true, // If you need to send cookies with the request for session management
            });

            user_id_setter(response.data);

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log('Filters applied, user IDs:', response.data); // Assuming the backend returns an array of user_ids
            } else {
                console.log('No matching users found.');
            }
        } catch (error) {
            console.error('Error applying filters:', error);
        }

        expandFilterUI();
    };

    return(
        <>
            {shouldShowIcon && <div className="flex absolute right-[37.5vw]">
                <img className="object-scale-down h-[12vh] w-[18vh]" src="../assets/images/filterdropdown.png" onClick={expandFilterUI}></img>
            </div>}

        {shouldShowUI && <div class = "flex absolute bg-maroon w-[80vw] h-[12.5vh] left-[3%] rounded-b-3xl items-center justify-center">
            <div class = "flex space-x-[0.5vw] text-black text-[1vw] font-lora border-5 items-center">
                <select name="gender" id="gender" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                </select>
                <select name="college" id="college" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
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
                <select name="graduating_year" id="graduating_year" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Grad. Year</option>
                    <option value="2028">2028</option>
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                </select>
                <select name="building" id="Building?" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Building</option>
                    <option value="Comstock">Comstock</option>
                    <option value="Pioneer">Pioneer</option>
                    <option value="Frontier">Frontier</option>
                    <option value="Territorial">Territorial</option>
                    <option value="Centennial">Centennial</option>
                    <option value="17th">17th Avenue</option>
                    <option value="Sanford">Sanford</option>
                    <option value="Middlebrook">Middlebrook</option>
                    <option value="Bailey">Bailey</option>
                </select>
                <select name="alcohol" id="Alcohol?" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Alcohol Use</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <select name="substances" id="Substances?" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Substances</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <select name="openroom" id="Room Activity?" class = "bg-[#DED7D7] w-[10vw] h-[6vh] rounded-lg px-[1.5vh] py-[1vh] shadow-xl">
                    <option value="">Open Room</option>
                    <option value="Empty">No One</option>
                    <option value="Couple">A Couple Friends</option>
                    <option value="Party">Party</option>
                </select>
                <img class = "bg-[#FFCC33] w-[6vh] h-[6vh] rounded-full object-scale-down px-[0.8vh] py-[0.8vh]" src="../assets/images/filtercheck.png" onClick={handleApplyFilters}></img>
            </div>
        </div>}
        </>
    );

}
