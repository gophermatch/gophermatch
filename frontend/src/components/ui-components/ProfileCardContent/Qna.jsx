

export default function Qna({qna, setQna}) {
    return (
    <div className={"w-[33vw] ml-[0.25rem] text-[8px] xl:text-[16px] xl:h-[9rem] xl:w-[23.75rem] lg:text-[13px] lg:h-[7rem] lg:w-[17.75rem] md:text-[11px] md:h-[5.25rem] md:w-[14rem] sm:w-[12rem] sm:mt-[0.25rem] sm:h-[4.5rem] sm:text-[9px] sm:ml-[0] h-[14vw] absolute top-[67%] rounded-lg border-solid border-2 border-maroon xl:text-lg lg: text-md md:text-sm sm:text-xs font-roboto_slab font-medium"}>
    <div className={"flex w-full h-full justify-center items-center flex-col px-[1%]"}>
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Room Activity Level
            </div>
            <div className={"flex-1 text-right"}>
                Empty
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Substance Preference
            </div>
            <div className={"flex-1 text-right"}>
                Man of god
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Alcohol Preference
            </div>
            <div className={"flex-1 text-right"}>
                Hand Sanitizer Only
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Tidiness
            </div>
            <div className={"flex-1 text-right"}>
                Neat Freak
            </div>
        </div>
    </div>
    </div>);
}
