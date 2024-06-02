import React from 'react';

const BioBox = ({ editable, editedBio, handleBioChange }) => {
  return (
    <div className={"flex-grow rounded-2xl w-[40.5vw] ml-[-0.5vw] mt-[9vh] mb-[1.5vh] border-2 border-maroon_new overflow"}>
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
  );
};

export default BioBox;