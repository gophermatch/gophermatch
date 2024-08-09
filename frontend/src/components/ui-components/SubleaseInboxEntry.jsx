export default function SubleaseInboxEntry ({user_id, deleteSub}) {
    return (
        <div className="flex flex-col h-[9.5vh] w-full" key={index}>
                                <div className="flex" key={index}>
                                    <div className="flex flex-row w-full">
                                        <div className="flex flex-col w-full text-start justify-start">
                                            <p className="text-[2.5vh] mt-[1.5vh] ml-[1vw] w-[30vw] font-roboto font-[390] text-maroon">{`${sublease.address} - ${sublease.room_type}`}</p>
                                            <div className="flex flex-row">
                                                <p className="ml-[1vw] text-xs text-left text-[1.5vh] w-[25vw] font-roboto font-light">{sublease.email}</p>
                                            </div>
                                        </div>
                                        <div className="w-full text-right">
                                            <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => displaySublease(sublease)}>View</button>
                                            <button className="text-[1.5vh] bg-white hover:bg-red-500 hover:text-white w-[4vw] h-[2.5vh] rounded-lg mr-[1vw] mt-[1.5vh] border-2 border-maroon" onClick={() => deleteSublease(sublease.sublease_id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
    );
}