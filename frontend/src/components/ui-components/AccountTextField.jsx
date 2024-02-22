import buttonStyles from '../../assets/css/sliderbutton.module.css'
import React from "react";
import { DateTime } from "luxon";

function AccountTextField(props)
{
  let placeholder = props.placeholder;

  function OnInvalidDate(){
    alert("Please enter a valid date!")
  }

  const handleChange = (event) => {

    let val = event.target.value;

    let len = val.length;

    // Check if the length of the input value exceeds the maxLength
    if (len >= props.maxLength) {
      val = val.substring(0, props.maxLength);
    }


    // Validate date input to conform to MM/DD/YY
    if(props.isDate)
    {
      let splitAtSlash = val.split("/");

      let validDate = DateTime.fromFormat(val, "M/dd/yy").isValid;

      if(val.length > 6) {
        //If they skipped the 0 in month...
        if (splitAtSlash.length === 3 && val[1] === "/") {
          if (!validDate) {
            props.valueSetter("");
            OnInvalidDate();
            return;
          }
        } else if(val.length > 7) {
          if (!validDate) {
            props.valueSetter("");
            OnInvalidDate();
            return;
          }
        }
      }
    }

    props.valueSetter(val);
  };

  return (
    <input onKeyUp={props.enterKeyPress} tabIndex={props.curPageNum === props.visPageNum ? 1 : -1} type="text" value={props.fieldValue}
             placeholder={placeholder}
             onChange={(event) => handleChange(event)}
             className={`text-maroon_new w-90 rounded-md mt-${props.topMargin} p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black`} />
      )
}

AccountTextField.props = {
  isDate: false,
};

export default AccountTextField;