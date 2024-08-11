import './apartmentStyles.css';

const NumericTextbox = ({ value, min, max, placeholder, wide, onChange }) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue === '' || (!isNaN(newValue) && parseInt(newValue) >= min && parseInt(newValue) <= max)) {
      onChange(newValue === '' ? '' : parseInt(newValue, 10)); // Allow empty values to be passed
    }
  };

  return (
    <input
      id="textInput"
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      className={`${wide ? 'w-[40%]' : 'w-[18%]'} h-[80%] mt-1 py-1 text-center border rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-maroon`}
      placeholder={placeholder}
      style={{
        WebkitAppearance: 'none',
        MozAppearance: 'none'
      }}
    />
  );
};

export default NumericTextbox;
