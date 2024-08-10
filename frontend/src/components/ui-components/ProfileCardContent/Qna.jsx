import { useEffect, useRef } from "react";

export default function Qna({ qna, setQna }) {
    const containerRef = useRef(null);

    const resizeFont = () => {
        if (containerRef.current) {
            const parentHeight = containerRef.current.clientHeight;
            const fontSize = parentHeight * 0.13; // Adjust this multiplier as needed
            containerRef.current.style.fontSize = `${fontSize}px`;
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(resizeFont);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        resizeFont(); // Ensure the font size is set correctly on mount or when the page is revisited

        return () => {
            observer.disconnect(); // Clean up the observer on unmount
        };
    }, []);

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
        </div>
    );
}
