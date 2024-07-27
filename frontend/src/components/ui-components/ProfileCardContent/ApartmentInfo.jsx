import React, { useEffect, useState } from "react";
import ApartmentTag from "./ApartmentTag.jsx";
import backend from "../../../backend.js";
import currentUser from "../../../currentUser.js";
import './apartmentStyles.css';
import NumericTextbox from "./NumericTextbox.jsx";

export default function ApartmentInfo(aptData, editing) {

  useEffect(() => {
    fetchAllTags().then(fetchUserTags);

    fetchGenData();
  }, []);

  // Fetch a map of tag IDs to their text values from the database
  async function fetchAllTags ()
  {
    const tagReq = await backend.get('profile/all-tag-ids');

    setAllTagIds(tagReq.data.tag_ids);
  }

  // Fetch the user's active tag IDs from the database
  async function fetchUserTags ()
  {
    // Data returns with an array of chosen tag ids, ex: [2, 3, 6]
    const tagReq = await backend.get('profile/user-selected-tags', {params: {user_id: currentUser.user_id}});

    setActiveTags(tagReq.data.tag_ids);
  }

  // Fetch the user's active tag IDs from the database
  async function fetchGenData ()
  {
    // Data returns with an array of chosen tag ids, ex: [2, 3, 6]
    const genReq = await backend.get('profile/get-gendata', {params: {user_id: 56}});

    setGenData(genReq.data);
  }

  // TODO: Need to hook in the "Save profile" button with this. Needs to be done once it's added.
  // Should update tags on the backend
  async function onFinishEdit ()
  {
    await backend.post('profile/update-user-tags', {user_id: currentUser.user_id, tag_ids: activeTags});
  }

  // Initial data is purely for testing, immediately gets repopulated from the fetch function
  const [allTagIds, setAllTagIds] = useState([
    { tag_id: 1, tag_text: 'Gym' },
    { tag_id: 2, tag_text: 'Pet' },
    { tag_id: 3, tag_text: 'Public Transport' },
    { tag_id: 4, tag_text: 'Pool' },
    { tag_id: 5, tag_text: 'Balcony' },
  ]);

  // Initial data is purely for testing, immediately gets repopulated from the fetch function
  const [activeTags, setActiveTags] = useState([
    1, 2, 3, 4
  ]);

  const [genData, setGenData] = useState([]);

  // Called from within the ApartmentTag components to toggle the values
  const onToggleTag = (id) => {
    
    // Update active tags with the given ID toggled
    setActiveTags((prev) => {

      if (prev.includes(id)) {

        // Remove the ID if it is present
        return prev.filter(tagId => tagId !== id);

      } else {

        // Add the ID if it is not present
        return [...prev, id];

      }
    });

  }

  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-xl font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full justify-center items-center flex-col"}>
        {/*Top header panel with apt name*/}
        <div className={"flex grow-[1]"}>
          Looking to live in Fieldhouse
        </div>
        {/*Middle info panel with apt info*/}
        <div className={"flex grow-[1] w-full justify-center items-center flex-col font-[350]"}>
          <div className={"flex w-full justify-center gap-[1vw]"}>
            <span><b>3</b> bed</span>
            <span><b>3</b> bath</span>
            <span><b>$500</b> budget</span>
          </div>
          <div className={"flex h-0 w-[95%] border-solid border-b-[1px] border-maroon"}></div>
          <div className={"flex w-full justify-center gap-[1vw]"}>

          <span className={"whitespace-nowrap"}>{editing ? <>
          <NumericTextbox value={genData.num_roommates_min} min={1} max={6}/>
           &nbsp;to
          <NumericTextbox value={genData.num_roommates_max} min={1} max={6}/></>
          : <b>{genData.num_roommates_max}</b>}
          &nbsp;roommates</span>
            <span>September to May</span>
          </div>
        </div>

        {/*Bottom panel with tags*/}
        <div className={"flex w-[98%] p-2 max-h-[80%] grow-[0] flex-wrap gap-1 overflow-y-scroll custom-scrollbar"}>
          {allTagIds.map(tag => {
            const tagValue = activeTags.includes(tag.tag_id);
            return(
            <ApartmentTag value = {tagValue} id={tag.tag_id} text={tag.tag_text}
             editing={true} toggleFunction={onToggleTag} />)})}
        </div>
      </div>
    </div>
  );
}
