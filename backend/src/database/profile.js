import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString, buildDeleteString } from './dbutils.js'
import{generateBlobSasUrl} from '../blobService.js'
  
  export async function savePictureUrl(user_id, pictureUrl, pic_number) {
    return new Promise((resolve, reject) => {
        // Adjust the query to include pic_number in the INSERT statement
        // and ensure the ON DUPLICATE KEY UPDATE clause updates the picture_url for the existing pic_number for the user.
        const qr = `INSERT INTO u_pictures (user_id, picture_url, pic_number) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE picture_url = VALUES(picture_url);`;
        
        // Adjust the parameters to include pic_number
        db.query(qr, [user_id, pictureUrl, pic_number], (err, result) => {
            if (err) {
                console.error("Error saving picture URL to database:", err);
                reject(err);
                return ;
            }
            resolve(result);
        });
    });
}

// Function to get all picture URLs for a user

export async function retrievePictureUrls(user_id) {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT picture_url, pic_number FROM ${tableNames.u_pictures} WHERE user_id = ?`;

    db.query(queryString, [user_id], (err, rows) => {
      if (err) {
        console.error("Error fetching picture URLs from database:", err);
        reject(err);
        return;
      }

      // Map through each row to extract the blob name and generate a SAS URL
      const sasUrlPromises = rows.map(row => {
        // Extract the blob name from the picture_url
        const urlParts = row.picture_url.split('/');
        const blobName = urlParts[urlParts.length - 1]; // Gets the last part of the URL

        return generateBlobSasUrl(blobName); // Use the extracted blob name
      });

      Promise.all(sasUrlPromises)
        .then(sasUrls => resolve(sasUrls))
        .catch(error => reject(error));
    });
  });
}

  export async function removePicture(user_id, pic_number) {
      try {
        const { queryString, values } = buildDeleteString(tableNames.u_pictures, {
          user_id: user_id,
          pic_number: pic_number
        });

        // Execute the query to delete the specified decision.
        await db.query(queryString, values);

        await db.query('UPDATE u_pictures SET pic_number = pic_number - 1 WHERE user_id = ? AND pic_number > ?', [user_id, pic_number], (error, results) => {
          if (error) {
            console.error('Error reordering pictures:', error);
          }
        });

      } catch (error) {
        // Log and throw an error if the deletion fails.
        console.error('Error in removePicture:', error);
        throw new Error('Failed to remove picture');
      }
  }

  export async function insertTopFive(user_id, question, input1, input2, input3, input4, input5){
    try {
        // First, check if the record exists
        const query = `
            INSERT INTO ${tableNames.u_topfive} (user_id, question, input1, input2, input3, input4, input5)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            question = VALUES(question),
            input1 = VALUES(input1),
            input2 = VALUES(input2),
            input3 = VALUES(input3),
            input4 = VALUES(input4),
            input5 = VALUES(input5);
        `;
        await db.query(query, [user_id, question, input1, input2, input3, input4, input5]);
    } catch (err) {
        console.error('Error in insertTopFive:', err);
        throw err;
    }
  }

export async function getTopFive(user_id){
    return new Promise((resolve, reject) => {
        const query = `SELECT question, input1, input2, input3, input4, input5 FROM ${tableNames.u_topfive} WHERE user_id = ?`;

        db.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Error getting top five", err);
                reject(err);
                return;
            }

            if (results.length > 0) {
                resolve(results[0]); // resolve with the first row of the results
            } else {
                resolve(null); // resolve with null if no results
            }
        });
    });
}

// Get poll questions for a user
export async function getPollQuestions(user_id) {
  return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM ${tableNames.u_pollquestions} WHERE user_id = ?`;
      db.query(queryString, [user_id], (err, rows) => {
          if (err) {
              console.error("Error fetching poll questions:", err);
              reject(err);
              return;
          }
          resolve(rows);
      });
  });
}

export async function updatePollQuestion(user_id, question_text, option_text_1, option_text_2, option_text_3, option_text_4){
    try {
        const query = `
            INSERT INTO ${tableNames.u_pollquestions} (user_id, question_text, option_text_1, option_text_2, option_text_3, option_text_4)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            question_text = VALUES(question_text),
            option_text_1 = VALUES(option_text_1),
            option_text_2 = VALUES(option_text_2),
            option_text_3 = VALUES(option_text_3),
            option_text_4 = VALUES(option_text_4);
        `;
        await db.query(query, [user_id, question_text, option_text_1, option_text_2, option_text_3, option_text_4]);
    } catch (err) {
        console.error('Error in updatePollQuestion:', err);
        throw err;
    }
  }

  // wipes poll votes
  export async function wipePollVotes(user_id){
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE u_pollquestions
            SET option_votes_1 = 0,
                option_votes_2 = 0,
                option_votes_3 = 0,
                option_votes_4 = 0
            WHERE user_id = ?;        
        `;
        db.query(query, [user_id], (err, result) => {
            if (err) {
                console.error("Error updating poll option:", err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
  }

  export async function updatePollVotes(user_id, optionNumber) {
    try {
        // Dynamically determine the field to update based on the optionNumber
        const optionField = `option_votes_${optionNumber}`;
        
        const query = `
            INSERT INTO ${tableNames.u_pollquestions} (user_id, ${optionField})
            VALUES (?, 1)
            ON DUPLICATE KEY UPDATE
            ${optionField} = ${optionField} + 1;
        `;
        
        await db.query(query, [user_id]);
    } catch (err) {
        console.error('Error in updatePollVotes:', err);
        throw err;
    }
}

  
// Get poll options for a user
export async function getPollOptions(user_id) {
  return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM ${tableNames.u_polloptions} WHERE user_id = ?`;
      db.query(queryString, [user_id], (err, rows) => {
          if (err) {
              console.error("Error fetching poll options:", err);
              reject(err);
              return;
          }
          resolve(rows);
      });
  });
}

// Update poll option for a user
export async function updatePollOption(user_id, new_option_text, old_option_text) {
  return new Promise((resolve, reject) => {
      const queryString = `UPDATE ${tableNames.u_polloptions} SET option_text = ? WHERE user_id = ? AND option_text = ?`;
      db.query(queryString, [new_option_text, user_id, old_option_text], (err, result) => {
          if (err) {
              console.error("Error updating poll option:", err);
              reject(err);
              return;
          }
          resolve(result);
      });
  });
}

// Create a new poll option for a user
export async function createPollOption(user_id, option_text) {
  return new Promise((resolve, reject) => {
      const queryString = `INSERT INTO ${tableNames.u_polloptions} (user_id, option_text) VALUES (?, ?)`;
      db.query(queryString, [user_id, option_text], (err, result) => {
          if (err) {
              console.error("Error creating poll option:", err);
              reject(err);
              return;
          }
          resolve(result);
      });
  });
}

// Delete a poll option for a user
export async function deletePollOption(user_id, option_text) {
  return new Promise((resolve, reject) => {
      const queryString = `DELETE FROM ${tableNames.u_polloptions} WHERE user_id = ? AND option_text = ?`;
      db.query(queryString, [user_id, option_text], (err, result) => {
          if (err) {
              console.error("Error deleting poll option:", err);
              reject(err);
              return;
          }
          resolve(result);
      });
  });
}

// gets all fields from u_generaldata given a user_id
// filter can be specified to only fetch certain values, otherwise defaults to fetching all
export async function getGeneralData(user_id, filter) {

    const columns = Array.isArray(filter) ? filter.join(', ') : filter;

    const query = filter ? `SELECT ${columns} FROM ${tableNames.u_generaldata} WHERE user_id = ?`
     : `SELECT * FROM ${tableNames.u_generaldata} WHERE user_id = ?`;

    try {
      const results = await new Promise((resolve, reject) => {
          db.query(query, [user_id], (err, results) => {
              if (err) {
                  console.error(`Error getting general data for user_id ${user_id}:`, err);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });
      return results;
  } catch (err) {
      throw new Error(`Failed to get general data: ${err.message}`);
  }
}

// sets/updates a all fields in u_generaldata given a user_id and data.
export async function setGeneralData(user_id, data) {
  return new Promise((resolve, reject) => {
      // Check if user_id exists
      const checkQuery = `SELECT COUNT(*) AS count FROM ${tableNames.u_generaldata} WHERE user_id = ?`;
      
      db.query(checkQuery, [user_id], (err, results) => {
          if (err) {
              console.error(`Error checking user_id ${user_id}:`, err);
              reject(err);
              return;
          }
          
          const count = results[0].count;
          if (count === 0) {
              // Insert default values if user_id does not exist
              const insertQuery = `INSERT INTO ${tableNames.u_generaldata} (user_id) VALUES (?)`;
              
              db.query(insertQuery, [user_id], (err, results) => {
                  if (err) {
                      console.error(`Error inserting default values for user_id ${user_id}:`, err);
                      reject(err);
                      return;
                  }
                  
                  // Now update with provided data
                  performUpdate(user_id, data, resolve, reject);
              });
          } else {
              // If user_id exists, perform update
              performUpdate(user_id, data, resolve, reject);
          }
      });
  });
}

export async function resetProfile(user_id) {
    return new Promise((resolve, reject) => {
        const resetGeneralDataQuery = `
            INSERT INTO ${tableNames.u_generaldata} (
                user_id, wakeup_time, sleep_time, substances, alcohol,
                room_activity, num_residents, num_beds, num_bathrooms,
                move_in_month, move_out_month, bio
            )
            VALUES (
                ?, 80, 144, 'No', 'No', 'Friends', 1, 1, 1, 'January', 'January', ''
            )
            ON DUPLICATE KEY UPDATE
                wakeup_time = VALUES(wakeup_time),
                sleep_time = VALUES(sleep_time),
                substances = VALUES(substances),
                alcohol = VALUES(alcohol),
                room_activity = VALUES(room_activity),
                num_residents = VALUES(num_residents),
                num_beds = VALUES(num_beds),
                num_bathrooms = VALUES(num_bathrooms),
                move_in_month = VALUES(move_in_month),
                move_out_month = VALUES(move_out_month),
                bio = VALUES(bio);
        `;

        const resetPollQuestionsQuery = `
            INSERT INTO ${tableNames.u_pollquestions} (
                user_id, question_text,
                option_text_1, option_text_2, option_text_3, option_text_4,
                option_votes_1, option_votes_2, option_votes_3, option_votes_4
            )
            VALUES (
                ?, 'Poll question',
                'Option A', 'Option B', 'Option C', 'Option D',
                0, 0, 0, 0
            )
            ON DUPLICATE KEY UPDATE
                question_text = VALUES(question_text),
                option_text_1 = VALUES(option_text_1),
                option_text_2 = VALUES(option_text_2),
                option_text_3 = VALUES(option_text_3),
                option_text_4 = VALUES(option_text_4),
                option_votes_1 = VALUES(option_votes_1),
                option_votes_2 = VALUES(option_votes_2),
                option_votes_3 = VALUES(option_votes_3),
                option_votes_4 = VALUES(option_votes_4);
        `;

        const resetTopFiveQuery = `
            INSERT INTO ${tableNames.u_topfive} (
                user_id, question, input1, input2, input3, input4, input5
            )
            VALUES (
                ?, 'Top 5 Dorms?', 'Pioneer', '17th', 'Frontier', 'Comstock', 'Middlebrook'
            )
            ON DUPLICATE KEY UPDATE
                question = VALUES(question),
                input1 = VALUES(input1),
                input2 = VALUES(input2),
                input3 = VALUES(input3),
                input4 = VALUES(input4),
                input5 = VALUES(input5);
        `;

        const values = [user_id];

        // Run all three queries sequentially
        db.query(resetGeneralDataQuery, values, (err, results) => {
            if (err) {
                console.error(`Error resetting general data for user_id ${user_id}:`, err);
                return reject(err);
            }

            db.query(resetPollQuestionsQuery, values, (err, results) => {
                if (err) {
                    console.error(`Error resetting poll questions for user_id ${user_id}:`, err);
                    return reject(err);
                }

                db.query(resetTopFiveQuery, values, (err, results) => {
                    if (err) {
                        console.error(`Error resetting top five data for user_id ${user_id}:`, err);
                        return reject(err);
                    }

                    resolve(results);
                });
            });
        });
    });
}



// helper function for set general data
function performUpdate(user_id, data, resolve, reject) {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
  const values = Object.values(data);
  
  const updateQuery = `UPDATE ${tableNames.u_generaldata} SET ${fields} WHERE user_id = ?`;
  
  db.query(updateQuery, [...values, user_id], (err, results) => {
      if (err) {
          console.error(`Error updating general data for user_id ${user_id}:`, err);
          reject(err);
          return;
      }
      resolve(results);
  });
}

// updates the database for a user_ids selected tags
export async function updateUserTags(user_id, selected_tag_ids) {
  return new Promise((resolve, reject) => {
      // Remove existing tags for the user
      const deleteQuery = `DELETE FROM ${tableNames.u_tags} WHERE user_id = ?`;
      
      db.query(deleteQuery, [user_id], (deleteErr) => {
          if (deleteErr) {
              console.error("Error deleting user tags", deleteErr);
              reject(deleteErr);
              return;
          }

          // Add new selected tags
          if (selected_tag_ids.length > 0) {
              const values = selected_tag_ids.map(tag_id => [user_id, tag_id, true]);
              const insertQuery = `INSERT INTO ${tableNames.u_tags} (user_id, tag_id, tag_value) VALUES ?`;
              
              db.query(insertQuery, [values], (insertErr) => {
                  if (insertErr) {
                      console.error("Error inserting user tags", insertErr);
                      reject(insertErr);
                      return;
                  }
                  resolve();
              });
          } else {
              resolve();
          }
      });
  });
}

// gets all the users selected tags
export async function getUserSelectedTags(user_id) {
  return new Promise((resolve, reject) => {
      const query = `SELECT tag_id FROM ${tableNames.u_tags} WHERE user_id = ? AND tag_value = TRUE`;

      db.query(query, [user_id], (err, results) => {
          if (err) {
              console.error("Error getting user selected tags", err);
              reject(err);
              return;
          }

          const tagIds = results.map(row => row.tag_id);
          resolve(tagIds);
      });
  });
}

// gets tag_ids with associated tag_text (so no hard coded tags)
export async function getAllTags() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT tag_id, tag_text FROM tags';

      db.query(query, (err, results) => {
          if (err) {
              console.error("Error getting all tags", err);
              reject(err);
              return;
          }

          resolve(results);
      });
  });
}

// setting apartment/dorm preference
export async function toggleDormAndApartment(user_id){
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE ${tableNames.u_generaldata}
            SET 
                show_dorm = NOT show_dorm,
                show_apartment = NOT show_apartment
            WHERE user_id = ?
        `;
        db.query(query, [user_id], (err, results) => {
            if (err){
                console.error("Trouble toggling dorm and apartment", err);
                reject(err);
                return;
            }
            
            resolve(results);
        });
    });
}

// getting apartment/dorm preference
export async function getHousingPreference(user_id) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT show_dorm FROM ${tableNames.u_generaldata} WHERE user_id = ?`;
        db.query(queryString, [user_id], (err, results) => {
            if (err) {
                console.error("Error fetching housing preference:", err);
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
  }

export async function getState(user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if user_id exists in u_generaldata or u_pictures
            const accountCheckQuery = `
                SELECT 
                    (SELECT COUNT(*) FROM ${tableNames.u_generaldata} WHERE user_id = ?) AS hasGeneralData,
                    (SELECT COUNT(*) FROM ${tableNames.u_pictures} WHERE user_id = ?) AS hasPictures;
            `;
            const [accountCheckResult] = await new Promise((resolve, reject) => {
                db.query(accountCheckQuery, [user_id, user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            const hasGeneralData = accountCheckResult.hasGeneralData > 0;
            const hasPicturesTableEntry = accountCheckResult.hasPictures > 0;

            // If the user doesn't exist in both tables, return "incomplete_account"
            if (!hasGeneralData && !hasPicturesTableEntry) {
                return resolve({ profile_completion: "incomplete_account" });
            }

            // Check if bio exists and is not empty
            const bioQuery = `SELECT bio FROM ${tableNames.u_generaldata} WHERE user_id = ?`;
            const [bioResult] = await new Promise((resolve, reject) => {
                db.query(bioQuery, [user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            const hasBio = bioResult && bioResult.bio && bioResult.bio.trim() !== "";

            // Check if the user has at least one picture
            const pictureQuery = `SELECT COUNT(*) AS pictureCount FROM ${tableNames.u_pictures} WHERE user_id = ?`;
            const [pictureResult] = await new Promise((resolve, reject) => {
                db.query(pictureQuery, [user_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            const hasPicture = pictureResult.pictureCount > 0;

            // Determine the state based on the checks
            let state = "incomplete_profile"; // Default state if either bio or pictures are missing
            if (hasBio && hasPicture) {
                state = "complete";
            }

            // Return the determined state
            resolve({ profile_completion: state });
        } catch (error) {
            console.error('Error getting status:', error);
            reject(new Error('Failed to get status'));
        }
    });
}

