import React, { useState, useEffect } from 'react';

const FadeAlert = ({ text, trigger, onHide }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger == true) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onHide(); // Reset the trigger
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onHide]);

  return (
    <>
      {visible && (
        <div className="top-10 transform bg-red-500 text-white text-sm transition-opacity duration-500 ease-out">
          {text}
        </div>
      )}
    </>
  );
};

export default FadeAlert;
