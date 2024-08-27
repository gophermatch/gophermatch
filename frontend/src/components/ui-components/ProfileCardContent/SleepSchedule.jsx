import React, { useEffect, useState } from "react"
import InputRange from "react-input-range"
import backend from "../../../backend";

export default function SleepSchedule({user_id, broadcaster}) {
    const [sliderValue, setSliderValue] = useState({ min: 90, max: 120 });

    useEffect(() => {
        backend.get('/profile/get-gendata', {params: {
            user_id,
            filter: ['wakeup_time', 'sleep_time'],
        }}).then(res => {
            setSliderValue({ min: res.data[0].wakeup_time, max: res.data[0].sleep_time });
        })
    }, [])

    useEffect(() => {
        if (broadcaster) {
            const cb = () => backend.post('/profile/set-gendata', {
                user_id,
                data: {
                    wakeup_time: sliderValue.min,
                    sleep_time: sliderValue.max,
                }
            })

            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
    }, [broadcaster])

    const formatTime = (value) => {
        const hours = Math.floor(value / 4);
        const minutes = (value % 4) * 15;
        const ampm = hours < 12 ? "am" : "pm";
        const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        // Special case when the slider passes 12pm
        if (value === 144) {
            return `12pm+`;
        }

        // Special case when the slider passes 12
        if (hours >= 24) {
            if (hours === 24) {
              return `12:${minutes === 0 ? "00" : minutes}am`;
            }
            return `${hours - 24}:${minutes === 0 ? "00" : minutes}am`;
        }

        return `${formattedHours}:${minutes === 0 ? "00" : minutes}${ampm}`;
    };

    return (
        <div className="w-full h-full">
            <div className="flex justify-center">
                <p>Sleep Schedule</p>
            </div>

            <div className="relative">
                <InputRange
                    disabled={broadcaster ? false : true}
                    maxValue={144}
                    minValue={80}
                    value={sliderValue}
                    onChange={value => setSliderValue(value)}
                    // formatLabel={() => null}
                    // classNames={{
                    //     slider: 'maroon',
                    //     track: 'maroon',
                    //     activeTrack: 'maroon',
                    //     labelContainer: 'maroon',
                    // }}
                />
            </div>
            <div className="flex justify-between m-0">
                <span>{formatTime(sliderValue.min)}</span>
                <span>{formatTime(sliderValue.max)}</span>
            </div>
        </div>
    )
}
