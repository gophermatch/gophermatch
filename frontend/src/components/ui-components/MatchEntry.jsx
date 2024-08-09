import React from "react";

import kanye from '../../assets/images/kanye.png';

export default function MatchEntry ({user_id, deleteMatch}) {
    return (
        <div className="flex flex-col h-[9.5vh] w-full" key={0}>
                            <div className="flex" key={0}>
                                <div className="flex flex-row w-full">
                                    <img src={kanye} className="rounded-full h-[8vh] w-[8vh] mt-[0.5vh] ml-[0.5vw] cursor-pointer" alt="Profile" onClick={() => displayProfile(person)}></img>
                                    <div className="flex flex-col w-full text-start items-start justify-start">
                                        <button className="text-[2.5vh] mt-[0.75vh] w-auto ml-[1vw] font-roboto font-light text-start text-maroon" onClick={() => displayProfile(person)}>{`Kanye West`}</button>
                                        <button className="text-[2vh] font-thin ml-[1vw]" onClick={() => displayProfile(person)}>{"612-000-0000"}</button>
                                    </div>
                                    <div className="w-full text-right">
                                        <button className="text-[2.5vh] text-inactive_gray hover:text-maroon w-[4vw] mr-[1vw] mt-[2.5vh]" onClick={() => unmatch(person.user_id)}>X</button>
                                    </div>
                                </div>
                            </div>
                        </div>
    );
}