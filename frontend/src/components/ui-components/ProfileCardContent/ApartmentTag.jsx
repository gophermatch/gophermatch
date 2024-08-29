import React, { useRef, useEffect } from "react";

export default function ApartmentTag({ value, text, id, editing, toggleFunction }) {
  const buttonRef = useRef(null);

  const resizeFont = () => {
    if (buttonRef.current) {
      const parentHeight = buttonRef.current.clientHeight;
      const fontSize = parentHeight * 0.5; // Adjust this multiplier as needed
      buttonRef.current.style.fontSize = `${fontSize}px`;
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(resizeFont);
    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    resizeFont(); // Ensure the font size is set correctly on mount

    return () => {
      observer.disconnect(); // Clean up the observer on unmount
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      {value || editing ? (
        editing ? (
          <button
            ref={buttonRef}
            onClick={() => {
              toggleFunction(id);
            }}
            className={`rounded-full m-0 px-3 h-full flex items-center justify-center border-solid border-2 text-white ${
              value
                ? "border-maroon bg-maroon hover:border-dark_maroon hover:bg-dark_maroon"
                : "bg-inactive_gray border-inactive_gray hover:bg-dark_inactive_gray hover:border-dark_inactive_gray"
            } active:border-white`}
          >
            {text}
          </button>
        ) : (
          <div
            ref={buttonRef}
            className={`rounded-full m-0 px-3 h-full flex items-center justify-center border-solid border-2 text-xs text-white ${
              value ? "border-maroon bg-maroon" : "bg-inactive_gray border-inactive_gray"
            }`}
          >
            {text}
          </div>
        )
      ) : null}
    </div>
  );
}
