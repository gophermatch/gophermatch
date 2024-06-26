import { useState, useEffect } from "react";
import { ProfileCard } from '../ui-components/ProfileCard';
import Filter from '../ui-components/Filter';
import backend from '../../backend';
import currentUser from '../../currentUser';

export default function Match() {
    const [filterResults, setFilterResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [profileMode, setProfileMode] = useState(0);

    const [filters, setFilters] = useState([]);
    const [userData, setUserData] = useState({});
    
    useEffect(() => {
      setCurrentIndex(0);
      setFilterResults([]);
      appendFilterResults();
    }, [filters, userData]);

    async function goToNext(decision) {
        await backend.post('/match/matcher', {
            user1Id: currentUser.user_id,
            user2Id: filterResults[currentIndex].user_id,
            decision: decision
        });

        if(currentIndex+1 >= filterResults.length){
          console.log("ran out of results, appending more");
          await appendFilterResults()
          setCurrentIndex(0);
          return;
        }

        setCurrentIndex(currentIndex+1);
    }

    async function showRejectedMatches()
    {
      const response = await backend.post('/match/unrejectall', {
        user_id: currentUser.user_id
      });

      console.log(response);

      await appendFilterResults();
    }

  async function appendFilterResults() {
    await backend.post('/match/filter-results', {user_id: currentUser.user_id, userData, filters, amount:3}, {withCredentials: true}).then((res) => {
      setFilterResults(res.data);
      console.log("Filtered profiles: ", res.data);
    });
  }

    if (currentIndex >= filterResults.length) {
        return (
          <div className={"h-full" +
            ""}>
              <Filter setFiltersExternal={setFilters} setUserDataExternal={setUserData} profileMode={profileMode}/>
            <div className={"flex h-full justify-center items-center"}>
              <div className={"flex flex-col"}>
                <p className={"text-center"}>Out of results, please change your filters or</p>
                <button className={"mt-[5px] text-center bg-maroon_dark rounded-2xl px-[10px] py-[5px] text-white duration-500 hover:bg-maroon_new"} onClick={showRejectedMatches}>Start from the beginning</button>
              </div>
              </div>
          </div>
        )
    }

    return (
      <div>
          <Filter setFiltersExternal={setFilters} setUserDataExternal={setUserData} profileMode={profileMode}/>
          <ProfileCard
            user_data={filterResults[currentIndex]?.user_data}
            qnaAnswers={filterResults[currentIndex]?.profile_data?.qnaAnswers}
            editedBio={filterResults[currentIndex]?.profile_data?.bio}
            editable={false}
            dormMode={profileMode}
            top5={['', '', '', '', '']}
            question="fjoeiwf"
          />
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

          <div className="absolute bottom-[3vh] ml-[70vw] space-x-[1vw] text-[1vw]">
            <button onClick={() => setProfileMode(0)}
                className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">Dorm</button>
            <button onClick={() => setProfileMode(2)}
                className="w-[8vh] h-[8vh] bg-offwhite border-black border-[1px] rounded-full text-center align-middle text-black font-bold hover:bg-slate-300 shadow-md">Both</button>
            <button onClick={() => setProfileMode(1)}
                className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">Apt.</button>
        </div>
      </div>
    );
}
