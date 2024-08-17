import React from "react"
import InputRange from "react-input-range"

export default function SleepSchedule({sleepSchedule, setSleepSchedule}) {
    return (
        <>
            <span className="ml-[5vw]">Sleep Schedule</span>

            <InputRange
                draggableTrack
                maxValue={144}
                minValue={80}
                value={sliderValue}
                onChange={value => setSliderValue(value)}
                formatLabel={() => null}
                className={{
                    slider: 'maroon',
                    track: 'maroon',
                    activeTrack: 'maroon',
                    labelContainer: 'maroon',
                }}
            />
            <div className="flex justify-between">
                <span>{formatTime(sliderValue.min)}</span>
                <span>{formatTime(sliderValue.max)}</span>
            </div>
        </>
    )
}
