import React from 'react';
import styles from '../../assets/css/profile.module.css';

const BioBox = ({ user_data, editable, editedBio, handleBioChange }) => {
  return (
    <div className={"flex-grow flex flex-col bg-white"}>
        <div className={"flex-grow rounded-2xl w-[40.5vw] ml-[-0.5vw] mt-[9vh] mb-[1.5vh] border-2 border-maroon_new overflow"}>
            <div className={"h-[3vh]"}>
                <p className={"text-[1.22vw] ml-[-0.625vw] mt-[3vh] inline-block flex flex-col"}>
                <span className="font-bold text-[1.7vw]">{user_data?.first_name} {user_data?.last_name}</span>
                <span>{user_data?.major} Major</span>
                </p>
            </div>
            <p className={"w-full h-full"}>
                {editable ? (
                <textarea
                    className={`${styles.bioTextArea} ${editable ? 'w-full h-full' : ''}`}
                    value={editedBio || ''}
                    onChange={handleBioChange}
                    placeholder="Edit Bio"
                />
                ) : (
                <p className={`${styles.bioTextArea}`}>{editedBio}</p>
                )}
            </p>
        </div>
    </div>
  );
};

export default BioBox;