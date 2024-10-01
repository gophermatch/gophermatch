import React, { useEffect, useState } from "react";
import InputRange from "react-input-range";
import 'react-input-range/lib/css/index.css';
import backend from "../../../backend";
import './sleepscheduleStyles.css'

export default function SleepSchedule({ user_id, broadcaster }) {
    const [sliderValue, setSliderValue] = useState({ min: 90, max: 120 });

    useEffect(() => {
        backend.get('/profile/get-gendata', { params: { user_id, filter: ['wakeup_time', 'sleep_time'] } })
            .then(res => {
                if (res.data && res.data[0]) {
                    setSliderValue({ min: res.data[0].wakeup_time, max: res.data[0].sleep_time });
                }
            });
    }, [user_id]);
    
    useEffect(() => {
        if (broadcaster) {
            const cb = () =>
                backend.post('/profile/set-gendata', {
                    user_id: user_id,
                    data: {
                        wakeup_time:sliderValue.min,
                        sleep_time:sliderValue.max
                    }
                });

            broadcaster.connect(cb);
            return () => broadcaster.disconnect(cb);
        }
    }, [broadcaster, sliderValue.min, sliderValue.max]);

    const formatTime = (value) => {
        const hours = Math.floor(value / 4);
        const minutes = (value % 4) * 15;
        const ampm = hours < 12 ? "am" : "pm";
        const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        if (value === 144) {
            return `12pm+`;
        }

        if (hours >= 24) {
            if (hours === 24) {
                return `12:${minutes === 0 ? "00" : minutes}am`;
            }
            return `${hours - 24}:${minutes === 0 ? "00" : minutes}am`;
        }

        return `${formattedHours}:${minutes === 0 ? "00" : minutes}${ampm}`;
    };

    return (
        <div className="w-full h-full px-[8%] py-[4%]">
            <div className="flex justify-center mb-4">
                <p>Sleep Schedule</p>
            </div>

            <div className="relative">
            <InputRange
                disabled={!broadcaster}
                maxValue={144}
                minValue={80}
                value={sliderValue}
                onChange={value => {
                    console.log("Slider value changed:", value); // Debug value changes
                    setSliderValue(value);
                }}
                className="bg-maroon "
                formatLabel={(value, type) => {
                    if (type === 'min' || type === 'max') {
                      return null; // Hide labels for min and max
                    }
                    return `${formatTime(value)}`; // Show value for other labels (like tooltip)
                  }}
             />
            </div>
        </div>
    );
}
