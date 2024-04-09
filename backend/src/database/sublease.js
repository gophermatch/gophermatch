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

  export async function getSublease(user_id) {
    return new Promise((resolve, reject) => {
      const { queryString, values } = buildSelectString("*", tableNames.u_subleases, { user_id });
      
      db.query(queryString, values, (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error('No sublease found for the given user ID.'));
        } else {
          resolve(results[0]); // Assuming user_id is unique and can only have one sublease
        }
      });
    });
  }

  export async function deleteSublease(user_id) {
    return new Promise((resolve, reject) => {
      const queryString = `DELETE FROM u_subleases WHERE user_id = ?`;
  
      db.query(queryString, [user_id], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.affectedRows === 0) {
          reject(new Error('No sublease found with the given user ID, or it could not be deleted.'));
        } else {
          resolve({ message: 'Sublease deleted successfully.' });
        }
      });
    });
  }
  
