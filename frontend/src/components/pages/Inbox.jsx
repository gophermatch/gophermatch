import kanye from '../../assets/images/kanye.png'

const dummyData = {
    id: 865728,
    firstName: "Someone",
    lastName: "Special",
    college: "cse"
}

const secondData = {
    id: 54125,
    firstName: "Kanye",
    lastName: "Western",
    college: "cfams"
}

export default function Inbox() {
    const people = [];
    // get matches
    people.push(dummyData);
    people.push(secondData);

    function unmatch(profileId) {
        // backend.put("/unmatch", profileId) ??
        console.log("Will attempt to unmatch: " + profileId)
    }

    return (
        <div className="p-8">
            <h1 className="text-center text-5xl mb-8">Matches</h1>
            {people.map((person) => (
                <div className="bg-white rounded-md border-2 border-maroon p-4 m-8 w-[60%] flex">
                    <div className="h-[80px] w-[80px]">
                        <img src={kanye} className="rounded-md"></img>
                    </div>
                    <div className="flex items-center flex-1 justify-between p-5">
                        <div>
                            <p className="font-bold text-maroon_new text-xl m-0 inline-block">{person.firstName}</p>
                            <p className="font-bold text-maroon_new text-xl m-0 inline-block">&nbsp;{person.lastName}</p>
                        </div>
                        <button className="">Info</button>
                        <button className="bg-red-500 h-[40px] w-[40px] rounded-lg text-white text-[25px]" onClick={() => unmatch(person.id)}>X</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
