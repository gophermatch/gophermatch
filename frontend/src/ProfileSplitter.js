const preferenceMap = {
    "college_id": true,
    "is_dorm": true,
    "sleep_low_range": true,
    "sleep_high_range": true,
    "drugs": true,
    "cleanliness": true
}


class ProfileSplitter {
    general = {};
    preferences = {};

    constructor(data) {
        for (const k in data) {
            if (preferenceMap[k]) {
                this.preferences[k] = data[k];
            } else {
                this.general[k] = data[k];
            }
        }
    }

    mapPreferences(callback) {
        const res = [];
        for (const k in this.preferences) {
            res.push(callback(this.preferences[k], k))
        }
        return res;
    }
}

export default ProfileSplitter
