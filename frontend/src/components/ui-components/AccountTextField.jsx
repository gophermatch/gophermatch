import buttonStyles from '../../assets/css/sliderbutton.module.css'
import React from "react";

function AccountTextField(props)
{
  const handleChange = (event) => {

    let val = event.target.value;

    // Check if the length of the input value exceeds the maxLength
    if (val.length >= props.maxLength) {
      val = val.substring(0, props.maxLength);
    }

    // if(props.isDate)
    // {
    //   const dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    //
    //   let len = val.length;
    //
    //   console.log(dateFormat.test(val))
    //
    //   if(!dateFormat.test(val)){
    //     props.valueSetter(val.slice(0,-1));
    //     return;
    //   }
    // }

    props.valueSetter(val);
  };

  return (
    <input onKeyUp={props.enterKeyPress} tabIndex={props.curPageNum === props.visPageNum ? 1 : -1} type="text" value={props.fieldValue}
             placeholder={props.placeholder}
             onChange={(event) => handleChange(event)}
             className={`text-maroon_new w-90 rounded-md mt-${props.topMargin} p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black`} />
      )
}

AccountTextField.props = {
  isDate: false,
};

export default AccountTextField;