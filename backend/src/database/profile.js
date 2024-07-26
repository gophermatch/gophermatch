import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString, buildDeleteString } from './dbutils.js'
import{generateBlobSasUrl} from '../blobService.js'


// Returns profile data of given user_id
export async function getProfile(user_id) {
  return new Promise((resolveProfile) => {
          const qr = `
SELECT 
    u_userdata.user_id,
    u_userdata.first_name,
    u_userdata.last_name,
    u_userdata.major,
    u_userdata.graduating_year,
    u_bios.bio,
    JSON_ARRAY(u_apartment.rent, u_apartment.move_in_date, u_apartment.move_out_date) AS apartment_data,
    GROUP_CONCAT(DISTINCT CONCAT(u_tags.tag_id, ':', u_tags.tag_value) ORDER BY u_tags.tag_id SEPARATOR ', ') AS tags,
    u_pollquestions.question_text AS poll_question,
    JSON_ARRAY(qna.qna_data) AS qna,
    JSON_ARRAY(u_generaldata.wakeup_time, u_generaldata.sleep_time) AS sleep_schedule,
    pictures.pictures AS pictures
FROM 
    u_userdata
LEFT JOIN 
    u_bios ON u_userdata.user_id = u_bios.user_id
LEFT JOIN 
    u_apartment ON u_userdata.user_id = u_apartment.user_id
LEFT JOIN 
    u_tags ON u_userdata.user_id = u_tags.user_id
LEFT JOIN 
    u_pollquestions ON u_userdata.user_id = u_pollquestions.user_id
LEFT JOIN 
    u_polloptions ON u_userdata.user_id = u_polloptions.user_id
LEFT JOIN 
    (
        SELECT 
            user_id,
            JSON_ARRAYAGG(JSON_OBJECT('question_id', question_id, 'option_id', option_id)) AS qna_data
        FROM 
            u_qna
        GROUP BY 
            user_id
    ) AS qna ON u_userdata.user_id = qna.user_id
LEFT JOIN 
    u_generaldata ON u_userdata.user_id = u_generaldata.user_id
LEFT JOIN 
    (
        SELECT
            user_id,
            JSON_ARRAYAGG(picture_url) AS pictures
        FROM
            (SELECT 
                user_id,
                picture_url
             FROM 
                u_pictures
             ORDER BY 
                user_id, pic_number) AS ordered_pictures
        GROUP BY 
            user_id
    ) AS pictures ON u_userdata.user_id = pictures.user_id
WHERE
    u_userdata.user_id = ${user_id}
GROUP BY 
    u_userdata.user_id,
    u_userdata.first_name,
    u_userdata.last_name,
    u_userdata.major,
    u_userdata.graduating_year,
    u_bios.bio,
    u_apartment.rent,
    u_apartment.move_in_date,
    u_apartment.move_out_date,
    u_generaldata.wakeup_time,
    u_generaldata.sleep_time,
    u_pollquestions.question_text;
`;

          db.query(qr, (err, rows) => {
              if (err) {
                  resolveProfile({}); // Don't return a bio if not found
                  return;
              }

              const profile = queryRowsToArray(rows);
              if (profile.length === 1) {
                  resolveProfile(profile[0]);
              } else {
                  // No profile found or multiple profiles found, return an empty profile
                  resolveProfile({});
              }
          });
      });
}

// Creates and stores a profile in DB
// second argument (profile obj) is optional
export async function createBio(user_id, profile) {
    if (!profile) profile = {}
    return new Promise((resolve, reject) => {
        const qr = buildInsertString(tableNames.u_bios, {user_id, ...profile})

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Profile already exists")
                else reject(err)
                return
            }
            if (res.affectedRows != 1) {
                reject({})
            } else {
                // res.insertId exists iff exactly one row is inserted
                resolve({user_id: res.insertId, ...profile})
            }
        })
    })
}

// updates the stored profile
// database/profile.js

// ... Other imports and functions

export async function updateProfile(user_id, profile) {
    return new Promise(async (resolve, reject) => {
      const { qnaAnswers, ...profileData } = profile;
  
      try {
         if (Object.keys(profileData).length > 0) {
        const updateQuery = buildUpdateString(tableNames.u_bios, { user_id }, profileData);
        console.log(updateQuery);
        await db.query(updateQuery.queryString, updateQuery.values);
      }
  
        for (const { question_id, option_id } of qnaAnswers) {
          // Fetch the existing answer
          const existingAnswerPromise = new Promise((resolveQuery, rejectQuery) => {
            const qr = buildSelectString("*", tableNames.u_qna, { user_id, question_id });
            db.query(qr.queryString, qr.values, (err, rows) => {
              if (err) {
                rejectQuery(err);
              } else {
                resolveQuery(rows);
              }
            });
          });
  
          let existingAnswer;
          try {
            existingAnswer = await existingAnswerPromise;
          } catch (error) {
            reject(error);
            return;
          }
  
          let qnaUpdateQuery;
          if (existingAnswer && existingAnswer.length > 0) {
            // Update existing answer
            qnaUpdateQuery = buildUpdateString(tableNames.u_qna, { user_id, question_id }, { option_id });
          } else {
            // Insert new answer
            qnaUpdateQuery = buildInsertString(tableNames.u_qna, { user_id, question_id, option_id });
          }
  
          await db.query(qnaUpdateQuery.queryString, qnaUpdateQuery.values);
        }
  
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  //meant to update all Apartment specific QNA
  export async function updateApartmentInfo(user_id, apartmentData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the entry exists using the provided buildSelectString function
        const existCheck = buildSelectString("*", "u_apartment", { user_id });
        db.query(existCheck.queryString, existCheck.values, async (err, existResult) => {
          if (err) {
            console.error("Error checking apartment existence:", err);
            reject(err);
            return;
          }
          
          console.log("Existence check result:", existResult);
          if (existResult && existResult.length > 0) {
            console.log("Updating existing apartment info");
            // Update existing apartment info using the provided buildUpdateString function
            const updateQuery = buildUpdateString("u_apartment", { user_id }, apartmentData);
            console.log("Update Query:", updateQuery.queryString); // For debugging
            await db.query(updateQuery.queryString, updateQuery.values);
          } else {
            console.log("Inserting new apartment info");
            // Insert new apartment info using the provided buildInsertString function
            const insertQuery = buildInsertString("u_apartment", { user_id, ...apartmentData });
            console.log("Insert Query:", insertQuery.queryString); // For debugging
            await db.query(insertQuery.queryString, insertQuery.values);
          }
          
          resolve();
        });
      } catch (error) {
        console.error("Database operation failed:", error); // Proper error logging
        reject(error);
      }
    });
  }
  

  export async function getAllUserIds() {
    return new Promise((resolve, reject) => {
        // Assuming 'user_id' is the column name in your 'users' table that holds the user IDs
        const qr = buildSelectString("user_id", tableNames.users, {});
  
        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
  
            // Extract user_id from each row and return an array of user_ids
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
  }
  
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
                console.log("bruh")
                resolve(results[0]); // resolve with the first row of the results
            } else {
                console.log("what")
                resolve(null); // resolve with null if no results
            }
        });
    });
}

// gets all fields from u_generaldata given a user_id
export async function getGeneralData(user_id) {
  const query = `SELECT * FROM ${tableNames.u_generaldata} WHERE user_id = ?`;
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

// sets/updates a all fields in u_generaldata given a user_id and data. Example I use in postman route:
/*
    {
    "user_id": 56,
    "data": {
        "wakeup_time": 90,
        "sleep_time": 150,
        "substances": "Yes",
        "room_activity": "Party"
        // add other fields as needed
    }
}
*/
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

