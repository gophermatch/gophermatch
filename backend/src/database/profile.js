import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'

// Returns profile object (with profile_name and bio)
export async function getProfile(user_id) {

    console.log("getProfile");

    return new Promise((resolve, reject) => {
        // Fetching the user's profile
        const profilePromise = new Promise((resolveProfile, rejectProfile) => {
            const qr = buildSelectString("*", tableNames.u_profiles, { user_id });

            db.query(qr.queryString, qr.values, (err, rows) => {
                if (err) {
                    rejectProfile(err);
                    return;
                }

                const profile = queryRowsToArray(rows);
                if (profile.length === 1) {
                    resolveProfile(profile[0]);
                } else if (profile.length === 0) {
                    rejectProfile("Profile not found");
                } else {
                    rejectProfile("Multiple profiles found");
                }
            });
        });

        // Fetching the user's QnA answers
        const qnaPromise = new Promise((resolveQnA, rejectQnA) => {
            const qnaQr = buildSelectString("*", tableNames.u_qna, { user_id });

            db.query(qnaQr.queryString, qnaQr.values, (err, rows) => {
                if (err) {
                    rejectQnA(err);
                    return;
                }

                const qnaAnswers = rows.map(row => ({ question_id: row.question_id, option_id: row.option_id }));
                resolveQnA(qnaAnswers);
            });
        });

        // Combining profile data and QnA answers
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
        await db.query(buildUpdateString(tableNames.u_profiles, { user_id }, profileData));
  
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
  
  

// // Returns an array of "Questions and Answers" object
// // Could be an empty list if the user has no QnAs
// export async function getQnAs(user_id) {
//     return new Promise((resolve, reject) => {
//         /* TODO: Write util function for joins
//         SELECT user_id, questions.question_id, text, answer FROM 
//             questions INNER JOIN u_qnas ON questions.question_id = u_qnas.question_id
//         */
//         const queryString = `SELECT user_id, questions.question_id, text, answer FROM 
//         questions INNER JOIN u_qnas ON questions.question_id = u_qnas.question_id
//         WHERE user_id = ?;`

//         db.query(queryString, [user_id], (err, rows) => {
//             if (err) {
//                 reject(err)
//                 return
//             }

//             // return result no matter if any are found
//             const res = queryRowsToArray(rows)
//             resolve(res)
//         })
//     })
// }

// // Create an answer to an exisitng question
// // The question with question_id must exist
// // The user must have answered the question before
// export async function createQnA(user_id, question_id, answer) {
//     return new Promise((resolve, reject) => {
//         const qr = buildInsertString(tableNames.u_qnas, {user_id, question_id, answer})

//         db.query(qr.queryString, qr.values, (err, res) => {
//             if (err) {
//                 if (err.code === "ER_DUP_ENTRY") reject("Answer already exists for this question")
//                 else reject(err)
//                 return
//             }
//             if (res.affectedRows != 1) {
//                 reject({})
//             } else {
//                 // res.insertId exists iff exactly one row is inserted
//                 resolve()
//             }
//         })
//     })
// }

// // Update an answer to an exisitng question
// // The question with question_id must exist
// export async function updateQnA(user_id, question_id, answer) {
//     return new Promise((resolve, reject) => {
//         const qr = buildUpdateString(tableNames.u_qnas, {user_id, question_id}, {answer})

//         db.query(qr.queryString, qr.values, (err, res) => {
//             if (err) {
//                 reject(err)
//                 return
//             }
//             if (res.affectedRows == 0) {
//                 reject("No question found!")
//             } else if (res.affectedRows > 1)  {
//                 reject("Multiple questions and answers updated!?")
//             } else {
//                 // res.insertId exists iff exactly one row is inserted
//                 resolve()
//             }
//         })
//     })
// }

// // Deletes a user's existing answer to an exisitng question
// export async function deleteQnA(user_id, question_id) {
//     return new Promise((resolve, reject) => {
//         db.query(`DELETE FROM ${tableNames.u_qnas} WHERE user_id = ? AND question_id = ?;`, [user_id, question_id],
//         (err, res) => {
//             if (err) {
//                 reject(err)
//                 return
//             }
//             if (res.affectedRows == 0) {
//                 reject(`Question not found!`)
//             } else if (res.affectedRows == 1) {
//                 resolve(res)
//             } else reject({})
//         })
//     })
// }
