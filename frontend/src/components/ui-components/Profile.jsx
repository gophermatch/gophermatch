import React from 'react';
import Carousel from './Carousel';
import styles from '../../assets/css/profile.module.css';
import ProfileSplitter from '../../ProfileSplitter';
import kanye from '../../assets/images/kanye.png';
import other from '../../assets/images/testprofile.png';

export default function Profile(props) {
  const { data, editable, handleBioChange, handleQnaChange, qnaAnswers } = props;
  let pictures = [kanye, other, kanye];

  const splitter = new ProfileSplitter(data);

  // Function to find the selected option_id for a given question_id
  const getSelectedOptionId = (questionId) => {
    if (Array.isArray(qnaAnswers)) {
      const answer = qnaAnswers.find(ans => ans.question_id === questionId);
      return answer ? answer.option_id : null;
    }
    return null;
  };



  const qnaItems = [
    {
      id: 1,
      question: 'Drugs?',
      options: [{ option_id: 1, text: 'Yes' }, { option_id: 2, text: 'No' }],
    },
    {
      id: 2,
      question: 'Year?',
      options: [
        { option_id: 3, text: 'Freshman' },
        { option_id: 4, text: 'Sophomore' },
        { option_id: 5, text: 'Junior' },
        { option_id: 6, text: 'Senior' },
        // ... other options ...
      ],
    },
    {
      id: 3,
      question: 'Gender?',
      options: [
        { option_id: 7, text: 'Male' },
        { option_id: 8, text: 'Female' },
        { option_id: 9, text: 'Non-Binary' },
        // ... other options ...
      ],
    },
    {
      id: 4,
      question: 'College?',
      options: [
        { option_id: 10, text: 'Carlson' },
        { option_id: 11, text: 'CBS' },
        { option_id: 12, text: 'Design' },
        { option_id: 13, text: 'CEHD' },
        { option_id: 14, text: 'CFANS' },
        { option_id: 15, text: 'CLA' },
        { option_id: 16, text: 'CSE' },
        { option_id: 17, text: 'Nursing' },
        // ... other options ...
      ],
    },
    {
      id: 5,
      question: 'Building?',
      options: [
        { option_id: 18, text: '17th' },
        { option_id: 19, text: 'Bailey' },
        { option_id: 20, text: 'Centennial' },
        { option_id: 21, text: 'Comstock' },
        { option_id: 22, text: 'Frontier' },
        { option_id: 23, text: 'Middlebrook' },
        { option_id: 24, text: 'Pioneer' },
        { option_id: 25, text: 'Sanford' },
        { option_id: 26, text: 'Territorial' },
        { option_id: 27, text: 'Yudof' },
        { option_id: 28, text: 'Any' },
        // ... other options ...
      ],
    },
  ].map((item) => (
    <div key={item.id} className={styles.qnaItem}>
      <p className={styles.profileItem}>{item.question}</p>
      {editable ? (
        <select
          className={styles.profileAnswer}
          value={getSelectedOptionId(item.id) || ''}
          onChange={(event) => handleQnaChange(event, item.id)}
        >
          {item.options.map((option) => (
            <option key={option.option_id} value={option.option_id}>
              {option.text}
            </option>
          ))}
        </select>
      ) : (
        <p className={styles.profileAnswer}>
          {item.options.find(o => o.option_id === getSelectedOptionId(item.id))?.text || 'N/A'}
        </p>
      )}
    </div>
  ));


  return (
    <div className={styles.profile}>
      <div className={styles.upperSide}>
      <div className={styles.leftSide}>
        <div className={styles.imageWrapper}>
          <Carousel pictures={pictures} />
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.bioContainer}>
          <p className={styles.name}>{splitter.general.name}</p>
          {editable ? (
            <textarea
              className={styles.bioTextArea}
              value={props.editedBio || ''}
              onChange={handleBioChange}
            />
          ) : (
            <p className={styles.bioText}>{props.editedBio}</p>
          )}

        </div>
      </div>
      </div>
      <div className={styles.bottomSide}>
        <div className={styles.profileOptions}>
          {qnaItems}
        </div>
      </div>
    </div>
  );
}
