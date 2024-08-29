import React, { useEffect, useState, useRef } from "react";
import ApartmentTag from "./ApartmentTag.jsx";
import backend from "../../../backend.js";
import currentUser from "../../../currentUser.js";
import NumericTextbox from "./NumericTextbox.jsx";
import MonthDropdown from "./MonthDropdown.jsx";

export default function ApartmentInfo({ user_id, broadcaster }) {

  const livingRef = useRef(null);
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

  const resizeElements = () => {
    if (livingRef.current) {
        const parentHeight = livingRef.current.clientHeight;
        const scaleFactor = parentHeight * 0.13; // Adjust this multiplier for overall scaling
        livingRef.current.style.fontSize = `${scaleFactor}px`;

        // Example: Scaling padding and margins
        const padding = parentHeight * 0.01; // 2% of parent height
        const margin = parentHeight * 0.003; // 1.5% of parent height

        const elementsToScale = livingRef.current.querySelectorAll('.scalable');
        elementsToScale.forEach(el => {
            el.style.padding = `${padding}px`;
            el.style.margin = `${margin}px`;
        });
    }
};

  useEffect(() => {
      const observer = new ResizeObserver(resizeElements);
      if (livingRef.current) {
          observer.observe(livingRef.current);
      }

      resizeElements(); // Ensure the sizes are set correctly on mount

      return () => {
          observer.disconnect(); // Clean up the observer on unmount
      };
  }, []);

  return (
    <div className={"w-full h-[100%] rounded-lg border-solid border-2 border-maroon font-roboto_slab font-medium"} ref={livingRef}>
      <div className={"flex w-full h-full justify-center items-center flex-col"}>
        <div className="flex justify-center items-center">
          <span className="text-center mt-[2%]">Looking to live in&nbsp;</span>
          {broadcaster ? (
            <input
              type="text"
              value={genData.building}
              onChange={(e) => updateGenData('building', e.target.value)}
              placeholder="Enter building name"
              className="text-center border rounded-sm shadow-sm mt-[3%] focus:outline-none focus:ring-1 focus:ring-maroon h-[60%] w-[50%]"
            />
          ) : (
            <span className="text-center">{genData.building || "Any"}</span>
          )}
        </div>
        <div className={"flex w-full justify-center items-center flex-col"}>
          <div className={"flex w-full justify-center items-center flex-row gap-[3.6%]"}>
            <div className="flex flex-row">
              <span>{broadcaster ? 
                <div style={{ width: '400%', height: '60%' }}>
                <NumericTextbox 
                  value={genData.num_beds} 
                  min={1} 
                  max={6} 
                  onChange={value => updateGenData('num_beds', value)} 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              : 
                <b>{genData.num_beds}</b>} bed
              </span>
            </div>
            <span>{broadcaster ? 
             <div className="flex flex-row" style={{ width: '400%', height: '60%' }}>
              <NumericTextbox 
                value={genData.num_bathrooms} 
                min={1} 
                max={6} 
                onChange={value => updateGenData('num_bathrooms', value)} 
                className="scalable"
              />
              </div>
               : 
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
                  className="scalable"
                />
              </> : 
              <b>${genData.rent}</b>} budget
            </span>
          </div>
          <div className={"flex h-0 w-[95%] border-solid border-b-[1px] border-maroon scalable"}></div>
          <div className={"flex w-full justify-center gap-[3.6%] scalable"}>
            <span className={"whitespace-nowrap"}>
              {broadcaster ? 
                <NumericTextbox 
                  value={genData.num_residents} 
                  min={1} 
                  max={6} 
                  onChange={value => updateGenData('num_residents', value)} 
                  className="scalable"
                /> : 
                <b>{genData.num_residents}</b>}
              &nbsp;residents
            </span>
            <span>{broadcaster ? 
              <>
                <MonthDropdown 
                  initialValue={genData.move_in_month} 
                  onChange={value => updateGenData('move_in_month', value)} 
                  className="scalable"
                /> 
                to 
                <MonthDropdown 
                  initialValue={genData.move_out_month} 
                  onChange={value => updateGenData('move_out_month', value)} 
                  className="scalable"
                />
              </> : 
              <b>{genData.move_in_month} to {genData.move_out_month}</b>}
            </span>
          </div>
        </div>
        <div className={"flex w-[98%] h-[40%] p-2 max-h-[80%] flex-wrap gap-1 overflow-y-scroll custom-scrollbar scalable"}>
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
                className="scalable"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
