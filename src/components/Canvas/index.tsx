// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Typography, Box, IconButton, Stack, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styles, useStyles } from "./index.style";
import ImageViewer from "../Image";
import { IEvent, IRectOptions } from "fabric/fabric-impl";
import { canvasDimension } from "../../constants";
import CustomColorPicker from "../colorPicker";
import { Template } from "../../types";
import DeselectIcon from "@mui/icons-material/Deselect";
import {
  createSwipeGroup,
  createTextBox,
  updateSwipeColor,
  updateTextBox,
} from "../../utils/TextHandler";
import { updateRect } from "../../utils/RectHandler";
import { saveImage, saveJSON } from "../../utils/ExportHandler";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createImage,
  createImageLogo,
  updateImageSource,
} from "../../utils/ImageHandler";
import { useCanvasContext } from "../../context/CanvasContext";
import FontsTab from "../Tabs/EditText/FontsTab";
import {
  createHorizontalCollage,
  createVerticalCollage,
  updateHorizontalCollageImage,
  updateVerticalCollageImage,
} from "../../utils/CollageHandler";
import { activeTabs } from "../../types/context";
import FlipIcon from "@mui/icons-material/Flip";
import {
  createBubbleElement,
  updateBubbleElement,
} from "../../utils/BubbleHandler";
import { debounce } from "lodash";

import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import { ChromePicker } from "react-color";
import socialTag1 from "../../assets/socialTags/Verification-Tick-1.svg";
import socialTag2 from "../../assets/socialTags/Verification-Tick-2.svg";
import socialTag3 from "../../assets/socialTags/Verification-Tick-3.svg";

import shape1 from "../../assets/shapes/1-Shapes-Circle.svg";
import shape2 from "../../assets/shapes/2-Shapes-Rectangle.svg";
import shape3 from "../../assets/shapes/3-Shapes-Star-A.svg";
import shape4 from "../../assets/shapes/4-Shapes-Star-B.svg";
import shape5 from "../../assets/shapes/5-Shapes-Triangle.svg";
import shape6 from "../../assets/shapes/6-Shapes-Square.svg";
import shape7 from "../../assets/shapes/7-Shapes-Diamond.svg";
import shape8 from "../../assets/shapes/8-Shapes-Plus.svg";
import shape9 from "../../assets/shapes/9-Shapes-Heart.svg";
import shape10 from "../../assets/shapes/10-Shapes-Trapezium.svg";

import swipe1 from "../../assets/swipe/Swipe-1.svg";
import swipe2 from "../../assets/swipe/Swipe-2.svg";
import swipe3 from "../../assets/swipe/Swipe-3.svg";

import socialPlatformsImg1 from "../../assets/socialPlatforms/1-Round-Color-FB.svg";
import socialPlatformsImg2 from "../../assets/socialPlatforms/2-Round-Color-IG.svg";
import socialPlatformsImg3 from "../../assets/socialPlatforms/3-Round-Color-X.svg";
import socialPlatformsImg4 from "../../assets/socialPlatforms/4-Round-Color-YT.svg";
import socialPlatformsImg5 from "../../assets/socialPlatforms/5-Round-Color-TT.svg";
import socialPlatformsImg6 from "../../assets/socialPlatforms/6-Round-Color-LI.svg";
import socialPlatformsImg7 from "../../assets/socialPlatforms/7-Round-BW-FB.svg";
import socialPlatformsImg8 from "../../assets/socialPlatforms/8-Round-BW-IG.svg";
import socialPlatformsImg9 from "../../assets/socialPlatforms/9-Round-BW-X.svg";
import socialPlatformsImg10 from "../../assets/socialPlatforms/10-Round-BW-YT.svg";
import socialPlatformsImg11 from "../../assets/socialPlatforms/11-Round-BW-TT.svg";
import socialPlatformsImg12 from "../../assets/socialPlatforms/12-Round-BW-LI.svg";
import socialPlatformsImg13 from "../../assets/socialPlatforms/13-Square-Color-FB.svg";
import socialPlatformsImg14 from "../../assets/socialPlatforms/14-Square-Color-IG.svg";
import socialPlatformsImg15 from "../../assets/socialPlatforms/15-Square-Color-X.svg";
import socialPlatformsImg16 from "../../assets/socialPlatforms/16-Square-Color-TT.svg";
import socialPlatformsImg17 from "../../assets/socialPlatforms/17-Square-Color-YT.svg";
import socialPlatformsImg18 from "../../assets/socialPlatforms/18-Square-Color-LI.svg";
import socialPlatformsImg19 from "../../assets/socialPlatforms/19-Square-BW-FB.svg";
import socialPlatformsImg20 from "../../assets/socialPlatforms/20-Square-BW-IG.svg";
import socialPlatformsImg21 from "../../assets/socialPlatforms/21-Square-BW-X.svg";
import socialPlatformsImg22 from "../../assets/socialPlatforms/22-Square-BW-YT.svg";
import socialPlatformsImg23 from "../../assets/socialPlatforms/23-Square-BW-TT.svg";
import socialPlatformsImg24 from "../../assets/socialPlatforms/24-Square-BW-LI.svg";

import arrowImg1 from "../../assets/arrows/Arrow-1.svg";
import arrowImg2 from "../../assets/arrows/Arrow-2.svg";
import arrowImg3 from "../../assets/arrows/Arrow-3.svg";
import arrowImg4 from "../../assets/arrows/Arrow-4.svg";

import dividers1 from "../../assets/dividers/Divider-1.svg";
import dividers2 from "../../assets/dividers/Divider-2.svg";
import dividers3 from "../../assets/dividers/Divider-3.svg";
import dividers4 from "../../assets/dividers/Divider-4.svg";
import dividers5 from "../../assets/dividers/Divider-5.svg";
import dividers6 from "../../assets/dividers/Divider-6.svg";

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

const toolbars = ["background", "title", "bubble", "element", "writePost"];
const filter =
  "brightness(0) saturate(100%) invert(80%) sepia(14%) saturate(1577%) hue-rotate(335deg) brightness(108%) contrast(88%)";

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
    const [activeButton, setActiveButton] = useState("Overlay");
    const [show, setShow] = useState("font");
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [selectedFilter] = useState<string>("");
    const [dropDown, setDropDown] = useState(true);
    const [filtersRange, setFiltersRange] = useState({
      brightness: 0,
      contrast: 0,
    });

    const { userMetaData, updateIsUserMetaExist, updateUserMetaData } =
      useCanvasContext();
    // console.log('🚀 ~ userMetaData:', userMetaData?.company?.name);
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
        color: "#fff",
        fontFamily: "Fira Sans",
        fontWeight: 500,
        charSpacing: 1,
      });

    const [overlayTextFiltersState1, setOverlayTextFiltersState1] =
      useState<FilterState>({
        color: "red",
      });

    const [filterValues, setFilterValues] = useState({
      overlayText: {
        overlay: 0.6,
        text: "",
        fontSize: 16,
        color: "#fff",
        fontFamily: "Fira Sans",
      },
      overlay: {
        imgUrl: template.overlayImage,
        opacity: template.opacity,
      },
      bubble: {
        image: "",
        strokeWidth: 10,
        stroke: "#fff",
      },
      collage: {
        strokeWidth: 3,
        stroke: "#ffffff",
      },
    });

    const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
      {
        name: "grayscale",
        filter: new fabric.Image.filters.Grayscale({ grayscale: 1 }),
      },
      { name: "sepia", filter: new fabric.Image.filters.Sepia({ sepia: 1 }) },
      {
        name: "invert",
        filter: new fabric.Image.filters.Invert({ invert: 1 }),
      },
      {
        name: "sharpen",
        filter: new fabric.Image.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        }),
      },

      // Add more filters as needed
    ];

    const classes = useStyles();
    const canvasInstanceRef = useRef(null);
    const [color, setColor] = useState("#FD3232");
    const [colorApplied, setColorApplied] = useState(false);
    const [bgColorApplied, setBgColorApplied] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#909BEB");

    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [fontWeightApplied, setFontWeightApplied] = useState(false);

    useEffect(() => {
      const options = {
        width: canvasDimension.width,
        height: canvasDimension.height,
        renderOnAddRemove: false,
        preserveObjectStacking: true,
        selection: true,
      };

      const canvas = new fabric.Canvas(canvasEl.current, options);
      canvasInstanceRef.current = canvas;

      updateCanvasContext(canvas);

      // Attach the event listener with the separated function
      canvas.on("selection:created", handleSelectionUpdated);
      canvas.on("selection:updated", handleSelectionUpdated);

      // Register event listener
      canvas.on("mouse:down", handleMouseDown);

      return () => {
        // Cleanup
        updateCanvasContext(null);
        canvas.dispose();
      };
    }, [canvasDimension]);
    const handleSelectionUpdated = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const selectedText = window.getSelection().toString();
        if (activeObject.text.includes(selectedText)) {
          const startPos = activeObject.text.indexOf(selectedText);
          const endPos = startPos + selectedText.length;
          activeObject.setSelectionStyles(
            { textBackgroundColor: backgroundColor },
            startPos,
            endPos
          );
          setBgColorApplied(true);
          canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        }
      }
    };

    const removeBackgroundColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const selectedText = window.getSelection().toString();
        if (activeObject.text.includes(selectedText)) {
          const startPos = activeObject.text.indexOf(selectedText);
          const endPos = startPos + selectedText.length;
          activeObject.setSelectionStyles(
            { textBackgroundColor: "transparent" },
            startPos,
            endPos
          );
          setBgColorApplied(true);
          canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        }
      }
    };

    // Define handleMouseDown function
    const handleMouseDown = (event) => {
      const selectedObject = event.target;

      if (selectedObject && selectedObject.type === "textbox") {
        const selectionStart = selectedObject.selectionStart;
        const selectionEnd = selectedObject.selectionEnd;

        if (selectionStart !== selectionEnd) {
          selectedObject.setSelectionStyles(
            { fill: color },

            selectionStart,
            selectionEnd
          );
          canvasInstanceRef.current.renderAll(); // Render only the selected object
        }
      }
    };

    const applyBackgroundColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ backgroundColor: backgroundColor });
        canvasInstanceRef.current.renderAll(); // Render only the canvas instance
        setColorApplied(true);
      }
    };

    const applyColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();

      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({
          fill: color,
        });

        canvasInstanceRef.current.renderAll();
        setColorApplied(true);
      }
    };

    const removeColor = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fill: "#ffffff" });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setColorApplied(false);
      }
    };

    const applyFontWeight = () => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({
          fontWeight: fontWeightApplied ? "" : "bold",
        });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontWeightApplied(!fontWeightApplied);
      }
    };

    const applyFontSize = (size) => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fontSize: size });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontSize(size);
      }
    };

    const applyFontFamily = (family) => {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.setSelectionStyles({ fontFamily: family });
        canvasInstanceRef.current.renderAll(); // Render only the selected object
        setFontFamily(family);
      }
    };

    //   useEffect(() => {
    //       const options = {
    //           width: canvasDimension.width,
    //           height: canvasDimension.height,
    //           renderOnAddRemove: false,
    //           preserveObjectStacking: true,
    //           selection: true,
    //       };
    //       const canvas = new fabric.Canvas(canvasEl.current, options);
    //       canvasInstanceRef.current = canvas;
    //       // make the fabric.Canvas instance available to your app
    //       updateCanvasContext(canvas);

    //       // Event listener for mouse click
    //       canvas.on('mouse:down', handleMouseDown);

    //       function handleMouseDown(event) {
    //           const selectedObject = event.target;

    //           if (selectedObject && selectedObject.type === 'textbox') {
    //               const selectionStart = selectedObject.selectionStart;
    //               const selectionEnd = selectedObject.selectionEnd;

    //               if (selectionStart !== selectionEnd) {
    //                   const fill = overlayTextFiltersState1.color;
    //                   selectedObject.setSelectionStyles({ fill }, selectionStart, selectionEnd);
    //                   canvas.renderAll();
    //               }
    //           }
    //       }

    //       return () => {
    //           updateCanvasContext(null);
    //           canvas.dispose();
    //       };
    //   }, [canvasDimension, overlayTextFiltersState1]);

    //   const changeColor = (color) => {
    //       const activeObject = canvasInstanceRef.current.getActiveObject();
    //       if (activeObject && activeObject.type === 'textbox') {
    //           activeObject.setSelectionStyles({ fill: color });
    //           canvasInstanceRef.current.renderAll();
    //       }
    //   };
    // 	const removeColor = () => {
    // 		const activeObject = canvasInstanceRef.current.getActiveObject();
    // 		if (activeObject && activeObject.type === 'textbox') {
    // 				activeObject.setSelectionStyles({ fill: 'white' }); // Revert to default color
    // 				canvasInstanceRef.current.renderAll();
    // 		}
    // };

    //   const changeFont = (fontFamily) => {
    //       const activeObject = canvasInstanceRef.current.getActiveObject();
    //       if (activeObject && activeObject.type === 'textbox') {
    //           activeObject.setSelectionStyles({ fontFamily });
    //           canvasInstanceRef.current.renderAll();
    //       }
    //   };

    //   const changeFontSize = (fontSize) => {
    //       const activeObject = canvasInstanceRef.current.getActiveObject();
    //       if (activeObject && activeObject.type === 'textbox') {
    //           activeObject.setSelectionStyles({ fontSize });
    //           canvasInstanceRef.current.renderAll();
    //       }
    //   };

    //   const changeFontWeight = (fontWeight) => {
    //       const activeObject = canvasInstanceRef.current.getActiveObject();
    //       if (activeObject && activeObject.type === 'textbox') {
    //           activeObject.setSelectionStyles({ fontWeight });
    //           canvasInstanceRef.current.renderAll();
    //       }
    //   };

    // 	useEffect(() => {
    // 		const options = {
    // 				width: canvasDimension.width,
    // 				height: canvasDimension.height,
    // 				renderOnAddRemove: false,
    // 				preserveObjectStacking: true,
    // 				selection: true,

    // 		};
    // 		const canvas = new fabric.Canvas(canvasEl.current, options);
    // 		canvasInstanceRef.current = canvas;
    // 		// make the fabric.Canvas instance available to your app
    // 		updateCanvasContext(canvas);

    // 		// Event listener for mouse click
    // 		canvas.on('mouse:down', handleMouseDown);

    // 		function handleMouseDown(event) {
    // 				const selectedObject = event.target;

    // 				if (selectedObject && selectedObject.type === 'textbox') {
    // 						const selectionStart = selectedObject.selectionStart;
    // 						const selectionEnd = selectedObject.selectionEnd;

    // 						if (selectionStart !== selectionEnd) {
    // 								const fill = overlayTextFiltersState1.color;
    // 								console.log('🚀  fill:', fill);
    // 								selectedObject.setSelectionStyles({ fill }, selectionStart, selectionEnd);

    // 								// Change font size and fontWeight
    // 								selectedObject.setSelectionStyles({ fontSize: 30, fontWeight: 'bold', 				fontFamily: 'Fira Sans',
    // 							}, selectionStart, selectionEnd);

    // 								canvas.renderAll();
    // 						}
    // 				}
    // 		}

    // 		return () => {
    // 				updateCanvasContext(null);
    // 				canvas.dispose();
    // 		};
    // }, []);

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
    // 		const selectedObject = event.target;

    // 		if (selectedObject && selectedObject.type === 'textbox') {
    // 			const selectionStart = selectedObject.selectionStart;
    // 			const selectionEnd = selectedObject.selectionEnd;

    // 			if (selectionStart !== selectionEnd) {
    // 				const fill = overlayTextFiltersState1.color;
    // 				console.log('🚀  fill:', fill);
    // 				selectedObject.setSelectionStyles(
    // 					{ fill },
    // 					selectionStart,
    // 					selectionEnd
    // 				);
    // 				canvas.renderAll();
    // 			}
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

      const img1 = "/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg";
      const img2 = "/images/sample/scott-circle-image.png";

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

          if (thisTarget.isType("group")) {
            thisTarget.forEachObject((object: any) => {
              if (object.type === "textbox") {
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

        textObject.on("editing:exited", () => {
          if (exitEditing) {
            const items: any[] = [];
            groupItems.forEach((obj: any) => {
              items.push(obj);
              canvas?.remove(obj);
            });

            const grp = new fabric.Group(items, {
              customType: "swipeGroup",
            });
            canvas?.add(grp);
            exitEditing = false;
          }
        });
      };
      canvas?.on("mouse:down", handleMouseDown);
      // Attach canvas update listeners
      // canvas?.on('mouse:down', handleMouseClick);
      canvas?.on("selection:created", handleCanvasUpdate);
      canvas?.on("selection:updated", handleCanvasUpdate);
      canvas?.on("selection:cleared", handleCanvasUpdate);

      // Cleanup the event listeners when the component unmounts
      return () => {
        // canvas?.on('mouse:down', handleMouseClick);
        canvas?.off("selection:created", handleCanvasUpdate);
        canvas?.off("selection:updated", handleCanvasUpdate);
        canvas?.off("selection:cleared", handleCanvasUpdate);
      };
    }, [loadCanvas]);

    const updateBubbleImageContrast = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        // Check if the active object is an image
        let contrast = bubbleFilter.contrast; // Get the contrast value

        // Ensure contrast is within valid range
        if (contrast < -1) {
          contrast = -1;
        } else if (contrast > 1) {
          contrast = 1;
        }

        // Modify the contrast of the image
        activeObject.filters = []; // Clear existing filters
        activeObject.filters.push(
          new fabric.Image.filters.Contrast({ contrast })
        );
        activeObject.applyFilters();

        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateBubbleImageBrightness = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        // Check if the active object is an image
        let brightness = bubbleFilter.brightness; // Get the brightness value

        // Ensure brightness is within valid range
        if (brightness < -1) {
          brightness = -1;
        } else if (brightness > 1) {
          brightness = 1;
        }

        // Modify the brightness of the image
        activeObject.filters = []; // Clear existing filters
        activeObject.filters.push(
          new fabric.Image.filters.Brightness({ brightness })
        );
        activeObject.applyFilters();

        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateBubbleImage = (
      imgUrl: string | undefined,
      filter?: { strokeWidth: number; stroke: string },
      shadow?: {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
      },
      brightness?: number
    ) => {
      const existingBubbleStroke = getExistingObject("bubbleStroke");

      const activeObject = canvas?.getActiveObject();

      if (!canvas) {
        console.error("Canvas Not initialized");
        return;
      }

      if (shadow) {
        const newOptions: fabric.ICircleOptions = {
          shadow: {
            color: shadow.color || "rgba(0,0,0,0.5)",
            offsetX: shadow.offsetX || 10,
            offsetY: shadow.offsetY || 10,
            blur: shadow.blur || 1,
          },
        };
        updateBubbleElement(canvas, existingBubbleStroke, newOptions);
        canvas.renderAll();
      }

      if (filter && !imgUrl && existingBubbleStroke) {
        const newOptions: fabric.ICircleOptions = {
          stroke: filter?.stroke || "blue",
          strokeWidth: filter?.strokeWidth || 15,
        };
        updateBubbleElement(canvas, existingBubbleStroke, newOptions);
        canvas.renderAll();
      } else {
        let options: fabric.ICircleOptions = {
          ...existingBubbleStroke,
          ...(!existingBubbleStroke &&
            template.diptych === "horizontal" && { top: 150 }),
          ...(!existingBubbleStroke &&
            template.diptych === "horizontal" && { left: 150, radius: 80 }),
        };
        // Shadow for newly created bubble with increased length

        options.shadow = {
          color: "rgba(0,0,0,0.5)",
          offsetX: 1,
          offsetY: 1,
          blur: 1,
          spread: 100,
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

        const bgImages = ["bg-1"];

        if (!template.backgroundImage) bgImages.push("bg-2");

        for (const customType of bgImages) {
          const existingObject: fabric.Image | undefined = getExistingObject(
            customType
          ) as fabric.Image;
          if (existingObject) {
            const hasBrightnessOrContrast =
              filter.hasOwnProperty("brightness") ||
              filter.hasOwnProperty("contrast");

            const index: number | undefined = existingObject.filters?.findIndex(
              (fil) => fil[type as any]
            );

            if (type === "sharpen") {
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

      const ctx = canvas.getContext("2d");
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

      ctx.strokeStyle = "#ebebeb";
      ctx.stroke();
    }

    function hideGrid(canvasRef, originalImage) {
      const canvas = canvasRef.current;
      if (!canvas || !originalImage) return;

      const ctx = canvas.getContext("2d");
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
        canvas.getActiveObject() || getExistingObject("bg-1");

      if (!template.backgroundImage && !canvas.getActiveObject()) {
        let currentImageIndex = initialData.backgroundImages?.findIndex(
          (bgImage: string) => bgImage === imageUrl
        );
        activeObject = getExistingObject(
          currentImageIndex % 2 === 0 ? "bg-1" : "bg-2"
        );
      }

      let currentImageIndex = initialData.backgroundImages?.findIndex(
        (bgImage: string) => bgImage === imageUrl
      );

      if (!activeObject) {
        if (template.diptych === "horizontal") {
          // createHorizontalCollage(canvas, [imageUrl, imageUrl]);
          if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
            createHorizontalCollage(canvas, [imageUrl, null]);
          } else if (
            currentImageIndex !== undefined &&
            currentImageIndex % 2 !== 0
          ) {
            createHorizontalCollage(canvas, [null, imageUrl]);
          }
        } else if (template.diptych === "vertical") {
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

      if (!activeObject) return console.log("Still Object not found");

      if (template.backgroundImage || !template.diptych)
        updateImageSource(canvas, imageUrl, activeObject);
      else if (template.diptych === "vertical")
        updateVerticalCollageImage(canvas, imageUrl, activeObject);
      else updateHorizontalCollageImage(canvas, imageUrl, activeObject);
    }, 100);

    const updateOverlayImage = debounce((image: string, opacity: number) => {
      if (!canvas) {
        return;
      }
      const existingObject = getExistingObject("overlay");

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

            img.customType = "overlay";

            canvas.insertAt(img, 3, false);
            requestAnimationFrame(() => {
              canvas.renderAll();
            });
          },
          {
            crossOrigin: "anonymous",
          }
        );
      }
    }, 100);

    const updateRectangle = (options: IRectOptions) => {
      if (!canvas) return;

      const existingObject = getExistingObject("photo-border");

      if (existingObject)
        updateRect(existingObject, {
          ...options,
          top: existingObject?.top,
          left: existingObject.left,
          customType: "photo-border",
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

    const flipImage = (flipAxis: "flipX" | "flipY" = "flipX") => {
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
        console.log("Canvas not found");
        return;
      }
      const existingObject = getExistingObject("photo-border") as fabric.Rect;

      if (template.diptych === "horizontal") {
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

    //--------------------shapes data--------------------------------------
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
    const shapeData = [
      { imgShape: shape1 },
      { imgShape: shape2 },
      { imgShape: shape3 },
      { imgShape: shape4 },
      { imgShape: shape5 },
      { imgShape: shape6 },
      { imgShape: shape7 },
      { imgShape: shape8 },
      { imgShape: shape9 },
      { imgShape: shape10 },
    ];

    const swipeData = [
      { swipeImg: swipe1 },
      { swipeImg: swipe2 },
      { swipeImg: swipe3 },
      { swipeImg: arrowImg1 },
      { swipeImg: arrowImg2 },
      { swipeImg: arrowImg3 },
      { swipeImg: arrowImg4 },
    ];

    const socialPlatformsData1 = [
      { spImg: socialPlatformsImg1 },
      { spImg: socialPlatformsImg2 },
      { spImg: socialPlatformsImg3 },
      { spImg: socialPlatformsImg4 },
      { spImg: socialPlatformsImg5 },
      { spImg: socialPlatformsImg6 },
      { spImg: socialPlatformsImg7 },
      { spImg: socialPlatformsImg8 },
      { spImg: socialPlatformsImg9 },
      { spImg: socialPlatformsImg10 },
    ];
    const socialPlatformsData2 = [
      { spImg: socialPlatformsImg11 },
      { spImg: socialPlatformsImg12 },
      { spImg: socialPlatformsImg13 },
      { spImg: socialPlatformsImg14 },
      { spImg: socialPlatformsImg15 },
      { spImg: socialPlatformsImg16 },
      { spImg: socialPlatformsImg17 },
      { spImg: socialPlatformsImg18 },
      { spImg: socialPlatformsImg19 },
      { spImg: socialPlatformsImg20 },
    ];

    const socialPlatformsData3 = [
      { spImg: socialPlatformsImg21 },
      { spImg: socialPlatformsImg22 },
      { spImg: socialPlatformsImg23 },
      { spImg: socialPlatformsImg24 },
      { spImg: socialTag1 },
      { spImg: socialTag2 },
      { spImg: socialTag3 },
    ];

    const dividersData = [
      { dividerImg: dividers1 },
      { dividerImg: dividers2 },
      { dividerImg: dividers3 },
      { dividerImg: dividers4 },
      { dividerImg: dividers5 },
      { dividerImg: dividers6 },
    ];

    const [shadowValues, setShadowValues] = useState({
      opacity: 0.5, // Initial opacity value
      distance: 10, // Initial distance value
      blur: 5, // Initial blur radius value
    });
    const [elementShadowValues, setElementShadowValues] = useState({
      opacity: 0.5, // Initial opacity value
      distance: 10, // Initial distance value
      blur: 5, // Initial blur radius value
    });
    const [bubbleFilter, setBubbleFilter] = useState({
      contrast: "",
      brightness: "",
    });
    const [elementOpacity, setElementOpacity] = useState<number>(1);

    const updateElementOpacity = () => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject && activeObject.type === "image") {
        let opacity = elementOpacity;

        // Ensure opacity is within valid range
        if (opacity < 0) {
          opacity = 0;
        } else if (opacity > 1) {
          opacity = 1;
        }

        // Modify the opacity of the image
        activeObject.set("opacity", opacity);
        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    const updateElementShadow = (
      imgUrl: string | undefined,
      filter?: { strokeWidth: number; stroke: string },
      shadow?: {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
      },
      brightness?: number
    ) => {
      const activeObject = canvas?.getActiveObject();

      if (activeObject) {
        // Check if the active object exists
        const { offsetX, offsetY, blur } = shadowValues;

        // Modify the shadow properties of the active object
        // color: shadow.color || "rgba(0,0,0,0.5)",
        // offsetX: shadow.offsetX || 10,
        // offsetY: shadow.offsetY || 10,
        // blur: shadow.blur || 1,
        activeObject.set({
          shadow: {
            color: shadow.color || "rgba(0,0,0,0.5)",
            offsetX: shadow.offsetX || 10,
            offsetY: shadow.offsetY || 10,
            blur: shadow.blur || 1,
          },
        });
        canvas?.renderAll(); // Render the canvas to see the changes
      }
    };

    return (
      <div
        style={{
          display: "flex",
          columnGap: "50px",
          marginTop: 50,
          marginBottom: 50,
          // border: '1px solid red',
        }}
      >
        <div>
          <div
            style={{
              background:
                "repeating-linear-gradient(transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 11px);",
            }}
          >
            <DeselectIcon
              color={canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"}
              aria-disabled={canvasToolbox.isDeselectDisabled}
              onClick={deselectObj}
            />

            <DeleteIcon
              color={canvasToolbox.isDeselectDisabled ? "disabled" : "inherit"}
              aria-disabled={canvasToolbox.isDeselectDisabled}
              onClick={deleteActiveSelection}
            />
            <img
              src="/icons/flipX.svg"
              className={
                !canvasToolbox.isDeselectDisabled ? "filter-white" : ""
              }
              style={{ width: 25, height: 25, margin: "0 0.3rem" }}
              onClick={() => flipImage("flipX")}
            />

            <img
              src="/icons/flipY.svg"
              className={
                !canvasToolbox.isDeselectDisabled ? "filter-white" : ""
              }
              style={{ width: 25, height: 25 }}
              onClick={() => flipImage("flipY")}
            />
            <GridOnIcon
              color={isSelected ? "primary" : "disabled"}
              onClick={darw_Grid_btn}
              sx={{
                px: 1,
                color: "white",
                cursor: "pointer",
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

          <canvas width="1080" height="1350" ref={canvasEl} />
          {/* <>
          
            <button onClick={() => changeColor('red')}>Change Color</button>
						<button onClick={() => removeColor()}>Remove Color</button>
            <button onClick={() => changeFont('Arial')}>Change Font</button>
            <button onClick={() => changeFontSize(24)}>Change Font Size</button>
            <button onClick={() => changeFontWeight('bold')}>Change Font Weight</button>
        </> */}

          {/* Footer Panel  Start*/}
          {activeTab == "background" && dropDown && (
            <div>
              <Paper className={classes.root}>
                <div className={classes.optionsContainer}>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Overlay" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Overlay")}
                  >
                    Overlay
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Brightness" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Brightness")}
                  >
                    Brightness
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Contrast" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Contrast")}
                  >
                    Contrast
                  </Button>
                  <Button
                    className={`${classes.button} ${
                      activeButton === "Filters" && classes.buttonActive
                    }`}
                    variant="text"
                    color="primary"
                    onClick={() => handleButtonClick("Filters")}
                  >
                    Filter
                  </Button>

                  {template.diptych && !template.backgroundImage ? (
                    <Button
                      className={`${classes.button} ${
                        activeButton === "border" && classes.buttonActive
                      }`}
                      variant="text"
                      color="primary"
                      onClick={() => handleButtonClick("border")}
                    >
                      Border
                    </Button>
                  ) : null}
                </div>
                {activeButton === "Overlay" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
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
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {activeButton === "Contrast" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
                      defaultValue={0}
                      min={-1}
                      value={filtersRange.contrast}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      //eslint-disable-next-line
                      onChange={(e: any) => {
                        let value = +e.target.value;
                        setFiltersRange({ ...filtersRange, contrast: value });
                        var filter = new fabric.Image.filters.Contrast({
                          contrast: value,
                        });
                        updateBackgroundFilters(filter, "contrast");
                      }}
                    />
                  </div>
                )}
                {activeButton === "Brightness" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="Overlay, Brightness, Contrast"
                      color="secondary"
                      defaultValue={0}
                      min={-1}
                      max={1}
                      step={0.01}
                      value={filtersRange.brightness}
                      valueLabelDisplay="auto"
                      onChange={(e: any) => {
                        let value = +e.target.value;
                        setFiltersRange({ ...filtersRange, brightness: value });
                        var filter = new fabric.Image.filters.Brightness({
                          brightness: value,
                        });

                        updateBackgroundFilters(filter, "brightness");
                      }}
                    />
                  </div>
                )}
                {activeButton === "Filters" && (
                  <div className={classes.sliderContainer}>
                    {availableFilters.map((filter) => (
                      <Button
                        key={filter.name}
                        className={`${classes.button} ${
                          selectedFilter === filter.name && classes.buttonActive
                        }`}
                        variant="text"
                        color="primary"
                        onClick={() =>
                          updateBackgroundFilters(filter.filter, filter.name)
                        }
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                )}

                {activeButton === "border" && (
                  <Stack
                    width="inherit"
                    mx={10}
                    spacing={2}
                    direction="row"
                    sx={{ mb: 1 }}
                    alignItems="center"
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                      valueLabelDisplay="auto"
                      className={classes.slider}
                      min={0}
                      max={20}
                      aria-label="Volume"
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
          {(activeTab == "title" || activeTab === "element") && dropDown && (
            <div>
              <Paper className={classes.root}>
                <Box className={classes.optionsContainer}>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("font")}
                  >
                    Font
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("fontWeight")}
                  >
                    FontWeight
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("charSpacing")}
                  >
                    Spacing
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("colors")}
                  >
                    Colors
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("size")}
                  >
                    Size
                  </Typography>

                  {activeTab === "element" && (
                    <>
                      <Typography
                        className={classes.heading}
                        onClick={() => setShow("opacity")}
                      >
                        Opacity
                      </Typography>
                      <Typography
                        className={classes.heading}
                        onClick={() => setShow("element-shadow")}
                      >
                        Shadow
                      </Typography>
                    </>
                  )}

                  {/* <Typography
										className={classes.heading}
										onClick={() => setShow('colors1')}
									>
										Text
									</Typography> */}
                </Box>

                {show === "colors" && (
                  <Box
                    className={classes.optionsContainer}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
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
                    <Typography
                      sx={{
                        color: "white",
                        px: 1,
                      }}
                    >
                      Text Color
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomColorPicker
                        type="color"
                        value={color}
                        changeHandler={(color: string) => {
                          setColor(color);
                          applyColor();
                        }}
                      />

                      <Button
                        onClick={applyColor}
                        // onClick={colorApplied ? removeColor : applyColor}
                        sx={{
                          color: "white",
                          textTransform: "none",
                          backgroundColor: colorApplied ? "gray" : "",
                          mx: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                          }}
                        >
                          Text Highlight
                        </Typography>
                        {/* {colorApplied ? 'Remove Color' : 'Apply Color'} */}
                      </Button>
                      <Button
                        onClick={removeColor}
                        sx={{
                          // color: 'white',
                          textTransform: "none",
                          minWidth: "10px",
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                    <CustomColorPicker
                      type="color"
                      value={backgroundColor}
                      changeHandler={(color: string) => {
                        setBackgroundColor(color);
                        handleSelectionUpdated();
                      }}
                    />
                    {/* Apply Background Color Button */}
                    {/* <button onClick={applyBackgroundColor}>Apply Bg</button> */}
                    <Button
                      onClick={handleSelectionUpdated}
                      sx={{
                        color: "white",
                        textTransform: "none",
                        backgroundColor: bgColorApplied ? "gray" : "",
                        mx: 1,
                      }}
                    >
                      Bg Color
                    </Button>
                    <Button
                      onClick={removeBackgroundColor}
                      sx={{
                        // color: 'white',
                        textTransform: "none",
                        minWidth: "10px",
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                )}

                {activeTab === "element" && show === "opacity" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={elementOpacity}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setElementOpacity(value);
                        updateElementOpacity();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}
                {show === "element-shadow" && (
                  <div>
                    <Typography id="opacity-slider" gutterBottom>
                      Opacity
                    </Typography>
                    <Slider
                      aria-labelledby="opacity-slider"
                      value={elementShadowValues.opacity}
                      onChange={(event, newValue) => {
                        setElementShadowValues((prev) => ({
                          ...prev,
                          opacity: newValue,
                        }));
                        updateElementShadow(undefined, undefined, {
                          color: `rgba(0,0,0,${newValue})`,
                          offsetX: elementShadowValues.distance,
                          offsetY: elementShadowValues.distance,
                          blur: elementShadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0}
                      max={1}
                    />
                    <Typography id="distance-slider" gutterBottom>
                      Distance
                    </Typography>
                    <Slider
                      aria-labelledby="distance-slider"
                      value={elementShadowValues.distance}
                      onChange={(event, newValue) => {
                        setElementShadowValues((prev) => ({
                          ...prev,
                          distance: newValue,
                        }));
                        updateElementShadow(undefined, undefined, {
                          color: `rgba(0,0,0,${elementShadowValues.opacity})`,
                          offsetX: newValue,
                          offsetY: newValue,
                          blur: elementShadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={50}
                    />
                    <Typography id="blur-slider" gutterBottom>
                      Blur
                    </Typography>
                    <Slider
                      aria-labelledby="blur-slider"
                      value={elementShadowValues.blur}
                      onChange={(event, newValue) => {
                        setElementShadowValues((prev) => ({
                          ...prev,
                          blur: newValue,
                        }));
                        updateElementShadow(undefined, undefined, {
                          color: `rgba(0,0,0,${elementShadowValues.opacity})`,
                          offsetX: elementShadowValues.distance,
                          offsetY: elementShadowValues.distance,
                          blur: newValue,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={20}
                    />
                  </div>
                )}
                {show === "elementShadow" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={elementOpacity}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setElementOpacity(value);
                        updateElementOpacity();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {/* {show === 'colors1' && (
									<Box className={classes.optionsContainer}>
										<>
											<input
												type='color'
												value={color}
												onChange={(e) => setColor(e.target.value)}
											/>
											<Button
												onClick={colorApplied ? removeColor : applyColor}
												sx={{
													color: 'white',
													textTransform: 'none',
												}}
											>
												{colorApplied ? 'Color' : 'Color'}
												{colorApplied ? 'Remove Color' : 'Apply Color'}
											</Button> 
											<select
												value={fontSize}
												onChange={(e) =>
													applyFontSize(parseInt(e.target.value))
												}
											>
												<option value={12}>12</option>
												<option value={14}>14</option>
												<option value={16}>16</option>
												<option value={18}>18</option>
												<option value={20}>20</option>
												<option value={22}>22</option>
												<option value={24}>24</option>
												<option value={26}>26</option>
												<option value={28}>28</option>
												<option value={30}>30</option>
												<option value={32}>32</option>
												<option value={34}>34</option>
												<option value={36}>36</option>

												
											</select>
											<Button
												sx={{
													color: 'white',
													textTransform: 'none',
												}}
											>
												Font Size
											</Button>
											<select
												value={fontFamily}
												onChange={(e) => applyFontFamily(e.target.value)}
											>
												<option value='Arial'>Arial</option>
												<option value='Helvetica'>Helvetica</option>
											
												<option value='Fira Sans'>Fira Sans</option>
												<option value='Pacifico'>Pacifico</option>
												<option value='VT323'>VT323</option>
												<option value='Quicksand'>Quicksand</option>
												<option value='Inconsolata'>Inconsolata</option>
												<option value='Roboto'>Roboto</option>
											</select>
											<Button
												sx={{
													color: 'white',
													textTransform: 'none',
												}}
											>
												Font Family
											</Button>
											<Button
												onClick={applyFontWeight}
												sx={{
													color: 'white',
													textTransform: 'none',
												}}
											>
												{fontWeightApplied ? 'Bold' : 'Bold'}
										
											</Button>
										</>
										
									</Box>
								)} */}
                {show === "bgColors" && (
                  <Box className={classes.optionsContainer}>
                    {/* <CustomColorPicker
											value={overlayTextFiltersState.color}
											changeHandler={(color: string) => {
												updateTextBox(canvas, { fill: color });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													color,
												}));
											}}
										/> */}
                  </Box>
                )}

                {show === "fontWeight" && (
                  <Box my={2} className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
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
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}

                {show === "size" && (
                  <Box my={2} className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
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
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}
                {show === "charSpacing" && (
                  <Box my={2} className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
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
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}
                {show === "font" && (
                  <FontsTab value={value} handleChange={handleChange} />
                )}
              </Paper>
            </div>
          )}
          {activeTab == "bubble" && dropDown && (
            <div>
              <Paper className={classes.root}>
                <Box className={classes.optionsContainer}>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("colors")}
                  >
                    COLORS
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("size")}
                  >
                    SIZE
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("shadow")}
                  >
                    SHADOW
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("contrast")}
                    // onClick={() => handleButtonClick("Contrast")}
                  >
                    CONTRAST
                  </Typography>
                  <Typography
                    className={classes.heading}
                    onClick={() => setShow("brightness")}
                    // onClick={() => handleButtonClick("Contrast")}
                  >
                    BRIGHTNESS
                  </Typography>
                </Box>

                {show === "colors" && (
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

                {show === "size" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
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
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}
                {show === "shadow" && (
                  <div>
                    <Typography id="opacity-slider" gutterBottom>
                      Opacity
                    </Typography>
                    <Slider
                      aria-labelledby="opacity-slider"
                      value={shadowValues.opacity}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          opacity: newValue,
                        }));
                        updateBubbleImage(undefined, undefined, {
                          color: `rgba(0,0,0,${newValue})`,
                          offsetX: shadowValues.distance,
                          offsetY: shadowValues.distance,
                          blur: shadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0}
                      max={1}
                    />
                    <Typography id="distance-slider" gutterBottom>
                      Distance
                    </Typography>
                    <Slider
                      aria-labelledby="distance-slider"
                      value={shadowValues.distance}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          distance: newValue,
                        }));
                        updateBubbleImage(undefined, undefined, {
                          color: `rgba(0,0,0,${shadowValues.opacity})`,
                          offsetX: newValue,
                          offsetY: newValue,
                          blur: shadowValues.blur,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={50}
                    />
                    <Typography id="blur-slider" gutterBottom>
                      Blur
                    </Typography>
                    <Slider
                      aria-labelledby="blur-slider"
                      value={shadowValues.blur}
                      onChange={(event, newValue) => {
                        setShadowValues((prev) => ({
                          ...prev,
                          blur: newValue,
                        }));
                        updateBubbleImage(undefined, undefined, {
                          color: `rgba(0,0,0,${shadowValues.opacity})`,
                          offsetX: shadowValues.distance,
                          offsetY: shadowValues.distance,
                          blur: newValue,
                        });
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={20}
                    />
                  </div>
                )}

                {show === "contrast" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={bubbleFilter.contrast}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setBubbleFilter((prev) => ({
                          ...prev,
                          contrast: value,
                        }));
                        updateBubbleImageContrast();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}

                {show === "brightness" && (
                  <div className={classes.sliderContainer}>
                    <Slider
                      className={classes.slider}
                      aria-label="size"
                      color="secondary"
                      value={bubbleFilter.brightness}
                      min={-1}
                      max={1}
                      onChange={(e: any) => {
                        const value = +e.target.value;
                        setBubbleFilter((prev) => ({
                          ...prev,
                          brightness: value,
                        }));
                        updateBubbleImageBrightness();
                      }}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </div>
                )}
              </Paper>
            </div>
          )}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 0,
              width: "97%",
            }}
            onClick={() => {
              dropDown ? setDropDown(false) : setDropDown(true);
            }}
          >
            {dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </Paper>
          <div
            style={{
              display: "flex",
              marginTop: "16px",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={() => updateActiveTab("background")}
            >
              <img
                src="/Tab-Icons/background.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "background" ? filter : undefined,
                }}
              />
            </button>

            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => updateActiveTab("title")}
            >
              <img
                src="/Tab-Icons/Edit-Text.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "title" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("bubble")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Add-Bubble.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "bubble" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("element")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Add-Elements.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "element" ? filter : undefined,
                }}
              />
            </button>

            <button
              onClick={() => updateActiveTab("writePost")}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/Tab-Icons/Write-Post.png"
                width="100"
                height="100"
                style={{
                  color: "white",
                  fontSize: "30px",
                  filter: activeTab === "writePost" ? filter : undefined,
                }}
              />
            </button>
          </div>
        </div>

        {/* Footer Panel  End*/}
        {/* Sidebar Tools Panel */}
        {/* <Sidebar /> */}
        <div>
          <div style={{ width: "300px", height: "480px", padding: "10px" }}>
            {activeTab == "background" && (
              <div>
                <h4
                  style={{
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  From Article
                </h4>

                <ImageViewer
                  clickHandler={(img: string) => updateBackgroundImage(img)}
                  images={initialData.backgroundImages}
                >
                  {template.diptych === "vertical" ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        py: 1,
                      }}
                    >
                      <div>Top Images</div>
                      <div>Bottom Images</div>
                    </Box>
                  ) : template.diptych === "horizontal" ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
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

                    <form method="post" encType="multipart/form-data">
                      <input
                        type="file"
                        onChange={(event) =>
                          uploadImage(event, "backgroundImages")
                        }
                        style={{ display: "none" }}
                      />
                    </form>
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon style={{ fontSize: "40px" }} />
                    </IconButton>
                  </label>
                </Box>
              </div>
            )}

            {activeTab == "title" && (
              <div>
                <h4 style={{ margin: "0px", padding: "0px" }}>Titles</h4>
                <div style={{ marginTop: "20px" }}>
                  {texts.map((text: string) => {
                    return (
                      <h5
                        onClick={() => {
                          const existingObject = getExistingObject("title") as
                            | fabric.Textbox
                            | undefined;

                          if (!existingObject)
                            return createTextBox(canvas, {
                              text,
                              customType: "title",
                              fill: "#fff",
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
                          margin: "0px",
                          marginBottom: "15px",
                          cursor: "pointer",
                          color: "#a19d9d",
                        }}
                      >
                        {text}
                      </h5>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab == "bubble" && (
              <div>
                <h4 style={{ margin: "0px", padding: "0px" }}>From Article</h4>
                <ImageViewer
                  clickHandler={(img: string) => updateBubbleImage(img)}
                  images={initialData.bubbles}
                />

                <h4 style={{ margin: "0px", padding: "0px" }}>AI Images</h4>
                <ImageViewer
                  clickHandler={(img: string) => updateBubbleImage(img)}
                  images={initialData.bubbles}
                />

                <Box {...styles.uploadBox}>
                  <label style={styles.uploadLabel}>
                    <h4>IMAGE UPLOAD</h4>

                    <form method="post" encType="multipart/form-data">
                      <input
                        type="file"
                        onChange={(event) => uploadImage(event, "bubbles")}
                        style={{ display: "none" }}
                      />
                    </form>
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon style={{ fontSize: "40px" }} />
                    </IconButton>
                  </label>
                </Box>
              </div>
            )}

            {activeTab == "element" && (
              <div>
                <>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        pb: 1.5,
                      }}
                    >
                      Choose Element
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {swipeData?.map(({ swipeImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={swipeImg}
                              onClick={() => {
                                const color =
                                  userMetaData?.company?.color || "#ffffff";
                                var filter =
                                  new fabric.Image.filters.BlendColor({
                                    color,
                                    mode: "tint",
                                    alpha: 1,
                                  });

                                fabric.Image.fromURL(
                                  swipeImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    img.filters.push(filter);
                                    img.applyFilters();
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {elements.map((element: string) => {
                        return (
                          <img
                            key={element}
                            src={element}
                            onClick={() => {
                              const iconSrc = "/icons/swipe.svg";
                              const color =
                                userMetaData?.company?.color || "#ffffff";
                              createSwipeGroup(canvas, {}, iconSrc, color);
                            }}
                            alt=""
                            width="90px"
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
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
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        pt: 1,
                      }}
                    >
                      Borders
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        pt: 1.5,
                      }}
                    >
                      {shapeData?.map(({ imgShape }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={imgShape}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  imgShape,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        pt: 1.5,
                      }}
                    >
                      {dividersData?.map(({ dividerImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={dividerImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  dividerImg,
                                  function (img) {
                                    img.set({ left: 200, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "40px",
                                height: "20px",
                                // border: '1px solid red',
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {borders.map((border: string) => {
                        return (
                          <img
                            key={border}
                            src={border}
                            onClick={() => {
                              const imageObject = getExistingObject(
                                "borders"
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
                                    mode: "tint",
                                    alpha: 1,
                                  });
                                imageObject.filters.push(filter);
                                imageObject.applyFilters();
                                return canvas?.renderAll();
                              } else
                                createImage(canvas, border, {
                                  customType: "borders",
                                });
                            }}
                            alt=""
                            width="90px"
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
                            }}
                          />
                        );
                      })}
                      <CustomColorPicker
                        // value={overlayTextFiltersState.color}
                        value={userMetaData?.company?.color}
                        changeHandler={(color: string) => {
                          const type = "borders";
                          let existingObject = getExistingObject(type) as
                            | fabric.Image
                            | undefined;
                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "image"
                          )
                            existingObject =
                              canvas?._activeObject as fabric.Image;

                          if (!existingObject) {
                            console.log("existing Border object not founded");
                            return;
                          }
                          const blendColorFilter =
                            new fabric.Image.filters.BlendColor({
                              color,
                              mode: "tint",
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
                    {/* <input
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
											placeholder='Social Tags '
											defaultValue='Social Tags'
										/> */}

                    <h4>Social Tags</h4>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData1?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData2?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {socialPlatformsData3?.map(({ spImg }, i) => {
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={spImg}
                              onClick={() => {
                                fabric.Image.fromURL(
                                  spImg,
                                  function (img) {
                                    img.set({ left: 230, top: 250 }).scale(0.2);
                                    canvas.add(img);
                                    requestAnimationFrame(() => {
                                      canvas.renderAll();
                                    });
                                  },
                                  {
                                    crossOrigin: "anonymous",
                                  }
                                );
                              }}
                              alt=""
                              // width='90px'
                              style={{
                                cursor: "pointer",
                                paddingBottom: "0.5rem",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      {logos?.map((logo: string) => {
                        const logoFillColor =
                          userMetaData?.company?.color || "black";

                        return (
                          <img
                            key={logo}
                            src={logo}
                            alt="logo"
                            onClick={() => {
                              const existingTextObject = getExistingObject(
                                "hashtag"
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
                                  "hashtag"
                                );
                              else
                                createTextBox(canvas, {
                                  // fill: overlayTextFiltersState.color,
                                  fill: userMetaData?.company?.color,
                                  customType: "hashtag",
                                });
                            }}
                            style={{
                              cursor: "pointer",
                              paddingBottom: "0.5rem",
                            }}
                            width="90px"
                          />
                        );
                      })}
                      <CustomColorPicker
                        value={userMetaData?.company?.color}
                        // value={overlayTextFiltersState.color}
                        changeHandler={(color: string) => {
                          const type = "hashtag";

                          let existingTextObject = getExistingObject(type) as
                            | fabric.Textbox
                            | undefined;
                          if (
                            canvas?._activeObject &&
                            canvas?._activeObject?.type === "textbox"
                          )
                            existingTextObject =
                              canvas?._activeObject as fabric.Textbox;

                          if (!existingTextObject) return;
                          updateTextBox(canvas, { fill: color }, "hashtag");
                        }}
                      />
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
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
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
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
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
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
                                crossOrigin: "anonymous",
                              }
                            );
                          }}
                          alt=""
                          // width='90px'
                          style={{
                            cursor: "pointer",
                            paddingBottom: "0.5rem",
                            width: "80px",
                            height: "60px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </>
              </div>
            )}

            {activeTab == "writePost" && (
              <div>
                <h2>Write post</h2>
              </div>
            )}
          </div>
          <div style={{ marginTop: "40%", position: "relative" }}>
            <button
              onClick={() => saveImage(canvas)}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
              }}
            >
              Export
            </button>
          </div>
          <div style={{ marginTop: "5%", position: "relative" }}>
            <button
              onClick={() => saveJSON(canvas)}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#3b0e39",
                color: "white",
              }}
            >
              JSON
            </button>
          </div>
          {activeTab !== "writePost" && (
            <div
              style={{
                marginTop: "5%",
                position: "relative",
                cursor: "pointer",
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
                  width: "100%",
                  height: "42px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#3b0e39",
                  color: "white",
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
