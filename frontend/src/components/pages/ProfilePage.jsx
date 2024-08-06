import React, { useState, useMemo, useEffect } from 'react';
import { ProfileCard} from '../ui-components/ProfileCard';
import currentUser from '../../currentUser';
import backend from '../../backend';
import pencil from "../../assets/images/pencil.svg";
import close from "../../assets/images/red_x.svg";


class SaveBroadcaster {
  callbacks = [];

  async fire() {
    return Promise.all(this.callbacks.map(cb => cb()));
  }

  connect(callback) {
    this.callbacks.push(callback);
  }

  disconnect(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
}

export default function ProfilePage() {
  const broadcaster = useMemo(() => new SaveBroadcaster(), []);
  const [isSaving, setIsSaving] = useState(false); // waiting for backend response
  const [isEditing, setIsEditing] = useState(false); // editing profile data
  const [isDorm, setIsDorm] = useState(false); // dorm or apartment mode

  const [nextKey, setNextKey] = useState(0); // incrementing key will cause profile card to re-mount

  async function dormToggleBackend() {
    await backend.put('profile/toggle-dorm', {
      user_id: currentUser.user_id
    });
  };

  const getHousingPreference = async () => {
    try{
      const preference = await backend.get('profile/get-housingpref', {
        params: {
          user_id: currentUser.user_id
        }
      });

      if(preference.data){
        return preference.data.show_dorm;
      }
      return 0;
    }catch(error){
      console.error('Error fetching housing preference:', error);
    }
  };

  const dormToggle = () => {
    setIsDorm(!isDorm);
    dormToggleBackend();
  }

  function onSaveClick() {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    broadcaster.fire()
      .catch((e) => console.error("SAVE NOT SUCCESSFUL: ", e))
      .then(() => setNextKey(key => key + 1))
      .then(() => setIsSaving(false))
      .finally(() => setIsEditing(false)) //TODO: increment profile card key should cause elements to refresh
  }

  function discardChanges() {
    setIsEditing(false)
    setNextKey(key => key + 1)
  }

  //TODO: set the positioning here for the edit/save/cancel buttons once scaling is redone
  const save_or_cancel = (isEditing ?
    <div className="absolute flex align-middle justify-between top-[40px] right-[40px] h-[4vh]">
      <button onClick={onSaveClick} className={`rounded-lg px-[35px] font-roboto_slab text-white ${isSaving ? "bg-newwhite" : "bg-maroon"}`}>Save Changes</button>
      <button onClick={discardChanges} className="w-[20px] ml-[15px]">
        <img src={close} />
      </button>
    </div>
    :
    <button onClick={() => setIsEditing(true)} className="absolute top-[40px] right-[40px] w-[5vh] h-[5vh]">
      <img src={pencil} />
    </button>
  )

  useEffect(() => {
    const fetchPreference = async () => {
      const preference = await getHousingPreference();
      setIsDorm(Boolean(preference));
    };

    fetchPreference();
  }, []);

  return (
    <>
    <ProfileCard
      key={nextKey}
      user_id={currentUser.user_id}
      isDorm={isDorm}
      broadcaster={isEditing ? broadcaster : null}
      dormToggle={dormToggle}
      profileMode={true}
    />
    {save_or_cancel}
    </>
  )
}