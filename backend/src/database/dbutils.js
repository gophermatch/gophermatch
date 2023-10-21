// Process an error js object returned by MySQL DB, to 
// return a js object with error = true and other properties set
export function processErrorObj(error) {
    return {
        error_message: error.message,
        error_type: error.code
    }
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
    let keys = []
    let vals = []
    let cond = ""
    for (let key in conds) {
        keys.push(key)
        vals.push(conds[key]);
    }
    if (keys.length != 0) cond += " WHERE " + buildStringKeyValSep(keys, "=", "AND") + ";";
    return {
        queryString: `SELECT ${selector} FROM ${tableName}${cond}`,
        values: vals
    };
}