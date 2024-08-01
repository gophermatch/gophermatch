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
          } else {
            console.log("Successfully reordered pictures");
          }
        });

        // Log the successful deletion.
        console.log(`Deleted picture ${pic_number} for user_id=${user_id}.`);

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
        console.log("error happened");
        console.error('Error in insertTopFive:', err);
        throw err;
    }
  }

export async function getTopFive(user_id){
    return new Promise((resolve, reject) => {
        console.log(user_id);
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
      const queryString = `SELECT * FROM u_pollquestions WHERE user_id = ?`;
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

// Update poll question for a user
export async function updatePollQuestion(user_id, question_text) {
  return new Promise((resolve, reject) => {
      const queryString = `UPDATE u_pollquestions SET question_text = ? WHERE user_id = ?`;
      db.query(queryString, [question_text, user_id], (err, result) => {
          if (err) {
              console.error("Error updating poll question:", err);
              reject(err);
              return;
          }
          resolve(result);
      });
  });
}

// Get poll options for a user
export async function getPollOptions(user_id) {
  return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM u_polloptions WHERE user_id = ?`;
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
export async function updatePollOption(user_id, option_id, option_text) {
  return new Promise((resolve, reject) => {
      const queryString = `UPDATE u_polloptions SET option_text = ? WHERE user_id = ? AND option_id = ?`;
      db.query(queryString, [option_text, user_id, option_id], (err, result) => {
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
      const queryString = `INSERT INTO u_polloptions (user_id, option_text) VALUES (?, ?)`;
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
export async function deletePollOption(user_id, option_id) {
  return new Promise((resolve, reject) => {
      const queryString = `DELETE FROM u_polloptions WHERE user_id = ? AND option_id = ?`;
      db.query(queryString, [user_id, option_id], (err, result) => {
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

    console.log(query);

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
