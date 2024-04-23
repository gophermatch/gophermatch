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

  let roommateFilter = params['filter[num_roommates]'];
  let roommateFilters = [];
  if(roommateFilter === "any") { roommateFilters = ["0", "1000000"]; }
  else if(roommateFilter === "5+") { roommateFilters = ["5", "1000000"]; }
  else {roommateFilters = [roommateFilter, roommateFilter]}

  let bedroomFilter = params['filter[num_bedrooms]'];
  let bedroomFilters = [];
  if(bedroomFilter === "any") { bedroomFilters = ["0", "1000000"]; }
  else if(bedroomFilter === "5+") { bedroomFilters = ["5", "1000000"]; }
  else {bedroomFilters = [bedroomFilter, bedroomFilter]}

  let bathroomFilter = params['filter[num_bathrooms]'];
  let bathroomFilters = [];
  if(bathroomFilter === "any") { bathroomFilters = ["0", "1000000"]; }
  else if(bathroomFilter === "5+") { bathroomFilters = ["5", "1000000"]; }
  else {bathroomFilters = [bathroomFilter, bathroomFilter]}

  let parking = params['filter[has_parking]'];

  let kitchen = params['filter[has_kitchen]'];

  let furnished = params['filter[is_furnished]'];

  let user_id = params.user_id;

  console.log(rentFilters);

  return new Promise((resolve, reject) => {
    const query = `SELECT *
FROM ${tableNames.u_subleases} AS sub
WHERE rent_amount BETWEEN ${rentFilters[0]} AND ${rentFilters[1]}
AND num_roommates BETWEEN ${roommateFilters[0]} AND ${roommateFilters[1]}
AND num_bathrooms BETWEEN ${bathroomFilters[0]} AND ${bathroomFilters[1]}
AND num_bedrooms BETWEEN ${bedroomFilters[0]} AND ${bedroomFilters[1]}
${parking === "any" ? "" : "AND has_parking = '" + parking + "'"}
${kitchen === "any" ? "" : "AND has_kitchen = '" + kitchen + "'"}
${furnished === "any" ? "" : "AND is_furnished = '" + furnished + "'"}
AND NOT EXISTS (
    SELECT 1
    FROM ${tableNames.u_savelease} AS ot
    WHERE ot.user_id = ${user_id} 
      AND ot.sublease_id = sub.sublease_id
  )
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

export async function saveSublease(user_id, sublease_id) {
  try {
    const query = `
        INSERT INTO ${tableNames.u_savelease} (user_id, sublease_id) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE match_timestamp = CURRENT_TIMESTAMP;
    `;

    await db.query(query, [user_id, sublease_id]);
  } catch (error) {
    console.error('Error in saveSublease:', error);
    throw new Error('Failed to save a sublease');
  }
}

export async function deleteSavedSublease(user_id, sublease_id) {
  try {
    const query = `
        DELETE FROM ${tableNames.u_savelease}
        WHERE user_id = ? AND sublease_id = ?;
    `;

    // Execute the delete query with the provided parameters
    const result = await db.query(query, [user_id, sublease_id]);
    if (result.affectedRows === 0) {
      console.log("No sublease found to delete.");
      throw new Error('No sublease found with the provided IDs');
    }
  } catch (error) {
    console.error('Error in deleteSublease:', error);
    throw new Error('Failed to delete the sublease');
  }
}

export async function getSavedSubleases(user_id) {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT u_subleases.building_name, u_userdata.first_name, u_userdata.last_name, contact_email, contact_phone, contact_snapchat, contact_instagram
      FROM (u_savelease
      INNER JOIN u_subleases ON u_savelease.sublease_id = u_subleases.sublease_id AND u_savelease.user_id = ${user_id}) 
      INNER JOIN u_userdata ON u_userdata.user_id = u_subleases.user_id
    `, (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        const data = rows.map(row => {
          // probably do some logic here to determine contact method and stuff
          return {
            building_name: row.building_name,
            name: `${row.first_name} ${row.last_name}`,
            contact: row.contact_email || row.contact_phone || row.contact_snapchat || row.contact_instagram || "No contact provided"
          }
        });
        resolve(data);
      }
    });
  });
}

