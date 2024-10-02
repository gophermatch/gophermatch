import { useEffect, useState, useRef } from "react";
import SubleaseEntry from '../ui-components/SubleaseEntry.jsx';
import { Link } from "react-router-dom";
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import SubleaseFilter from "../ui-components/SubleaseFilter.jsx";

export default function Sublease()
{
  const [subleases, setSubleases] = useState([]);
  const [userSublease, setUserSublease] = useState(null);

  const divRef = useRef(null);

  let [numPages, setNumPages] = useState(1);

  let [loadingFinished, setFinished] = useState(false);

  const resultsPerPage = 5;

  const [filter, _setFilter] = useState({
    rent_range: "any",
    num_roommates: "any",
    num_bedrooms: "any",
    num_bathrooms: "any",
    is_furnished: "any",
    has_parking: "any",
    has_kitchen: "any"
  });

  const setFilter = async (newFilter) => {
    // On filter change, clear subleases
    _setFilter(newFilter)
    if(subleases.length > 0) { setSubleases([]) }
    else { fetchSubleases(newFilter); }
    setFinished(false);
    setNumPages(1);
  };

  const remove = (sublease_id) => {
    if(subleases.length > 0) { setSubleases(subleases.filter(sub => sub.sublease_id != sublease_id)) }
    else { fetchSubleases(filter); }
    setFinished(false);
    setNumPages(1);
  }

  const handleScroll = () => {
    if(loadingFinished) return;
    const { scrollTop, scrollHeight, clientHeight } = divRef.current;
    if (scrollTop + clientHeight + 20 >= scrollHeight) {
      setNumPages(numPages+1);
    }
  };

  async function fetchSubleases(filt) {

    if(loadingFinished)
    {
      return;
    }

    try{
      let singleRes = null;
      if (userSublease === null) {
        singleRes = await backend.get("/sublease/get", {
          params: { user_id: currentUser.user_id }
        });
      }

      if(singleRes != null) setUserSublease(singleRes.data);
    } catch (err) {
      console.error(err);
      setUserSublease(null);
    }

    try {
      const multiRes = await backend.get("/sublease/getmultiple", {
        params:{count: resultsPerPage,
        page: numPages-1,
          user_id: currentUser.user_id,
        filter: filt}
      });

      setSubleases(subleases.concat(multiRes.data));

    } catch (err) {
      // If no profiles are found in our query, don't try to load more in the future
      if(err.response.status === 404) {
        setFinished(true);
        return;
      }
      console.error(err);
    }
  }

  useEffect(() => {
    fetchSubleases(filter);
  }, [numPages]);

  useEffect(() => {
    if(subleases.length === 0) {
      fetchSubleases(filter);
    }
  }, [subleases]);

  return(
    <div className="h-screen flex flex-col bg-offwhite items-center justify-center font-profile font-semibold">
      <SubleaseFilter filterSetter={setFilter}></SubleaseFilter>
      <div ref={divRef} className={"mt-[2.5%] overflow-y-auto overflow-x-visible flex-grow"} onScroll={handleScroll} style={{
        WebkitOverflowScrolling: 'touch',
        '&::WebkitScrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
      }}>

        
        <Link to="/createsublease" className="fixed right-4 bottom-4 rounded-full w-[7%] aspect-square bg-maroon text-white flex items-center justify-center transition-transform duration-500 scale-[85%] hover:scale-[90%] cursor-pointer">
          <img src={userSublease ? "../../assets/images/edit_sublease.svg" : "../../assets/images/create_sublease.svg"} alt="Match" className="w-[45%] h-[45%] object-contain text-maroon fill-current" />
        </Link>

        <div className="w-[70vw]"></div>

        {subleases.length > 0 ? subleases.map(item => (
          // Return a React element for each item in the array
          item.user_id !== currentUser.user_id && <SubleaseEntry key={item.user_id} sublease={item} removeFunc={remove}/>
        )) : <br></br>}
        <br></br>
      </div>
    </div>
  )
}