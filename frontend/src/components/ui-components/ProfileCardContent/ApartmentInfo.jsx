import React, { useEffect, useState } from "react";
import ApartmentTag from "./ApartmentTag.jsx";
import backend from "../../../backend.js";
import currentUser from "../../../currentUser.js";
import './apartmentStyles.css';
import NumericTextbox from "./NumericTextbox.jsx";
import MonthDropdown from "./MonthDropdown.jsx";

export default function ApartmentInfo({ user_id, broadcaster }) {

  const [genData, setGenData] = useState({
    num_beds: 1,
    num_bathrooms: 1,
    num_residents: 1,
    rent: 0,
    move_in_month: 'January',
    move_out_month: 'December',
    building: ''
  });
  
  const [originalGenData, setOriginalGenData] = useState({}); // Store original data
  const [activeTags, setActiveTags] = useState([]);
  const [allTagIds, setAllTagIds] = useState([]);

  useEffect(() => {
    backend.get('/profile/get-gendata', {
      params: {
        user_id: user_id,
        filter: ['num_beds', 'num_bathrooms', 'num_residents', 'move_in_month', 'move_out_month', 'rent', 'building']
      }
    }).then(res => {
      setGenData(res.data[0]);
      setOriginalGenData(res.data[0]); // Store the original data
    }).catch(console.error);

    backend.get('profile/all-tag-ids')
      .then(tagReq => setAllTagIds(tagReq.data.tag_ids))
      .catch(console.error);

    backend.get('profile/user-selected-tags', { params: { user_id: currentUser.user_id } })
      .then(tagReq => setActiveTags(tagReq.data.tag_ids))
      .catch(console.error);
  }, [user_id]);

  useEffect(() => {
    if (broadcaster) {
      const cb = () => {
        const validatedGenData = validateGenData(genData);
        return backend.post('/profile/set-gendata', {
          user_id: currentUser.user_id,
          data: validatedGenData
        }).then(() => {
          return backend.post('/profile/update-user-tags', {
            user_id: currentUser.user_id,
            tag_ids: activeTags
          });
        });
      };

      broadcaster.connect(cb);
      return () => broadcaster.disconnect(cb);
    }
  }, [broadcaster, genData, activeTags]);

  useEffect(() => {
    console.log(broadcaster)
  })

  const validateGenData = (data) => {
    // If any field is empty, revert it to the original value
    const validatedData = { ...data };
    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] === '' || validatedData[key] === null || validatedData[key] === undefined) {
        validatedData[key] = originalGenData[key];
      }
    });
    return validatedData;
  };

  const updateGenData = (key, value) => {
    setGenData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  const onToggleTag = (id) => {
    setActiveTags(prev => (
      prev.includes(id) ? prev.filter(tagId => tagId !== id) : [...prev, id]
    ));
  };

  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon xl:text-lg lg: text-md md:text-sm sm:text-[0.25rem] font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full justify-center items-center flex-col"}>
        <div className={"flex mt-[0%] justify-center items-center"}>
          <span>Looking to live in&nbsp;</span>
          {broadcaster ? (
            <input
              type="text"
              value={genData.building}
              onChange={(e) => updateGenData('building', e.target.value)}
              placeholder="Enter building name"
              className="text-center w-[40%] mt-[2%] border rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          ) : (
            <span>{genData.building || "Any"}</span>
          )}
        </div>
        <div className={"flex grow-[1] w-full justify-center items-center flex-col font-[350]"}>
          <div className={"flex w-full justify-center gap-[1vw]"}>
            <span>{broadcaster ? 
              <NumericTextbox 
                value={genData.num_beds} 
                min={1} 
                max={6} 
                onChange={value => updateGenData('num_beds', value)}
              /> : 
              <b>{genData.num_beds}</b>} bed
            </span>
            <span>{broadcaster ? 
              <NumericTextbox 
                value={genData.num_bathrooms} 
                min={1} 
                max={6} 
                onChange={value => updateGenData('num_bathrooms', value)} 
              /> : 
              <b>{genData.num_bathrooms}</b>} bath
            </span>
            <span>{broadcaster ? 
              <>$
                <NumericTextbox 
                  wide={true} 
                  value={genData.rent} 
                  min={0} 
                  max={9999} 
                  onChange={value => updateGenData('rent', value)} 
                />
              </> : 
              <b>${genData.rent}</b>} budget
            </span>
          </div>
          <div className={"flex h-0 w-[95%] border-solid border-b-[1px] border-maroon"}></div>
          <div className={"flex w-full justify-center gap-[1vw]"}>
            <span className={"whitespace-nowrap"}>
              {broadcaster ? 
                <NumericTextbox 
                  value={genData.num_residents} 
                  min={1} 
                  max={6} 
                  onChange={value => updateGenData('num_residents', value)} 
                /> : 
                <b>{genData.num_residents}</b>}
              &nbsp;residents
            </span>
            <span>{broadcaster ? 
              <>
                <MonthDropdown 
                  initialValue={genData.move_in_month} 
                  onChange={value => updateGenData('move_in_month', value)} 
                /> 
                to 
                <MonthDropdown 
                  initialValue={genData.move_out_month} 
                  onChange={value => updateGenData('move_out_month', value)} 
                />
              </> : 
              <b>{genData.move_in_month} to {genData.move_out_month}</b>}
            </span>
          </div>
        </div>
        <div className={"flex w-[98%] p-2 max-h-[80%] grow-[0] flex-wrap gap-1 overflow-y-scroll custom-scrollbar"}>
          {allTagIds.map(tag => {
            const tagValue = activeTags.includes(tag.tag_id);
            return (
              <ApartmentTag 
                key={tag.tag_id} 
                value={tagValue} 
                id={tag.tag_id} 
                text={tag.tag_text} 
                editing={!!broadcaster} 
                toggleFunction={onToggleTag} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
