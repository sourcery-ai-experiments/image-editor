// @ts-nocheck
import React, { useRef, useState } from 'react';
import './CustomSlider.css';

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
		<div id='custom-slider' className='custom-slider'>
			<div className='prev-button-container'>
				<button onClick={handlePrev} className='prev-button'>
					&lt;
				</button>
			</div>
			<div className='slider-wrapper'>
				<div className='slider' ref={sliderRef}>
					{images?.map((img, index) => {
						if (img !== 'https://api-posticle.maxenius.com/undefined') {
							return (
								<div
									key={index}
									className='slide'
									onClick={() => clickHandler(img)}
									onDragStart={(e) => onDragStart(e, img)}
									draggable
								>
									<img src={img} alt={`Slide ${index}`} />
								</div>
							);
						}
						return null;
					})}
				</div>
			</div>
			<div className='next-button-container'>
				<button onClick={handleNext} className='next-button'>
					&gt;
				</button>
			</div>
			<div className='dots'>
				{images?.map((_, index) => (
					<span
						key={index}
						className={
							index * slidesToShow === currentIndex ? 'dot active' : 'dot'
						}
						onClick={() => handleDotClick(index)}
					></span>
				))}
			</div>
		</div>
	);
};

export default CustomSlider;

// import { Box, ImageList, ImageListItem } from '@mui/material';
// import { Diptych } from '../../types';
// import './CustomSlider.css';

// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// interface Props {
// 	images: { name: string; url: string }[];
// 	clickHandler: (url: string) => void;
// 	children?: React.ReactNode;
// }
// const ImageViewer = ({ images, clickHandler, children }: Props) => {
// 	var settings = {
// 		dots: true,
// 		infinite: false,
// 		speed: 500,
// 		slidesToShow: 2,
// 		slidesToScroll: 2,
// 		initialSlide: 0,
// 		responsive: [
// 			{
// 				breakpoint: 1024,
// 				settings: {
// 					slidesToShow: 2,
// 					slidesToScroll: 2,
// 					infinite: true,
// 					dots: true,
// 				},
// 			},
// 			{
// 				breakpoint: 600,
// 				settings: {
// 					slidesToShow: 2,
// 					slidesToScroll: 2,
// 					initialSlide: 1,
// 				},
// 			},
// 			{
// 				breakpoint: 480,
// 				settings: {
// 					slidesToShow: 2,
// 					slidesToScroll: 2,
// 				},
// 			},
// 		],
// 	};

// 	const evenImages = images.filter((_, index) => index % 2 === 0);
// 	// console.log('🚀 ~ ImageViewer ~ evenImages:', evenImages);
// 	const oddImages = images.filter((_, index) => index % 2 !== 0);

// 	return (
// 		<Box>
// 			{children}
// 			<Slider {...settings}>
// 				{images.map((img) => {
// 					return (
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								justifyContent: 'center',
// 								alignItems: 'center',
// 								gap: 2,
// 							}}
// 							className='slider-container'
// 							key={img}
// 						>
// 							<Box
// 								sx={{
// 									display: 'flex',
// 									justifyContent: 'center',
// 									alignItems: 'center',
// 									height: '150px',
// 									margin: '4px',
// 								}}
// 							>
// 								<img
// 									style={{
// 										cursor: 'pointer',
// 										height: '100%',
// 										width: '100%',
// 										borderRadius: '10px',
// 									}}
// 									onClick={() => clickHandler(img)}
// 									srcSet={`${img}`}
// 									src={`${img}`}
// 									loading='lazy'
// 								/>
// 							</Box>
// 						</Box>
// 					);
// 				})}
// 			</Slider>
// 			<br />
// 			<br />
// 		</Box>
// 	);
// };

// export default ImageViewer;
