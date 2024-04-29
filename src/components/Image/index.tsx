// @ts-nocheck
import React, { useRef, useState } from "react";
import "./CustomSlider.css"; // Import custom styles for the slider

const CustomSlider = ({ images, clickHandler, onDragStart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const slidesToShow = 2;

  const handleNext = () => {
    if (currentIndex < images.length - slidesToShow) {
      setCurrentIndex(currentIndex + slidesToShow);
      sliderRef.current.style.transform = `translateX(-${
        (currentIndex + slidesToShow) * (100 / slidesToShow)
      }%)`;
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - slidesToShow);
      sliderRef.current.style.transform = `translateX(-${
        (currentIndex - slidesToShow) * (100 / slidesToShow)
      }%)`;
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index * slidesToShow);
    sliderRef.current.style.transform = `translateX(-${index * 50}%)`;
  };

  return (
    <div className="custom-slider">
      <div className="prev-button-container">
        <button onClick={handlePrev} className="prev-button">
          &lt;
        </button>
      </div>
      <div className="slider-wrapper">
        <div className="slider" ref={sliderRef}>
          {images.map((img, index) => (
            <div
              key={index}
              className="slide"
              onClick={() => clickHandler(img)}
              onDragStart={(e) => onDragStart(e, img)}
              draggable
            >
              <img src={img} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="next-button-container">
        <button onClick={handleNext} className="next-button">
          &gt;
        </button>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={
              index * slidesToShow === currentIndex ? "dot active" : "dot"
            }
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;
