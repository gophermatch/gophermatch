import { useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import Filter from '../ui-components/Filter';
import backend from '../../backend';
import currentUser from '../../currentUser';

export default function Match() {
    const [filterResults, setFilterResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextProfiles, setNextProfiles] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setNextProfiles([]);
    }, [filterResults]);

    function loadNextProfiles() {
        if (isRequesting || currentIndex >= filterResults.length) {
            // console.log("Not loading more profiles");
            return;
        }
        // console.log("Loading more profiles")

        const LOAD_COUNT = 3;
        setIsRequesting(true);

        // console.log("Index: " + currentIndex + " To: " + (currentIndex + LOAD_COUNT));
        const nextIds = filterResults.slice(currentIndex, currentIndex + LOAD_COUNT);
        setCurrentIndex(i => i + LOAD_COUNT);
        // console.log("Next ids are: ", nextIds);

        Promise.all([
            ...nextIds.map(id => backend.get('account/fetch', {params: {user_id: id}})),
            ...nextIds.map(id => backend.get('/profile', {params: {user_id: id}}))])
            .then((responses) => {

                console.log(responses);

                const accountResponses = responses.slice(0, nextIds.length);
                const profileResponses = responses.slice(nextIds.length);

                const profiles = accountResponses.map((response, i) => ({
                    user_id: nextIds[i],
                    account_data: response.data.data
                }));

                profileResponses.forEach((response, i) => {
                    const profileIndex = nextIds.findIndex(id => id === response.data.user_id);
                    if (profileIndex !== -1) {
                        profiles[profileIndex].profile_data = response.data;
                    }
                });

                console.log("More profiles recieved for: ", nextIds);
                console.log(profiles);

                setNextProfiles(s => [...s, ...profiles]);
                setIsRequesting(false);
            });
    }

    function goToNext(decision) {
        backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: nextProfiles[0].user_id,
            decision: decision
        });
        setNextProfiles(s => s.slice(1));
    }

    if (nextProfiles.length <= 3) {
        loadNextProfiles();
    }

    if (nextProfiles.length === 0) {
        return (
            <div>
                <Filter setFilterResults={setFilterResults} />
                <p>Out of results, please change your filters!</p>
            </div>
        )
    }

    return (
      <div>
          <Filter setFilterResults={setFilterResults} />
          <Profile user_data={nextProfiles[0]?.account_data} qnaAnswers={nextProfiles[0]?.profile_data?.qnaAnswers} editedBio={nextProfiles[0]?.profile_data?.bio}  editable={false} />
          <div className="absolute bottom-[3vh] justify-around left-1/2 transform -translate-x-1/2 space-x-5">
              <button onClick={() => goToNext("reject")}
                      className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">
                  <p className={"text-gold"}>X</p>
              </button>
              <button onClick={() => goToNext("unsure")}
                       className="w-[8vh] h-[8vh] bg-offwhite border-black border-[1px] rounded-full text-center align-middle text-white font-bold hover:bg-slate-300 shadow-md">💾</button>
              <button onClick={() => goToNext("match")}
                      className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">
                  <p className={"text-maroon_new"}>&#10003;</p>
              </button>
          </div>
      </div>
    );
}
