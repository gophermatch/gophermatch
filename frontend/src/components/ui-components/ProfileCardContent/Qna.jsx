

export default function Qna({qna, setQna}) {
    return (
        <div 
            ref={containerRef}
            className={"w-full rounded-lg border-solid border-[1.5px] border-maroon font-roboto_slab font-medium"} 
            style={{ height: 'calc(100% * 1)' }}
        >
            <div className={"flex w-full h-full justify-center items-center flex-col px-[1%]"}>
                <div className={"flex w-full whitespace-nowrap"}>
                    <div className={"flex-1"}>
                        Preferred Room Activity Level
                    </div>
                    <div className={"flex-1 text-right"}>
                        Empty
                    </div>
                </div>
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon xl:text-lg lg: text-md md:text-sm sm:text-xs font-roboto_slab font-medium"}>
    <div className={"flex w-full h-full justify-center items-center flex-col px-[1%]"}>
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Room Activity Level
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={room_activity}
                        name={"room_activity"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setRoomActivity}
                    />
                    :
                    room_activity
                }
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
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Substance Preference
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={substances}
                        name={"substances"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setSubstances}
                    />
                    :
                    substances
                }
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
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Alcohol Preference
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={alcohol}
                        name={"alcohol"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setAlcohol}
                    />
                    :
                    alcohol
                }
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
        </div>
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Tidiness
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={tidiness}
                        name={"tidiness"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setTidiness}
                    />
                    :
                    tidiness
                }
            </div>
        </div>
    </div>
    </div>
    );
}}
