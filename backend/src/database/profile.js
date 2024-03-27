import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'
import{generateBlobSasUrl} from '../blobService.js'


// Returns profile object (with profile_name and bio)
export async function getProfile(user_id) {
  return new Promise((resolve, reject) => {
      const profilePromise = new Promise((resolveProfile) => {
          const qr = buildSelectString("*", tableNames.u_bios, { user_id });

          db.query(qr.queryString, qr.values, (err, rows) => {
              if (err) {
                  resolveProfile({ bio: '', otherProfileFields: null }); // Default empty profile
                  return;
              }

              const profile = queryRowsToArray(rows);
              if (profile.length === 1) {
                  resolveProfile(profile[0]);
              } else {
                  // No profile found or multiple profiles found, return a default empty profile
                  resolveProfile({ bio: '', otherProfileFields: null });
              }
          });
      });

      const qnaPromise = new Promise((resolveQnA) => {
          const qnaQr = buildSelectString("*", tableNames.u_qna, { user_id });

          db.query(qnaQr.queryString, qnaQr.values, (err, rows) => {
              if (err) {
                  resolveQnA([]);
                  return;
              }

              const qnaAnswers = rows.map(row => ({ question_id: row.question_id, option_id: row.option_id }));
              resolveQnA(qnaAnswers);
          });
      });

      Promise.all([profilePromise, qnaPromise])
          .then(([profile, qnaAnswers]) => {
              resolve({ ...profile, qnaAnswers });
          })
          .catch(error => reject(error));
  });
}





// Creates and stores a profile in DB
// second argument (profile obj) is optional
export async function createProfile(user_id, profile) {
    if (!profile) profile = {}
    return new Promise((resolve, reject) => {
        const qr = buildInsertString(tableNames.u_profiles, {user_id, ...profile})
        // "INSERT INTO u_profiles (user_id, profile_name, bio) VALUES (?, ?, ?)"

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Profile already exists")
                else reject(err)
                return
            }
            if (res.affectedRows != 1) {
                reject({})
            } else {
                resolve({user_id: res.insertId, ...profile})
            }
        })
    })
}

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
            qnaUpdateQuery = buildUpdateString(tableNames.u_qna, { user_id, question_id }, { option_id });
          } else {
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

  export async function getAllUserIds() {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("user_id", tableNames.users, {});
  
        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
  
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
  }
  
  export async function savePictureUrl(user_id, pictureUrl, pic_number) {
    return new Promise((resolve, reject) => {
        const qr = `INSERT INTO u_pictures (user_id, picture_url, pic_number) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE picture_url = VALUES(picture_url);`;
        
        db.query(qr, [user_id, pictureUrl, pic_number], (err, result) => {
            if (err) {
                console.error("Error saving picture URL to database:", err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

export async function retrievePictureUrls(user_id) {
  return new Promise((resolve, reject) => {
      const queryString = `SELECT picture_url, pic_number FROM ${tableNames.u_pictures} WHERE user_id = ?`;

      db.query(queryString, [user_id], (err, rows) => {
          if (err) {
              console.error("Error fetching picture URLs from database:", err);
              reject(err);
              return;
          }

          const sasUrlPromises = rows.map(row => {
              const urlParts = row.picture_url.split('/');
              const blobName = urlParts[urlParts.length - 1];

              return generateBlobSasUrl(blobName);
          });

          Promise.all(sasUrlPromises)
              .then(sasUrls => resolve(sasUrls))
              .catch(error => reject(error));
      });
  });
}
