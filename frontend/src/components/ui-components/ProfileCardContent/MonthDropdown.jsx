import React, { useEffect, useState } from 'react';

const MonthDropdown = ({initialValue}) => {

    useEffect(() => {
        // Set initial value to January
        setSelectedMonth(initialValue);
    }, [initialValue]);

  const [selectedMonth, setSelectedMonth] = useState('');

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <span>
      <select id="month" value={selectedMonth} onChange={handleChange} className={"border-[1px] mt-[5px] w-[38%] items-center h-[70%]"}>
        <option value="">Select a month</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </span>
  );
};

export default MonthDropdown;