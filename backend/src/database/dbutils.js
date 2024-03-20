// MySQL's query function returns an array of RowDataPackets
// This function convert them into an ordinary js array with js objects
export function queryRowsToArray(rows) {
    // shallow copy the object (is this ok? do we need to structured clone?)
    const objectifyRawPacket = row => ({...row});
    // iterate over all items and convert the raw data packet row -> js object
    return rows.map(objectifyRawPacket);
}

/* Returns a string of keys that corresponds to values which have ? as placeholder. For example,
    1. user_id = ? AND hashpass = ? AND age > ? ...
    2. use_id = ? , hashpass = ? , ...
    Also returns an array of values

    object: the js object that contains the keys and values
    relation: string array of relations like =, > to separate keys and ?
    separator: string array of separators to separate each key/value pair. AND and "," are separators
    If relations or separators are strings instead of arrays, then all separators used are the same\
*/
export function buildKeyValSep(object, relation, separator) {
    const keyVals = Object.entries(object)
    const relIsArr = Array.isArray(relation)
    const sepIsArr = Array.isArray(separator)

    if (sepIsArr && keyVals.length != separator.length+1 ||
        relIsArr && keyVals.length != relation.length)
        throw "input arrays must have the correct length!";

    let res = ""
    let vals = []
    for(let i = 0; i < keyVals.length; i++) {
        let [key, val] = keyVals[i];
        res += key + " "
            + (relIsArr ? relation[i] : relation)
            + " ?";
        if (i != keyVals.length-1) {
            res += " " 
                + (sepIsArr ? separator[i] : separator)
                + " ";
        }
        vals.push(val)
    }
    return {
        keyString: res,
        values: vals
    }
}

// Builds a simple select query string with conditions that are all equality checks
// selector: expression for selecting in SQL
// table: table name for querying
// conds: js object with keys (column names) and values (what the corresponding value should equal to)
// Return the SQL expression
// I.e. buildSelectString("*", "users", {
//      user_id: "3", password: "abc"
// })
// Returns an incomplete query string "SELECT * FROM users WHERE user_id = ? AND password = ?"
// and an array of values in the right order that corresponds to the column names
// The "?" is used for the mysql library to add the values to the query string for us
export function buildSelectString(selector, tableName, conds) {
    if (conds == null) conds = {}
    const res = buildKeyValSep(conds, "=", "AND")
    let cond = "";
    if (res !== "") cond += " WHERE " + res.keyString
    return {
        queryString: `SELECT ${selector} FROM ${tableName}${cond};`,
        values: res.values
    };
}

// Builds a simple insert query string with column names and their values
// object's members should be the row's columns. Must contain a member for each not null columns with no default values
export function buildInsertString(tableName, object) {
    let colList = "", valList = "", vals = []
    const keyVals = Object.entries(object)
    for(let i = 0; i < keyVals.length; i++) {
        let [key, val] = keyVals[i]
        colList += key
        valList += "?"
        vals.push(val)
        if (i != keyVals.length-1) {
            colList += ","
            valList += ","
        }
    }
    colList = "(" + colList + ")"
    valList = "(" + valList + ")"

    return {
        queryString: `INSERT INTO ${tableName} ${colList} VALUES ${valList};`,
        values: vals
    }
}

// primary_key is an object specifying the record with the primary key. cannot be null
// newVals is an object with the column name and their new values
// newVals can contain a subset of the columns, but cannot be an empty object
// To discard a column's value, you can set newVals = { x : null }
export function buildUpdateString(tableName, primary_key, newVals) {
    const nvs = buildKeyValSep(newVals, "=", ",")
    const pk = buildKeyValSep(primary_key, "=", "AND")

    const vals = nvs.values.concat(pk.values)
    return {
        queryString: `UPDATE ${tableName} SET ${nvs.keyString} WHERE ${pk.keyString};`,
        values: vals
    }
}

/**
 * Builds a simple DELETE query string with conditions.
 * @param {string} tableName - The name of the table to delete from.
 * @param {Object} conds - An object where keys are column names and values are the values those columns must match for the row to be deleted.
 * @returns {Object} An object containing the queryString for the DELETE operation and an array of values that correspond to the placeholders in the query.
 */
export function buildDeleteString(tableName, conds) {
    if (!conds || Object.keys(conds).length === 0) {
        throw new Error("Conditions object cannot be empty for DELETE operation.");
    }
    // Utilize buildKeyValSep to construct the WHERE clause of the DELETE query.
    const { keyString, values } = buildKeyValSep(conds, "=", "AND");
    const queryString = `DELETE FROM ${tableName} WHERE ${keyString};`;
    return { queryString, values };
}
