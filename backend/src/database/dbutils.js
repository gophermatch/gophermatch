// MySQL's query function returns an array of RowDataPackets
// This function convert them into an ordinary js array with js objects
export function queryRowsToArray(rows) {
    // shallow copy the object (is this ok? do we need to structured clone?)
    const objectifyRawPacket = row => ({...row});
    // iterate over all items and convert the raw data packet row -> js object
    return rows.map(objectifyRawPacket);
}

/* Returns a string of keys that corresponds to values which have ? as placeholder. For example,
    1. user_id = ? AND hashpass = ? AND age > 2 ...
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
        vals: vals
    }
}

// Builds a simple query string with conditions that are all equality checks
// selector: expression for selecting in SQL
// table: table name for querying
// conds: js object with keys (column names) and values (what the corresponding value should equal to)
// Return the SQL expression
// I.e. buildQueryString("*", "users", {
//      id: "3", password: "abc"
// })
// Returns an incomplete query string "SELECT * FROM users WHERE id = ? AND password = ?"
// and an array of values in the right order that corresponds to the column names
// The "?" is used for the mysql library to add the values to the query string for us
export function buildQueryString(selector, tableName, conds) {
    if (conds == null) conds = {}
    const res = buildKeyValSep(conds, "=", "AND")
    let cond = "";
    if (res !== "") cond += " WHERE " + res.keyString + ";"
    return {
        queryString: `SELECT ${selector} FROM ${tableName}${cond}`,
        values: res.vals
    };
}