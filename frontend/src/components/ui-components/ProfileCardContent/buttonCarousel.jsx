import React, { useRef, useEffect } from 'react';
import styles from '../../../assets/css/signin.module.css'; // Adjust the path as necessary

const ButtonCarousel = ({ totalButtons, activeIndex, onButtonClick }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      const buttonWidth = 40; // Width of each button including margin
      const carouselWidth = carouselRef.current.offsetWidth;
      const buttonsPerView = 5; // Total number of buttons in view (including active)
      const middleIndex = Math.floor(buttonsPerView / 2);
      const offset = Math.max(0, activeIndex - middleIndex);
      const maxOffset = Math.max(0, totalButtons - buttonsPerView);

      carouselRef.current.style.transform = `translateX(-${Math.min(offset * buttonWidth, maxOffset * buttonWidth)}px)`;
    }
  }, [activeIndex, totalButtons]);

  return (
    <div className={styles['button-carousel']}>
      <div className={styles['carousel-inner']} ref={carouselRef}>
        {Array.from({ length: totalButtons }).map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.active : styles.inactive}`}
            onClick={() => onButtonClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ButtonCarousel;
