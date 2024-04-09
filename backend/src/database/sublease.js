import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString } from './dbutils.js'

export async function createSublease(sublease_data) {
    return new Promise((resolve, reject) => {
      const insertQuery = buildInsertString(tableNames.u_subleases, sublease_data);
  
      db.query(insertQuery.queryString, insertQuery.values, (err, result) => {
        if (err) {
          console.error('Error creating sublease in database:', err);
          reject(err); // Reject the promise with the error
        } else {
          // Directly resolve the promise with the new record's ID and the original data
          // This omits explicit checks on result.affectedRows
          resolve({ id: result.insertId, ...sublease_data });
        }
      });
    });
  }

//TODO
export async function getSublease(user_id){

}

//TODO
export async function deleteSublease(user_id){

}