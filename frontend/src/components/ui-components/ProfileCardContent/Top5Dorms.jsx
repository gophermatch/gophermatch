
const TEMP_DATA = {
    type: "dorm",
    top5Dorms: ["Comstock", "Middlebrook", "Territorial", "Centennial", "17th"],
    numPeople: {min: 2, max: 4},
    semesters: "Both Semesters",
}

export default function Top5Dorms({top5Dorms, setTop5Dorms}) {

    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px]">
            <div className="basis-[30px] flex">
                <p>{TEMP_DATA.numPeople.min}-{TEMP_DATA.numPeople.max} People</p>
                <p className="ml-auto">{TEMP_DATA.semesters}</p>
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto">
                <p className="text-sm">Top 5 Dorms</p>
                <div className="flex flex-col gap-[5px]">
                    {TEMP_DATA.top5Dorms.map((dorm) => (
                        <div className="bg-maroon h-[30px] leading-[30px] pl-[5px] rounded-md text-white">
                            {dorm}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
