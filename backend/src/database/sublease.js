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
      SELECT u_savelease.sublease_id, u_subleases.building_name, u_generaldata.first_name, u_generaldata.last_name, u_generaldata.contact_email, u_generaldata.contact_phone, u_generaldata.contact_snapchat, u_generaldata.contact_instagram
      FROM (u_savelease
      INNER JOIN u_subleases ON u_savelease.sublease_id = u_subleases.sublease_id AND u_savelease.user_id = ${user_id}) 
      INNER JOIN u_generaldata ON u_generaldata.user_id = u_subleases.user_id
    `, (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);  // Added reject in case of an error
      } else {
        const data = rows.map(row => {
          // Determine the preferred contact method
          const contact = row.contact_email || row.contact_phone || row.contact_snapchat || row.contact_instagram || "No contact provided";
          return {
            user_id: row.user_id,  // Correctly associate the sublease user_id
            sublease_id: row.sublease_id,
            building_name: row.building_name,
            name: `${row.first_name} ${row.last_name}`,
            contact: contact
          }
        });
        resolve(data);
      }
    });
  });
}


// returns array of jsons for user's saved subleases (can change the name of this function later)
export async function getSavedSubleaseNew(user_id) {
  return new Promise((resolve, reject) => {
    // First query to get the sublease IDs
    const subleaseIdQuery = `
      SELECT 
        sublease_id
      FROM 
        ${tableNames.u_savelease}
      WHERE 
        user_id = ?
    `;

    db.query(subleaseIdQuery, [user_id], (err, subleaseIdRows) => {
      if (err) {
        console.error('Error fetching saved sublease IDs:', err);
        reject(err);
      } else if (subleaseIdRows.length === 0) {
        reject(new Error('No saved subleases found.'));
      } else {
        const subleaseIds = subleaseIdRows.map(row => row.sublease_id);

        // Second query to get the sublease details
        const subleaseDetailsQuery = `
          SELECT 
            sublease_id,
            building_address,
            building_name,
            user_id
          FROM 
            ${tableNames.u_subleases}
          WHERE 
            sublease_id IN (?)
        `;

        db.query(subleaseDetailsQuery, [subleaseIds], (err, subleaseDetailsRows) => {
          if (err) {
            console.error('Error fetching sublease details:', err);
            reject(err);
          } else {
            // Get user IDs from the sublease details
            const userIds = subleaseDetailsRows.map(row => row.user_id);

            // Query to get the user contact information
            const userContactQuery = `
              SELECT 
                user_id,
                contact_email
              FROM 
                ${tableNames.u_generaldata}
              WHERE 
                user_id IN (?)
            `;

            db.query(userContactQuery, [userIds], (err, userContactRows) => {
              if (err) {
                console.error('Error fetching user contact information:', err);
                reject(err);
              } else {
                // Create a map of user contact information
                const userContactMap = userContactRows.reduce((map, row) => {
                  map[row.user_id] = row.contact_email;
                  return map;
                }, {});

                // Combine sublease details with user contact information
                const result = subleaseDetailsRows.map(sublease => ({
                  sublease_id: sublease.sublease_id,
                  building_address: sublease.building_address,
                  building_name: sublease.building_name,
                  contact_email: userContactMap[sublease.user_id] || null,
                  user_id: sublease.user_id
                }));

                resolve(result);
              }
            });
          }
        });
      }
    });
  });
}
