import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from "./dbutils.js";

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

export async function updateSublease(sublease_data) {
  return new Promise((resolve, reject) => {
    const primary_key = { user_id: sublease_data.user_id };

    const updateQuery = buildUpdateString(tableNames.u_subleases, primary_key, sublease_data);

    db.query(updateQuery.queryString, updateQuery.values, (err, result) => {
      if (err) {
        console.error('Error updating sublease in database:', err);
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

export async function getSubleases(params) {

  let rentFilters = params['filter[rent_range]'].split('-');
  if(rentFilters[0] === "any") { rentFilters = ["0", "1000000"]; }
  else if(rentFilters[1] === "+") { rentFilters[1] = "1000000"; }

  console.log(rentFilters);

  return new Promise((resolve, reject) => {
    const query = `SELECT *
FROM ${tableNames.u_subleases}
WHERE rent_amount BETWEEN ${rentFilters[0]} AND ${rentFilters[1]}
ORDER BY premium DESC
LIMIT ${params.count} OFFSET ${params.page*params.count};`;

    console.log(query);

    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length === 0) {
        reject(new Error('No subleases found.'));
      } else {
        resolve(results); // Return all found subleases
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
  
