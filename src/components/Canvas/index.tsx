// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Typography, Box, IconButton, Stack, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styles, useStyles } from './index.style';
import ImageViewer from '../Image';
import { IEvent, IRectOptions } from 'fabric/fabric-impl';
import { canvasDimension } from '../../constants';
import CustomColorPicker from '../colorPicker';
import { Template } from '../../types';
import DeselectIcon from '@mui/icons-material/Deselect';
import {
	createSwipeGroup,
	createTextBox,
	updateSwipeColor,
	updateTextBox,
} from '../../utils/TextHandler';
import { updateRect } from '../../utils/RectHandler';
import { saveImage, saveJSON } from '../../utils/ExportHandler';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	createImage,
	createImageLogo,
	updateImageSource,
} from '../../utils/ImageHandler';
import { useCanvasContext } from '../../context/CanvasContext';
import FontsTab from '../Tabs/EditText/FontsTab';
import {
	createHorizontalCollage,
	createVerticalCollage,
	updateHorizontalCollageImage,
	updateVerticalCollageImage,
} from '../../utils/CollageHandler';
import { activeTabs } from '../../types/context';
import FlipIcon from '@mui/icons-material/Flip';
import {
	createBubbleElement,
	updateBubbleElement,
} from '../../utils/BubbleHandler';
import { debounce } from 'lodash';

import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';

interface CanvasProps {
	template: Template;
	updatedSeedData: Record<string, any>;
}

interface FilterState {
	overlay: number;
	text: string;
	fontSize: number;
	color: string;
	fontFamily: string;
	fontWeight: number;
	charSpacing: number;
}

const toolbars = ['background', 'title', 'bubble', 'element', 'writePost'];
const filter =
	'brightness(0) saturate(100%) invert(80%) sepia(14%) saturate(1577%) hue-rotate(335deg) brightness(108%) contrast(88%)';

const Canvas: React.FC<CanvasProps> = React.memo(
	({ updatedSeedData, template }) => {
		const { borders, elements, backgroundImages, logos, texts, bubbles } =
			updatedSeedData;
		const {
			canvas,
			activeTab,
			updateActiveTab,
			updateCanvasContext,
			getExistingObject,
		} = useCanvasContext();
		const [activeButton, setActiveButton] = useState('Overlay');
		const [show, setShow] = useState('font');
		const canvasEl = useRef<HTMLCanvasElement>(null);
		const [selectedFilter] = useState<string>('');
		const [dropDown, setDropDown] = useState(true);
		const [filtersRange, setFiltersRange] = useState({
			brightness: 0,
			contrast: 0,
		});

		const { userMetaData, updateIsUserMetaExist, updateUserMetaData } =
			useCanvasContext();
		console.log('🚀 ~ userMetaData:', userMetaData?.company?.name);
		const [canvasToolbox, setCanvasToolbox] = useState({
			activeObject: null,
			isDeselectDisabled: true,
		});
		const [initialData, setInitialData] = useState({
			backgroundImages,
			bubbles,
			elements: [elements, borders],
		});

		const [overlayTextFiltersState, setOverlayTextFiltersState] =
			useState<FilterState>({
				overlay: 0.6,
				text: updatedSeedData.texts[0],
				fontSize: 16,
				color: '#fff',
				fontFamily: 'Fira Sans',
				fontWeight: 500,
				charSpacing: 1,
			});

		const [overlayTextFiltersState1, setOverlayTextFiltersState1] =
			useState<FilterState>({
				color: 'red',
			});
		console.log(
			'overlayTextFiltersState1.color',
			overlayTextFiltersState1.color
		);
		const [filterValues, setFilterValues] = useState({
			overlayText: {
				overlay: 0.6,
				text: '',
				fontSize: 16,
				color: '#fff',
				fontFamily: 'Fira Sans',
			},
			overlay: {
				imgUrl: template.overlayImage,
				opacity: template.opacity,
			},
			bubble: {
				image: '',
				strokeWidth: 10,
				stroke: '#fff',
			},
			collage: {
				strokeWidth: 3,
				stroke: '#ffffff',
			},
		});

		const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
			{
				name: 'grayscale',
				filter: new fabric.Image.filters.Grayscale({ grayscale: 1 }),
			},
			{ name: 'sepia', filter: new fabric.Image.filters.Sepia({ sepia: 1 }) },
			{
				name: 'invert',
				filter: new fabric.Image.filters.Invert({ invert: 1 }),
			},
			{
				name: 'sharpen',
				filter: new fabric.Image.filters.Convolute({
					matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
				}),
			},

			// Add more filters as needed
		];

		const classes = useStyles();
		const canvasInstanceRef = useRef(null);
		useEffect(() => {
			const options = {
				width: canvasDimension.width,
				height: canvasDimension.height,
				renderOnAddRemove: false,
				preserveObjectStacking: true,
				selection: true, // Enable text selection
			};
			const canvas = new fabric.Canvas(canvasEl.current, options);
			canvasInstanceRef.current = canvas;
			// make the fabric.Canvas instance available to your app
			updateCanvasContext(canvas);

			// Event listener for mouse click
			canvas.on('mouse:down', handleMouseDown);

			function handleMouseDown(event) {
				const selectedObject = event.target;

				if (selectedObject && selectedObject.type === 'textbox') {
					const selectionStart = selectedObject.selectionStart;
					const selectionEnd = selectedObject.selectionEnd;

					if (selectionStart !== selectionEnd) {
						const fill = overlayTextFiltersState1.color;
						console.log('🚀  fill:', fill);
						selectedObject.setSelectionStyles(
							{ fill },
							selectionStart,
							selectionEnd
						);
						canvas.renderAll();
					}
				}
			}

			return () => {
				updateCanvasContext(null);
				canvas.dispose();
			};
		}, []);

		// useEffect(() => {
		// 	const options = {
		// 		width: canvasDimension.width,
		// 		height: canvasDimension.height,
		// 		renderOnAddRemove: false,
		// 		preserveObjectStacking: true,
		// 		selection: true, // Enable text selection
		// 	};
		// 	const canvas = new fabric.Canvas(canvasEl.current, options);
		// 	canvasInstanceRef.current = canvas;
		// 	// make the fabric.Canvas instance available to your app
		// 	updateCanvasContext(canvas);

		// 	// Event listener for mouse click
		// 	canvas.on('mouse:down', handleMouseDown);

		// 	function handleMouseDown(event) {
		// 		const selectedObject = canvas.getActiveObject();

		// 		console.log('🚀  selectedObject:', selectedObject);
		// 		console.log('🚀  selectedObject Type:', selectedObject.type);
		// 		console.log('selectedObject.text:', selectedObject.text);

		// 		if (selectedObject && selectedObject.type === 'textbox') {
		// 			selectedObject.set('fill', '#ff0000');
		// 			canvas.renderAll();
		// 		}
		// 	}

		// 	return () => {
		// 		updateCanvasContext(null);
		// 		canvas.dispose();
		// 	};
		// }, []);

		// useEffect(() => {
		// 	const options = {
		// 		width: canvasDimension.width,
		// 		height: canvasDimension.height,
		// 		renderOnAddRemove: false,
		// 		preserveObjectStacking: true,
		// 	};
		// 	const canvas = new fabric.Canvas(canvasEl.current, options);
		// 	canvasInstanceRef.current = canvas;
		// 	// make the fabric.Canvas instance available to your app
		// 	updateCanvasContext(canvas);

		// 	canvas.on('selection:created', function (e) {
		// 		console.log('----run----', e);
		// 		if (e.target.type === 'textbox') {
		// 			e.target.set('fill', 'red');
		// 			console.log('----run program----');

		// 			canvas.renderAll();
		// 		}
		// 	});

		// 	return () => {
		// 		updateCanvasContext(null);
		// 		canvas.dispose();
		// 	};
		// }, []);

		const handleButtonClick = (buttonType: string) =>
			setActiveButton(buttonType);

		// const loadCanvas = useCallback(async () => {
		// 	function importLocale(locale: string) {
		// 		return import(`../../constants/templates/${locale}.json`);
		// 	}

		// 	const templateJSON = await importLocale(template.filePath);

		// 	// Load canvas JSON template without adding default images
		// 	await new Promise((resolve) => {
		// 		canvas?.loadFromJSON(templateJSON, () => {
		// 			resolve(null);
		// 		});
		// 	});
		// }, [canvas, template]);

		const loadCanvas = useCallback(async () => {
			function importLocale(locale: string) {
				return import(`../../constants/templates/${locale}.json`);
			}

			const templateJSON = await importLocale(template.filePath);

			const img1 = '/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg';
			const img2 = '/images/sample/scott-circle-image.png';

			// const img1 = '';
			// const img2 = '';

			// Load canvas JSON template
			await new Promise((resolve) => {
				canvas?.loadFromJSON(templateJSON, () => {
					// if (template.diptych === 'horizontal')
					// 	createHorizontalCollage(canvas, [img1, img2]);
					// else if (template.diptych === 'vertical')
					// 	createVerticalCollage(canvas, [img1, img2]);
					resolve(null);
				});
			});
		}, [canvas, template]);

		useEffect(() => {
			loadCanvas();

			const handleCanvasUpdate = () => {
				const activeObject = canvas?.getActiveObject();
				const isSelectionCleared = canvas?._activeObject === null;

				return setCanvasToolbox((prev) => ({
					...prev,
					isDeselectDisabled: isSelectionCleared,
					activeObject,
				}));
			};

			const handleMouseDown = (options: IEvent<Event>) => {
				if (options.target) {
					const thisTarget = options.target as fabric.Object;
					const mousePos = canvas?.getPointer(options.e) || { x: 0, y: 0 };

					if (thisTarget.isType('group')) {
						thisTarget.forEachObject((object: any) => {
							if (object.type === 'textbox') {
								const matrix = thisTarget.calcTransformMatrix();
								const newPoint = fabric.util.transformPoint(
									{ y: object.top, x: object.left },
									matrix
								);
								const objectPos = {
									xStart: newPoint.x - (object.width * object.scaleX) / 2,
									xEnd: newPoint.x + (object.width * object.scaleX) / 2,
									yStart: newPoint.y - (object.height * object.scaleY) / 2,
									yEnd: newPoint.y + (object.height * object.scaleY) / 2,
								};

								if (
									mousePos.x >= objectPos.xStart &&
									mousePos.x <= objectPos.xEnd &&
									mousePos.y >= objectPos.yStart &&
									mousePos.y <= objectPos.yEnd
								) {
									handleGroupClick(thisTarget, object);
								}
							}
						});
					}
				}
			};

			const handleGroupClick = (group: any, textObject: any) => {
				let groupItems: any;

				const ungroup = () => {
					groupItems = group._objects;
					group._restoreObjectsState();
					canvas?.remove(group);

					groupItems.forEach((item: any) => {
						if (item !== textObject) {
							item.selectable = false;
						}
						canvas?.add(item);
					});

					canvas?.renderAll();
				};

				ungroup();

				canvas?.setActiveObject(textObject);
				textObject.enterEditing();
				textObject.selectAll();

				let exitEditing = true;

				textObject.on('editing:exited', () => {
					if (exitEditing) {
						const items: any[] = [];
						groupItems.forEach((obj: any) => {
							items.push(obj);
							canvas?.remove(obj);
						});

						const grp = new fabric.Group(items, {
							customType: 'swipeGroup',
						});
						canvas?.add(grp);
						exitEditing = false;
					}
				});
			};
			canvas?.on('mouse:down', handleMouseDown);
			// Attach canvas update listeners
			// canvas?.on('mouse:down', handleMouseClick);
			canvas?.on('selection:created', handleCanvasUpdate);
			canvas?.on('selection:updated', handleCanvasUpdate);
			canvas?.on('selection:cleared', handleCanvasUpdate);

			// Cleanup the event listeners when the component unmounts
			return () => {
				// canvas?.on('mouse:down', handleMouseClick);
				canvas?.off('selection:created', handleCanvasUpdate);
				canvas?.off('selection:updated', handleCanvasUpdate);
				canvas?.off('selection:cleared', handleCanvasUpdate);
			};
		}, [loadCanvas]);

		const updateBubbleImage = (
			imgUrl: string | undefined,
			filter?: { strokeWidth: number; stroke: string }
		) => {
			const existingBubbleStroke = getExistingObject('bubbleStroke');

			if (!canvas) {
				console.error('Canvas Not initialized');
				return;
			}

			if (filter && !imgUrl && existingBubbleStroke) {
				const newOptions: fabric.ICircleOptions = {
					stroke: filter?.stroke || 'blue',
					strokeWidth: filter?.strokeWidth || 15,
					// Add any other options you want to update
				};
				updateBubbleElement(canvas, existingBubbleStroke, newOptions);
				canvas.renderAll();
			} else {
				let options: fabric.ICircleOptions = {
					...existingBubbleStroke,
					...(!existingBubbleStroke &&
						template.diptych === 'horizontal' && { top: 150 }),
					...(!existingBubbleStroke &&
						template.diptych === 'horizontal' && { left: 150, radius: 80 }),
				};
				requestAnimationFrame(() => {
					createBubbleElement(canvas!, imgUrl!, options);
					canvas.renderAll();
				});
			}
		};

		/**
		 * Updates the background filters of the canvas.
		 * @param {IBaseFilter} filter - The filter to be applied to the background image.
		 * @return {void} This function does not return anything.
		 */

		const updateBackgroundFilters = debounce(
			(filter: fabric.IBaseFilter, type: string): void => {
				if (!canvas) return;

				const bgImages = ['bg-1'];

				if (!template.backgroundImage) bgImages.push('bg-2');

				for (const customType of bgImages) {
					const existingObject: fabric.Image | undefined = getExistingObject(
						customType
					) as fabric.Image;
					if (existingObject) {
						const hasBrightnessOrContrast =
							filter.hasOwnProperty('brightness') ||
							filter.hasOwnProperty('contrast');

						const index: number | undefined = existingObject.filters?.findIndex(
							(fil) => fil[type as any]
						);

						if (type === 'sharpen') {
							// Check if sharpen filter is already applied
							const sharpenIndex = existingObject.filters?.findIndex(
								(fil) => fil instanceof fabric.Image.filters.Convolute
							);
							if (sharpenIndex !== -1) {
								// Remove sharpen filter
								existingObject.filters?.splice(sharpenIndex, 1);
							} else {
								// Add sharpen filter
								existingObject.filters?.push(filter);
							}
						} else if (index !== -1) {
							existingObject.filters?.splice(index as number, 1, filter);
							if (!hasBrightnessOrContrast)
								existingObject.filters?.splice(index as number, 1);
						} else {
							existingObject.filters?.push(filter);
						}
						existingObject.applyFilters();
						canvas.renderAll();
					}
				}
			},
			200
		);
		// const updateBackgroundFilters = debounce(
		// 	(filter: fabric.IBaseFilter, type: string): void => {
		// 		if (!canvas) return;

		// 		const bgImages = ['bg-1'];

		// 		if (!template.backgroundImage) bgImages.push('bg-2');

		// 		for (const customType of bgImages) {
		// 			const existingObject: fabric.Image | undefined = getExistingObject(
		// 				customType
		// 			) as fabric.Image;
		// 			if (existingObject) {
		// 				const hasBrightnessOrContrast =
		// 					filter.hasOwnProperty('brightness') ||
		// 					filter.hasOwnProperty('contrast');

		// 				const index: number | undefined = existingObject.filters?.findIndex(
		// 					(fil) => fil[type as any]
		// 				);

		// 				if (index !== -1) {
		// 					existingObject.filters?.splice(index as number, 1, filter);
		// 					if (!hasBrightnessOrContrast)
		// 						existingObject.filters?.splice(index as number, 1);
		// 				} else {
		// 					existingObject.filters?.push(filter);
		// 				}
		// 				existingObject.applyFilters();
		// 				canvas.renderAll();
		// 			}
		// 		}
		// 	},
		// 	200
		// );

		//grid add
		const [isSelected, setIsSelected] = useState(false);
		//---------------------------------Canvas---------------------------------------------

		//------------------ canvas grid --------------------------------
		// useEffect(() => {
		// 	if (!canvasEl.current) return;

		// 	const canvas = new fabric.Canvas(canvasEl.current, {
		// 		selection: false,
		// 		// height: window.innerHeight,
		// 		// width: window.innerWidth,
		// 		width: 545,
		// 	});

		// 	const drawGrid = () => {
		// 		const options = {
		// 			distance: 10,
		// 			// width: canvas.width,
		// 			// height: canvas.height,
		// 			width: 542,
		// 			// height: 1200,
		// 			param: {
		// 				stroke: '#ebebeb',
		// 				strokeWidth: 1,
		// 				selectable: false,
		// 			},
		// 		};

		// 		const gridLen = options.width / options.distance;

		// 		for (let i = 0; i < gridLen; i++) {
		// 			const distance = i * options.distance;
		// 			const horizontal = new fabric.Line(
		// 				[distance, 0, distance, options.width],
		// 				options.param
		// 			);
		// 			const vertical = new fabric.Line(
		// 				[0, distance, options.width, distance],
		// 				options.param
		// 			);
		// 			canvas.add(horizontal);
		// 			canvas.add(vertical);
		// 			if (i % 5 === 0) {
		// 				horizontal.set({ stroke: '#cccccc' });
		// 				vertical.set({ stroke: '#cccccc' });
		// 			}
		// 		}
		// 	};

		// 	if (isSelected) {
		// 		drawGrid();
		// 	}

		// 	return () => {
		// 		canvas.clear();
		// 	};
		// }, [isSelected]);

		// const [imagePath, setImagePath] = useState<string>('');

		// useEffect(() => {
		// 	if (!canvasEl.current) return;

		// 	const canvas = new fabric.Canvas(canvasEl.current, {
		// 		selection: false,
		// 		width: 542, // Initial width
		// 		height: 660,
		// 		backgroundColor: 'rgba(0, 0, 0, 0)',
		// 	});

		// 	const drawGrid = () => {
		// 		const options = {
		// 			distance: 10,
		// 			width: 675,
		// 			height: 650,
		// 			param: {
		// 				stroke: '#ebebeb',
		// 				strokeWidth: 1,
		// 				selectable: false,
		// 				zIndex: 100,
		// 			},
		// 		};

		// 		const gridLen = options.width / options.distance;

		// 		for (let i = 0; i < gridLen; i++) {
		// 			const distance = i * options.distance;
		// 			const horizontal = new fabric.Line(
		// 				[distance, 0, distance, options.height],
		// 				options.param
		// 			);
		// 			const vertical = new fabric.Line(
		// 				[0, distance, options.width, distance],
		// 				options.param
		// 			);
		// 			canvas.add(horizontal);
		// 			canvas.add(vertical);
		// 			if (i % 5 === 0) {
		// 				horizontal.set({ stroke: '#cccccc' });
		// 				vertical.set({ stroke: '#cccccc' });
		// 			}
		// 		}

		// 		requestAnimationFrame(() => {
		// 			canvas.renderAll();
		// 		});
		// 		// canvas.renderAll(); // Render grid
		// 	};

		// 	if (isSelected) {
		// 		drawGrid();
		// 	} else {
		// 		canvas.clear(); // Clear grid
		// 	}

		// 	return () => {
		// 		canvas.dispose(); // Dispose canvas
		// 	};
		// }, [isSelected]);

		function draw_grid(canvasRef, grid_size) {
			const canvas = canvasRef.current;
			if (!canvas) return; // Check if canvasRef is valid

			const ctx = canvas.getContext('2d');
			const currentCanvasWidth = canvas.width;
			const currentCanvasHeight = canvas.height;

			// Drawing vertical lines
			let x;
			for (x = 0; x <= currentCanvasWidth; x += grid_size) {
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, currentCanvasHeight);
			}

			// Drawing horizontal lines
			let y;
			for (y = 0; y <= currentCanvasHeight; y += grid_size) {
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(currentCanvasWidth, y + 0.5);
			}

			ctx.strokeStyle = '#ebebeb';
			ctx.stroke();
		}

		function hideGrid(canvasRef, originalImage) {
			const canvas = canvasRef.current;
			if (!canvas || !originalImage) return;

			const ctx = canvas.getContext('2d');
			const currentCanvasWidth = canvas.width;
			const currentCanvasHeight = canvas.height;

			// Clear the canvas by filling it with the background color or any content you want
			ctx.clearRect(0, 0, currentCanvasWidth, currentCanvasHeight);
		}

		const darw_Grid_btn = () => {
			if (canvasEl.current) {
				draw_grid(canvasEl, 15);
			}
		};

		const toggleSelection = () => {
			setIsSelected(!isSelected);
			if (isSelected) {
				darw_Grid_btn();
			} else {
				hideGrid(canvasEl, 15);
			}
		};

		//------------------------------------------------------------------------------------
		// const toggleSelection = () => {
		// 	setIsSelected(!isSelected);

		// 	if (isSelected) {
		// 		alert(`Selected`);
		// 	} else {
		// 		alert(`Not Selected`);
		// 	}
		// };
		//old code
		const updateBackgroundImage = debounce((imageUrl: string) => {
			if (!canvas) return;

			let activeObject: fabric.Object | undefined | null =
				canvas.getActiveObject() || getExistingObject('bg-1');

			if (!template.backgroundImage && !canvas.getActiveObject()) {
				let currentImageIndex = initialData.backgroundImages?.findIndex(
					(bgImage: string) => bgImage === imageUrl
				);
				activeObject = getExistingObject(
					currentImageIndex % 2 === 0 ? 'bg-1' : 'bg-2'
				);
			}

			let currentImageIndex = initialData.backgroundImages?.findIndex(
				(bgImage: string) => bgImage === imageUrl
			);

			if (!activeObject) {
				if (template.diptych === 'horizontal') {
					// createHorizontalCollage(canvas, [imageUrl, imageUrl]);
					if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
						createHorizontalCollage(canvas, [imageUrl, null]);
					} else if (
						currentImageIndex !== undefined &&
						currentImageIndex % 2 !== 0
					) {
						createHorizontalCollage(canvas, [null, imageUrl]);
					}
				} else if (template.diptych === 'vertical') {
					// createVerticalCollage(canvas, [imageUrl, imageUrl]);
					if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
						createVerticalCollage(canvas, [imageUrl, null]);
					} else if (
						currentImageIndex !== undefined &&
						currentImageIndex % 2 !== 0
					) {
						createVerticalCollage(canvas, [null, imageUrl]);
					}
					return;
				}
			}
			if (!activeObject) return console.log('Still Object not found');

			if (template.backgroundImage || !template.diptych)
				updateImageSource(canvas, imageUrl, activeObject);
			else if (template.diptych === 'vertical')
				updateVerticalCollageImage(canvas, imageUrl, activeObject);
			else updateHorizontalCollageImage(canvas, imageUrl, activeObject);
		}, 100);

		const updateOverlayImage = debounce((image: string, opacity: number) => {
			if (!canvas) {
				console.log('Canvas not loaded yet');
				return;
			}
			const existingObject = getExistingObject('overlay');

			const canvasWidth: number | undefined = canvas.width;
			const canvasHeight: number | undefined = canvas.height;

			if (!canvasWidth || !canvasHeight) return;

			if (existingObject) {
				existingObject.animate(
					{ opacity: opacity },
					{
						duration: 200,
						onChange: canvas.renderAll.bind(canvas),
					}
				);
				if (opacity === 0) {
					setTimeout(() => {
						canvas.remove(existingObject);
					}, 100);
				}

				return;
			} else {
				fabric.Image.fromURL(
					image,
					function (img) {
						img.scaleToWidth(canvas.width || 0);
						img.scaleToHeight(canvas.height || 0);

						img.set({
							opacity: +opacity || 1,
							selectable: false,
							perPixelTargetFind: false,
							evented: false,
						});

						img.customType = 'overlay';

						canvas.insertAt(img, 3, false);
						requestAnimationFrame(() => {
							canvas.renderAll();
						});
					},
					{
						crossOrigin: 'anonymous',
					}
				);
			}
		}, 100);

		const updateRectangle = (options: IRectOptions) => {
			if (!canvas) return;

			const existingObject = getExistingObject('photo-border');

			if (existingObject)
				updateRect(existingObject, {
					...options,
					top: existingObject?.top,
					left: existingObject.left,
					customType: 'photo-border',
				});
			canvas.requestRenderAll();
		};

		/**
		 * Uploads an image and updates the initial data.
		 * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by the input element.
		 * @param {keyof typeof initialData} field - The field in the initialData object to update.
		 * @return {void} This function does not return a value.
		 */
		const uploadImage = (
			event: React.ChangeEvent<HTMLInputElement>,
			field: keyof typeof initialData
		): void => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			setInitialData((prev) => ({
				...prev,
				[field]: [URL.createObjectURL(files[0]), ...prev[field]],
			}));
		};

		const deselectObj = () => {
			canvas?.discardActiveObject();
			canvas?.renderAll();

			requestAnimationFrame(() => {
				setCanvasToolbox((prev) => ({
					...prev,
					activeObject: null,
					isDeselectDisabled: true,
				}));
			});
		};

		const deleteActiveSelection = () => {
			if (!canvas) return;
			canvas.remove(canvas._activeObject);
			canvas.requestRenderAll();
		};

		const [value, setValue] = React.useState(0);

		const handleChange = (_event: React.SyntheticEvent, newValue: number) =>
			setValue(newValue);

		const flipImage = (flipAxis: 'flipX' | 'flipY' = 'flipX') => {
			const activeObject = canvas?.getActiveObject();
			if (activeObject) {
				activeObject[flipAxis] = !activeObject[flipAxis];
				canvas?.renderAll();
			}
		};

		// useEffect(() => {
		//   const handleClickOutsideCanvas = (event: MouseEvent) => {
		//     const canvasElement = canvasEl.current;
		//     const boundingBox = canvasElement?.getBoundingClientRect();

		//     // Check if the click event coordinates are outside the canvas bounding box
		//     if (
		//       boundingBox &&
		//       (event.clientX < boundingBox.left ||
		//         event.clientX > boundingBox.right ||
		//         event.clientY < boundingBox.top ||
		//         event.clientY > boundingBox.bottom)
		//     ) {
		//       setTimeout(() => {
		//         // Check again after a short delay to allow Fabric.js to handle its events
		//         if (canvas && canvas._activeObject) {
		//           canvas.discardActiveObject();
		//           canvas.renderAll();
		//           setCanvasToolbox((prev) => ({
		//             ...prev,
		//             activeObject: null,
		//             isDeselectDisabled: true,
		//           }));
		//           console.log('Clicked outside the canvas!');
		//         }
		//       }, 0);
		//     }
		//   };

		//   document.addEventListener('mouseup', handleClickOutsideCanvas);

		//   return () => {
		//     // Cleanup: Remove the event listener when the component unmounts
		//     document.removeEventListener('mouseup', handleClickOutsideCanvas);
		//   };
		// }, [canvas]);

		const debouncedUpdateRectangle = debounce((strokeWidth) => {
			if (!canvas) {
				console.log('Canvas not found');
				return;
			}
			const existingObject = getExistingObject('photo-border') as fabric.Rect;

			if (template.diptych === 'horizontal') {
				updateRectangle({
					selectable: true,
					lockMovementX: existingObject.lockMovementX,
					lockMovementY: existingObject.lockMovementY,
					strokeWidth,
					left: canvas?.getWidth() / 2 - strokeWidth / 2,
				});
			} else {
				updateRectangle({
					selectable: true,
					lockMovementX: existingObject.lockMovementX,
					lockMovementY: existingObject.lockMovementY,
					strokeWidth,
					top: canvas?.getHeight() / 2 - strokeWidth / 2,
				});
			}
		}, 100);

		//---------------------Sharpen --------------------------
		const [sharpenApplied, setSharpenApplied] = useState(false);

		//----------------------------------------------------------
		// const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
		// const [selectedText, setSelectedText] = useState<fabric.Object | null>(
		// 	null
		// );

		// // Function to change text color
		// const changeTextColor = (color: string) => {
		// 	if (selectedText instanceof fabric.Textbox) {
		// 		selectedText.set('fill', color);
		// 		canvas?.renderAll();
		// 	}
		// };

		// const [selectedWord, setSelectedWord] = useState<string>('');

		// // Function to handle word selection
		// const handleWordSelect = () => {
		// 	const selection = window.getSelection();
		// 	if (selection) {
		// 		const selectedText = selection.toString().trim();
		// 		setSelectedWord(selectedText);
		// 	}
		// };

		// // Function to change the color of the selected word
		// const changeColor = (color: string) => {
		// 	const paragraph = document.getElementById('paragraph');
		// 	if (!paragraph) return;

		// 	const updatedHTML = paragraph.innerHTML.replace(
		// 		new RegExp(`\\b${selectedWord}\\b`, 'g'),
		// 		`<span style="color: ${color};">${selectedWord}</span>`
		// 	);

		// 	paragraph.innerHTML = updatedHTML;
		// };

		return (
			<div
				style={{
					display: 'flex',
					columnGap: '50px',
					marginTop: 50,
					marginBottom: 50,
					// border: '1px solid red',
				}}
			>
				<div>
					<div
						style={{
							background:
								'repeating-linear-gradient(transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px);',
						}}
					>
						<DeselectIcon
							color={canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'}
							aria-disabled={canvasToolbox.isDeselectDisabled}
							onClick={deselectObj}
						/>

						<DeleteIcon
							color={canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'}
							aria-disabled={canvasToolbox.isDeselectDisabled}
							onClick={deleteActiveSelection}
						/>
						<img
							src='/icons/flipX.svg'
							className={
								!canvasToolbox.isDeselectDisabled ? 'filter-white' : ''
							}
							style={{ width: 25, height: 25, margin: '0 0.3rem' }}
							onClick={() => flipImage('flipX')}
						/>

						<img
							src='/icons/flipY.svg'
							className={
								!canvasToolbox.isDeselectDisabled ? 'filter-white' : ''
							}
							style={{ width: 25, height: 25 }}
							onClick={() => flipImage('flipY')}
						/>
						<GridOnIcon
							color={isSelected ? 'primary' : 'disabled'}
							onClick={darw_Grid_btn}
							sx={{
								px: 1,
								color: 'white',
								cursor: 'pointer',
							}}
						/>
						{/* 
						{isSelected ? (
							<GridOnIcon
								color={isSelected ? 'primary' : 'disabled'}
								onClick={toggleSelection}
								sx={{
									px: 1,
									color: 'white',
									cursor: 'pointer',
								}}
							/>
						) : (
							<GridOffIcon
								color={isSelected ? 'primary' : 'disabled'}
								onClick={toggleSelection}
								sx={{
									color: 'white',
									px: 1,
									cursor: 'pointer',
								}}
							/>
						)} */}
					</div>

					<canvas width='1080' height='1350' ref={canvasEl} />
					{/* <div style={{ position: 'relative' }}>
						<canvas
							style={{
								border: '2px solid red',
								position: 'absolute',
								top: 0,
								left: 0,
							}}
							ref={canvasEl}
						/>
					</div> */}
					{/* Footer Panel  Start*/}
					{activeTab == 'background' && dropDown && (
						<div>
							<Paper className={classes.root}>
								<div className={classes.optionsContainer}>
									<Button
										className={`${classes.button} ${
											activeButton === 'Overlay' && classes.buttonActive
										}`}
										variant='text'
										color='primary'
										onClick={() => handleButtonClick('Overlay')}
									>
										Overlay
									</Button>
									<Button
										className={`${classes.button} ${
											activeButton === 'Brightness' && classes.buttonActive
										}`}
										variant='text'
										color='primary'
										onClick={() => handleButtonClick('Brightness')}
									>
										Brightness
									</Button>
									<Button
										className={`${classes.button} ${
											activeButton === 'Contrast' && classes.buttonActive
										}`}
										variant='text'
										color='primary'
										onClick={() => handleButtonClick('Contrast')}
									>
										Contrast
									</Button>
									<Button
										className={`${classes.button} ${
											activeButton === 'Filters' && classes.buttonActive
										}`}
										variant='text'
										color='primary'
										onClick={() => handleButtonClick('Filters')}
									>
										Filter
									</Button>

									{template.diptych && !template.backgroundImage ? (
										<Button
											className={`${classes.button} ${
												activeButton === 'border' && classes.buttonActive
											}`}
											variant='text'
											color='primary'
											onClick={() => handleButtonClick('border')}
										>
											Border
										</Button>
									) : null}
								</div>
								{activeButton === 'Overlay' && (
									<div className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='Overlay, Brightness, Contrast'
											color='secondary'
											value={filterValues.overlay.opacity}
											min={0}
											onChange={(e: any) => {
												// if (val !== 0) {
												const val = +(+e.target.value).toFixed(2);
												setFilterValues((prev) => ({
													...prev,
													overlay: {
														...prev.overlay,
														opacity: +e.target.value,
													},
												}));

												updateOverlayImage(filterValues.overlay.imgUrl, val);

												// }
											}}
											max={1}
											step={0.02}
											valueLabelDisplay='auto'
										/>
									</div>
								)}

								{activeButton === 'Contrast' && (
									<div className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='Overlay, Brightness, Contrast'
											color='secondary'
											defaultValue={0}
											min={-1}
											value={filtersRange.contrast}
											max={1}
											step={0.01}
											valueLabelDisplay='auto'
											//eslint-disable-next-line
											onChange={(e: any) => {
												let value = +e.target.value;
												setFiltersRange({ ...filtersRange, contrast: value });
												var filter = new fabric.Image.filters.Contrast({
													contrast: value,
												});
												updateBackgroundFilters(filter, 'contrast');
											}}
										/>
									</div>
								)}
								{activeButton === 'Brightness' && (
									<div className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='Overlay, Brightness, Contrast'
											color='secondary'
											defaultValue={0}
											min={-1}
											max={1}
											step={0.01}
											value={filtersRange.brightness}
											valueLabelDisplay='auto'
											onChange={(e: any) => {
												let value = +e.target.value;
												setFiltersRange({ ...filtersRange, brightness: value });
												var filter = new fabric.Image.filters.Brightness({
													brightness: value,
												});

												updateBackgroundFilters(filter, 'brightness');
											}}
										/>
									</div>
								)}
								{activeButton === 'Filters' && (
									<div className={classes.sliderContainer}>
										{availableFilters.map((filter) => (
											<Button
												key={filter.name}
												className={`${classes.button} ${
													selectedFilter === filter.name && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() =>
													updateBackgroundFilters(filter.filter, filter.name)
												}
											>
												{filter.name}
											</Button>
										))}
										{/* {availableFilters.map((filter) => (
											<Button
												key={filter.name}
												className={`${classes.button} ${
													selectedFilter === 'greyscale' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() =>
													updateBackgroundFilters(filter.filter, filter.name)
												}
											>
												{filter.name}
											</Button>
										))} */}
										{/* {availableFilters.map((filter) => (
											<Button
												key={filter.name}
												className={`${classes.button} ${
													selectedFilter === 'greyscale' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() =>
													updateBackgroundFilters(filter.filter, filter.name)
												}
											>
												{filter.name}
											</Button>
										))} */}
									</div>
								)}

								{/* {activeButton === 'Sharpen' && (
									<div className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='Overlay, Brightness, Contrast'
											color='secondary'
											defaultValue={0}
											min={-1}
											value={filtersRange.sharpen}
											max={1}
											step={0.01}
											valueLabelDisplay='auto'
											onChange={(e: any) => {
												let value = +e.target.value;
												setFiltersRange({ ...filtersRange, sharpen: value });
												var filter = new fabric.Image.filters.Convolute({
													matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
												});
												updateBackgroundFilters(filter, 'sharpen');
											}}
										/>
									</div>
								)} */}

								{activeButton === 'border' && (
									<Stack
										width='inherit'
										mx={10}
										spacing={2}
										direction='row'
										sx={{ mb: 1 }}
										alignItems='center'
									>
										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<CustomColorPicker
												value={overlayTextFiltersState.color}
												changeHandler={(color: string) => {
													updateRectangle({
														...filterValues.collage,
														stroke: color,
													});
													setFilterValues((prev) => ({
														...prev,
														collage: { ...prev.collage, stroke: color },
													}));
												}}
											/>
										</Box>
										<Slider
											valueLabelDisplay='auto'
											className={classes.slider}
											min={0}
											max={20}
											aria-label='Volume'
											// value={filterValues.collage.strokeWidth}
											onChange={(_e: any, value) => {
												// const value = +e.target.value;
												setFilterValues((prev) => ({
													...prev,
													collage: { ...prev.collage, strokeWidth: value },
												}));

												debouncedUpdateRectangle(value);
											}}
										/>
									</Stack>
								)}
							</Paper>
						</div>
					)}
					{(activeTab == 'title' || activeTab === 'element') && dropDown && (
						<div>
							<Paper className={classes.root}>
								<Box className={classes.optionsContainer}>
									<Typography
										className={classes.heading}
										onClick={() => setShow('font')}
									>
										Font
									</Typography>
									<Typography
										className={classes.heading}
										onClick={() => setShow('fontWeight')}
									>
										FontWeight
									</Typography>
									<Typography
										className={classes.heading}
										onClick={() => setShow('charSpacing')}
									>
										Spacing
									</Typography>
									<Typography
										className={classes.heading}
										onClick={() => setShow('colors')}
									>
										Colors
									</Typography>
									<Typography
										className={classes.heading}
										onClick={() => setShow('size')}
									>
										Size
									</Typography>

									<Typography
										className={classes.heading}
										onClick={() => setShow('colors1')}
									>
										Text Highlights
									</Typography>
								</Box>

								{show === 'colors' && (
									<Box className={classes.optionsContainer}>
										<CustomColorPicker
											value={overlayTextFiltersState.color}
											changeHandler={(color: string) => {
												updateTextBox(canvas, { fill: color });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													color,
												}));
											}}
										/>
									</Box>
								)}

								{show === 'colors1' && (
									<Box className={classes.optionsContainer}>
										<CustomColorPicker
											value={overlayTextFiltersState1.color}
											changeHandler={(color) => {
												setOverlayTextFiltersState1((prev) => ({
													...prev,
													color,
												}));
											}}
										/>
									</Box>
								)}

								{show === 'fontWeight' && (
									<Box my={2} className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='size'
											color='secondary'
											defaultValue={400}
											value={overlayTextFiltersState.fontWeight}
											min={100}
											max={900}
											onChange={(e: any) => {
												const value = +e.target.value;
												updateTextBox(canvas, { fontWeight: value });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													fontWeight: value,
												}));
											}}
											step={100}
											valueLabelDisplay='auto'
										/>
									</Box>
								)}

								{show === 'size' && (
									<Box my={2} className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='size'
											color='secondary'
											defaultValue={overlayTextFiltersState.fontSize}
											min={10}
											max={48}
											onChange={(e: any) => {
												const value = +e.target.value;
												updateTextBox(canvas, { fontSize: value });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													fontSize: value,
												}));
											}}
											step={1}
											valueLabelDisplay='auto'
										/>
									</Box>
								)}
								{show === 'charSpacing' && (
									<Box my={2} className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='size'
											color='secondary'
											value={overlayTextFiltersState.charSpacing}
											min={-200}
											max={800}
											onChange={(e: any) => {
												const charSpacing = +e.target.value;
												updateTextBox(canvas, { charSpacing });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													charSpacing,
												}));
											}}
											step={1}
											valueLabelDisplay='auto'
										/>
									</Box>
								)}
								{show === 'font' && (
									<FontsTab value={value} handleChange={handleChange} />
								)}
							</Paper>
						</div>
					)}
					{activeTab == 'bubble' && dropDown && (
						<div>
							<Paper className={classes.root}>
								<Box className={classes.optionsContainer}>
									<Typography
										className={classes.heading}
										onClick={() => setShow('colors')}
									>
										Colors
									</Typography>
									<Typography
										className={classes.heading}
										onClick={() => setShow('size')}
									>
										Size
									</Typography>
								</Box>

								{show === 'colors' && (
									<Box className={classes.optionsContainer}>
										<CustomColorPicker
											value={overlayTextFiltersState.color}
											changeHandler={(color: string) => {
												updateBubbleImage(undefined, {
													stroke: color,
													strokeWidth: filterValues.bubble.strokeWidth,
												});
												setFilterValues((prev) => ({
													...prev,
													bubble: { ...prev.bubble, stroke: color },
												}));
											}}
										/>
									</Box>
								)}

								{show === 'size' && (
									<div className={classes.sliderContainer}>
										<Slider
											className={classes.slider}
											aria-label='size'
											color='secondary'
											value={filterValues.bubble.strokeWidth}
											min={1}
											max={40}
											onChange={(e: any) => {
												const value = +e.target.value;
												updateBubbleImage(undefined, {
													stroke: filterValues.bubble.stroke,
													strokeWidth: value,
												});
												setFilterValues((prev) => ({
													...prev,
													bubble: { ...prev.bubble, strokeWidth: value },
												}));
											}}
											step={1}
											valueLabelDisplay='auto'
										/>
									</div>
								)}
							</Paper>
						</div>
					)}
					<Paper
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 0,
							width: '97%',
						}}
						onClick={() => {
							dropDown ? setDropDown(false) : setDropDown(true);
						}}
					>
						{dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
					</Paper>
					<div
						style={{
							display: 'flex',
							marginTop: '16px',
							justifyContent: 'space-between',
						}}
					>
						<button
							style={{
								backgroundColor: 'transparent',
								border: 'none',
							}}
							onClick={() => updateActiveTab('background')}
						>
							<img
								src='/Tab-Icons/background.png'
								width='100'
								height='100'
								style={{
									color: 'white',
									fontSize: '30px',
									filter: activeTab === 'background' ? filter : undefined,
								}}
							/>
						</button>

						<button
							style={{ backgroundColor: 'transparent', border: 'none' }}
							onClick={() => updateActiveTab('title')}
						>
							<img
								src='/Tab-Icons/Edit-Text.png'
								width='100'
								height='100'
								style={{
									color: 'white',
									fontSize: '30px',
									filter: activeTab === 'title' ? filter : undefined,
								}}
							/>
						</button>

						<button
							onClick={() => updateActiveTab('bubble')}
							style={{ backgroundColor: 'transparent', border: 'none' }}
						>
							<img
								src='/Tab-Icons/Add-Bubble.png'
								width='100'
								height='100'
								style={{
									color: 'white',
									fontSize: '30px',
									filter: activeTab === 'bubble' ? filter : undefined,
								}}
							/>
						</button>

						<button
							onClick={() => updateActiveTab('element')}
							style={{ backgroundColor: 'transparent', border: 'none' }}
						>
							<img
								src='/Tab-Icons/Add-Elements.png'
								width='100'
								height='100'
								style={{
									color: 'white',
									fontSize: '30px',
									filter: activeTab === 'element' ? filter : undefined,
								}}
							/>
						</button>

						<button
							onClick={() => updateActiveTab('writePost')}
							style={{ backgroundColor: 'transparent', border: 'none' }}
						>
							<img
								src='/Tab-Icons/Write-Post.png'
								width='100'
								height='100'
								style={{
									color: 'white',
									fontSize: '30px',
									filter: activeTab === 'writePost' ? filter : undefined,
								}}
							/>
						</button>
					</div>
				</div>

				{/* Footer Panel  End*/}
				{/* Sidebar Tools Panel */}
				{/* <Sidebar /> */}
				<div>
					<div style={{ width: '300px', height: '480px', padding: '10px' }}>
						{activeTab == 'background' && (
							<div>
								<h4
									style={{
										margin: '0px',
										padding: '0px',
									}}
								>
									From Article
								</h4>

								<ImageViewer
									clickHandler={(img: string) => updateBackgroundImage(img)}
									images={initialData.backgroundImages}
								>
									{template.diptych === 'vertical' ? (
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-around',
												py: 1,
											}}
										>
											<div>Top Images</div>
											<div>Bottom Images</div>
										</Box>
									) : template.diptych === 'horizontal' ? (
										<>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-around',
													py: 1,
												}}
											>
												<div>Left Images</div>
												<div>Right Images</div>
											</Box>
										</>
									) : null}
								</ImageViewer>

								{/* <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>  */}

								{/* <ImageViewer
									clickHandler={(img: string) => updateBackgroundImage(img)}
									images={initialData.backgroundImages}
								>
									{template.diptych === 'vertical' ? (
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-around',
												py: 1,
											}}
										>
											<div>Top Images</div>
											<div>Bottom Images</div>
										</Box>
									) : template.diptych === 'horizontal' ? (
										<>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-around',
													py: 1,
												}}
											>
												<div>Left Images</div>
												<div>Right Images</div>
											</Box>
										</>
									) : null}
								</ImageViewer> */}

								<Box {...styles.uploadBox}>
									<label style={styles.uploadLabel}>
										<h4>IMAGE UPLOAD</h4>

										<form method='post' encType='multipart/form-data'>
											<input
												type='file'
												onChange={(event) =>
													uploadImage(event, 'backgroundImages')
												}
												style={{ display: 'none' }}
											/>
										</form>
										<IconButton color='primary' component='span'>
											<CloudUploadIcon style={{ fontSize: '40px' }} />
										</IconButton>
									</label>
								</Box>
							</div>
						)}

						{activeTab == 'title' && (
							<div>
								<h4 style={{ margin: '0px', padding: '0px' }}>Titles</h4>
								<div style={{ marginTop: '20px' }}>
									{texts.map((text: string) => {
										return (
											<h5
												onClick={() => {
													const existingObject = getExistingObject('title') as
														| fabric.Textbox
														| undefined;

													if (!existingObject)
														return createTextBox(canvas, {
															text,
															customType: 'title',
															fill: '#fff',
															width: 303,
															height: 39,
															top: 504,
															left: 34,
															scaleX: 1.53,
															scaleY: 1.53,
															fontSize: 16,
														});

													updateTextBox(canvas, { text });
													setOverlayTextFiltersState((prev) => ({
														...prev,
														text,
													}));
												}}
												style={{
													margin: '0px',
													marginBottom: '15px',
													cursor: 'pointer',
													color: '#a19d9d',
												}}
											>
												{text}
											</h5>
										);
									})}
								</div>
							</div>
						)}

						{activeTab == 'bubble' && (
							<div>
								<h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
								<ImageViewer
									clickHandler={(img: string) => updateBubbleImage(img)}
									images={initialData.bubbles}
								/>

								<h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
								<ImageViewer
									clickHandler={(img: string) => updateBubbleImage(img)}
									images={initialData.bubbles}
								/>

								<Box {...styles.uploadBox}>
									<label style={styles.uploadLabel}>
										<h4>IMAGE UPLOAD</h4>

										<form method='post' encType='multipart/form-data'>
											<input
												type='file'
												onChange={(event) => uploadImage(event, 'bubbles')}
												style={{ display: 'none' }}
											/>
										</form>
										<IconButton color='primary' component='span'>
											<CloudUploadIcon style={{ fontSize: '40px' }} />
										</IconButton>
									</label>
								</Box>
							</div>
						)}

						{activeTab == 'element' && (
							<div>
								<>
									<Box>
										<h4>Choose Element</h4>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												position: 'relative',
											}}
										>
											{elements.map((element: string) => {
												return (
													<img
														key={element}
														src={element}
														onClick={() => {
															const iconSrc = '/icons/swipe.svg';
															const color =
																userMetaData?.company?.color || '#ffffff';
															createSwipeGroup(canvas, {}, iconSrc, color);
														}}
														alt=''
														width='90px'
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
														}}
													/>
												);
											})}

											<CustomColorPicker
												value={userMetaData?.company?.color}
												// value={overlayTextFiltersState.color}
												changeHandler={(color: string) => {
													updateSwipeColor(canvas, color);
												}}
											/>
										</Box>
									</Box>
									<Box>
										<h4>Borders</h4>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											{borders.map((border: string) => {
												return (
													<img
														key={border}
														src={border}
														onClick={() => {
															const imageObject = getExistingObject(
																'borders'
															) as fabric.Image | undefined;
															if (!canvas) return;

															if (imageObject && !imageObject.visible) {
																imageObject.set({
																	visible: true,
																	// fill: userMetaData?.company?.color,
																});
																var filter =
																	new fabric.Image.filters.BlendColor({
																		color: userMetaData?.company?.color,
																		mode: 'tint',
																		alpha: 1,
																	});
																imageObject.filters.push(filter);
																imageObject.applyFilters();
																return canvas?.renderAll();
															} else
																createImage(canvas, border, {
																	customType: 'borders',
																});
														}}
														alt=''
														width='90px'
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
														}}
													/>
												);
											})}
											<CustomColorPicker
												// value={overlayTextFiltersState.color}
												value={userMetaData?.company?.color}
												changeHandler={(color: string) => {
													const type = 'borders';
													let existingObject = getExistingObject(type) as
														| fabric.Image
														| undefined;
													if (
														canvas?._activeObject &&
														canvas?._activeObject?.type === 'image'
													)
														existingObject =
															canvas?._activeObject as fabric.Image;

													if (!existingObject) {
														console.log('existing Border object not founded');
														return;
													}
													const blendColorFilter =
														new fabric.Image.filters.BlendColor({
															color,
															mode: 'tint',
															alpha: 1,
														});

													existingObject.filters?.push(blendColorFilter);
													existingObject.applyFilters();
													requestAnimationFrame(() => {
														canvas?.renderAll();
													});
												}}
											/>
										</Box>
									</Box>

									<Box>
										<input
											type='text'
											style={{
												lineHeight: 1.5,
												marginTop: '0.5rem',
												fontSize: '16px',
												background: 'transparent',
												outline: 'none',
												color: '#fff',
												border: 'none',
											}}
											placeholder='Social Tags'
											defaultValue='Social Tags'
										/>
										{/* <h4>Social Tags</h4> */}
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											{logos?.map((logo: string) => {
												const logoFillColor =
													userMetaData?.company?.color || 'black';
												return (
													<img
														key={logo}
														src={logo}
														alt=''
														onClick={() => {
															const existingTextObject = getExistingObject(
																'hashtag'
															) as fabric.Textbox | undefined;

															if (
																existingTextObject &&
																!existingTextObject?.visible
															)
																updateTextBox(
																	canvas,
																	{
																		visible: !existingTextObject.visible,
																		fill: userMetaData?.company?.color,
																	},
																	'hashtag'
																);
															else
																createTextBox(canvas, {
																	// fill: overlayTextFiltersState.color,
																	fill: userMetaData?.company?.color,
																	customType: 'hashtag',
																});
														}}
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
														}}
														width='90px'
													/>
												);
											})}
											<CustomColorPicker
												value={userMetaData?.company?.color}
												// value={overlayTextFiltersState.color}
												changeHandler={(color: string) => {
													const type = 'hashtag';

													let existingTextObject = getExistingObject(type) as
														| fabric.Textbox
														| undefined;
													if (
														canvas?._activeObject &&
														canvas?._activeObject?.type === 'textbox'
													)
														existingTextObject =
															canvas?._activeObject as fabric.Textbox;

													if (!existingTextObject) return;
													updateTextBox(canvas, { fill: color }, 'hashtag');
												}}
											/>
										</Box>

										<Box>
											{/* <Typography>User Details</Typography> */}
											{/* <Typography>{`Name: ${userMetaData?.company?.name}`}</Typography> */}
											{/* <Typography>{`Color :${userMetaData?.company?.color}`}</Typography>
											<Typography>{`Font :${userMetaData?.company?.font}`}</Typography> */}
											{/* <Typography>{`Website Link${userMetaData?.company?.website}`}</Typography>
											<Typography>{`Plan :${userMetaData?.company?.plan}`}</Typography> */}
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													mt: 2,
												}}
											>
												<img
													src={userMetaData?.company?.logo}
													onClick={() => {
														fabric.Image.fromURL(
															userMetaData?.company?.logo,
															function (img) {
																img.set({
																	width: 400,
																	height: 400,
																});
																canvas.add(img);
																requestAnimationFrame(() => {
																	canvas.renderAll();
																});
															},
															{
																crossOrigin: 'anonymous',
															}
														);
													}}
													alt=''
													// width='90px'
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
														width: '80px',
														height: '60px',
													}}
												/>
												<img
													src={userMetaData?.company?.logo2}
													onClick={() => {
														fabric.Image.fromURL(
															userMetaData?.company?.logo2,
															function (img) {
																img.set({
																	width: 400,
																	height: 400,
																});
																canvas.add(img);
																requestAnimationFrame(() => {
																	canvas.renderAll();
																});
															},
															{
																crossOrigin: 'anonymous',
															}
														);
													}}
													alt=''
													// width='90px'
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
														width: '80px',
														height: '60px',
													}}
												/>

												<img
													src={userMetaData?.company?.logo3}
													onClick={() => {
														fabric.Image.fromURL(
															userMetaData?.company?.logo3,
															function (img) {
																img.set({
																	width: 400,
																	height: 400,
																});
																canvas.add(img);
																requestAnimationFrame(() => {
																	canvas.renderAll();
																});
															},
															{
																crossOrigin: 'anonymous',
															}
														);
													}}
													alt=''
													// width='90px'
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
														width: '80px',
														height: '60px',
													}}
												/>
											</Box>
										</Box>
									</Box>
								</>
							</div>
						)}

						{activeTab == 'writePost' && (
							<div>
								<h2>Write post</h2>
							</div>
						)}
					</div>
					<div style={{ marginTop: '40%', position: 'relative' }}>
						<button
							onClick={() => saveImage(canvas)}
							style={{
								width: '100%',
								height: '42px',
								borderRadius: '25px',
								border: 'none',
								backgroundColor: '#3b0e39',
								color: 'white',
							}}
						>
							Export
						</button>
					</div>
					<div style={{ marginTop: '5%', position: 'relative' }}>
						<button
							onClick={() => saveJSON(canvas)}
							style={{
								width: '100%',
								height: '42px',
								borderRadius: '25px',
								border: 'none',
								backgroundColor: '#3b0e39',
								color: 'white',
							}}
						>
							JSON
						</button>
					</div>
					{activeTab !== 'writePost' && (
						<div
							style={{
								marginTop: '5%',
								position: 'relative',
								cursor: 'pointer',
							}}
						>
							<button
								onClick={() => {
									const index = toolbars.findIndex((itm) => itm === activeTab);
									if (index === -1) return;
									const nextItem = toolbars[index + 1] as activeTabs;
									if (nextItem) updateActiveTab(nextItem);
								}}
								style={{
									width: '100%',
									height: '42px',
									borderRadius: '25px',
									border: 'none',
									backgroundColor: '#3b0e39',
									color: 'white',
								}}
							>
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}
);

export default Canvas;
