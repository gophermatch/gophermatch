import { db, tableNames } from './db.js';
import { queryRowsToArray, buildSelectString, buildUpdateString } from './dbutils.js';

export async function getSettings() {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString('*', tableNames.settings);

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(queryRowsToArray(rows));
        });
    });
}

export async function updateSetting(name, value) {
    return new Promise((resolve, reject) => {
        const qr = buildUpdateString(tableNames.settings, { name }, { value });

        db.query(qr.queryString, qr.values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });
}

export async function getUserInfo() {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString('*', tableNames.user);

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(queryRowsToArray(rows));
        });
    });
}
