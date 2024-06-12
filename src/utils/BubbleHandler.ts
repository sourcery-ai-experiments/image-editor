//  // @ts-nocheck
import { fabric } from 'fabric';
import { getExistingObject } from '.';
import { scaleToFit } from './ImageHandler';

fabric.Object.prototype.noScaleCache = false;

interface BubbleObject {
	left: number;
	top: number;
}
export const createBubbleElement = (
	canvas: fabric.Canvas,
	imgUrl: string,
	obj: BubbleObject
	// options?: fabric.ICircleOptions
) => {
	// const existingBubbleStroke = getExistingObject(
	// 	canvas,
	// 	'bubbleStroke'
	// ) as fabric.Circle;

	const id: number = Math.floor(Math.random() * 100);
	// Random left position between 100 and 450
	// const left = Math.floor(Math.random() * (450 - 100 + 1)) + 100;
	// const top = Math.floor(Math.random() * (450 - 100 + 1)) + 100;

	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	var strokeCircle = new fabric.Circle({
		radius: 100,
		left: obj?.left ? obj.left : left,
		top: obj?.top ? obj.top : top,
		// left:280,
		// top:280,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		strokeWidth: 10,
		stroke: '#ffffff',
		strokeUniform: false,
		selectable: true,
		// ...(existingBubbleStroke && { ...existingBubbleStroke }),
		// ...options,
	});
	(strokeCircle as any).customId = id;

	// const existingBubble = getExistingObject(canvas, 'bubble') as fabric.Circle;
	var clipPath = new fabric.Circle({
		radius: strokeCircle.radius!,
		left: strokeCircle.left,
		top: strokeCircle.top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		opacity: 1,
		visible: true,
		selectable: true,
		strokeUniform: true,
		perPixelTargetFind: true,
		absolutePositioned: true,
		// ...(existingBubble && { ...existingBubble.clipPath }),
	});

	(clipPath as any).customType = 'bubbleClipPath';
	(clipPath as any).customId = id;
	var imageElement = document.createElement('img');
	imageElement.src = imgUrl;
	imageElement.crossOrigin = 'anonymous';

	// Add the image to the canvas when needed
	imageElement.onload = function () {
		var fabricImage = new fabric.Image(imageElement);
		(fabricImage as any).customType = 'bubble';
		(fabricImage as any).customId = id;

		fabricImage.clipPath = clipPath;

		var circleCenter = strokeCircle.getCenterPoint();
		const circleRadius = strokeCircle.radius!;
		const scaleFactor = Math.max(
			(circleRadius * 2) / fabricImage.width!,
			(circleRadius * 2) / fabricImage.height!
		);

		const imgFitWidth = strokeCircle.width! + 50;
		const imgFitHeight = strokeCircle.height! + 50;

		scaleToFit(fabricImage, { width: imgFitWidth, height: imgFitHeight });

		fabricImage
			.set({
				absolutePositioned: false,
				perPixelTargetFind: true,
				left: circleCenter.x - (fabricImage.width! * scaleFactor) / 2 - 30,
				top: circleCenter.y - (fabricImage.height! * scaleFactor) / 2 - 30,
			})
			.setCoords();

		(strokeCircle as any).customType = 'bubbleStroke';
		(strokeCircle as any).customId = id;
		// if (existingBubble) canvas?.remove(existingBubble);
		// if (existingBubbleStroke) canvas?.remove(existingBubbleStroke);
		canvas.add(strokeCircle);
		canvas.add(fabricImage);

		strokeCircle.on('moving', function () {
			var circleCenter = strokeCircle.getCenterPoint();
			var imageCenter = fabricImage.getCenterPoint();

			var offsetX = circleCenter.x - imageCenter.x;
			var offsetY = circleCenter.y - imageCenter.y;

			fabricImage
				.set({
					left: fabricImage.left! + offsetX,
					top: fabricImage.top! + offsetY,
				})
				.setCoords();

			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
				})
				.setCoords();
		});

		strokeCircle.on('scaling', function () {
			clipPath.scaleToWidth(strokeCircle.getScaledWidth());
			clipPath.scaleToHeight(strokeCircle.getScaledHeight());
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
					scaleX: strokeCircle.scaleX,
					scaleY: strokeCircle.scaleY,
					radius: strokeCircle.radius!,
				})
				.setCoords();
		});

		canvas.renderAll();
	};
};
export const createBubbleElement1 = (
	canvas: fabric.Canvas,
	imgUrl: string,
	options?: fabric.ICircleOptions
) => {
	const existingBubbleStroke = getExistingObject(
		canvas,
		'bubbleStroke'
	) as fabric.Circle;

	// const left = Math.floor(Math.random() * (450 - 100 + 1)) + 100;
	// const top = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
	const left = canvas.getWidth() / 2; //centerX
	const top = canvas.getHeight() / 2; //centerY

	var strokeCircle = new fabric.Circle({
		radius: 100,
		left: left,
		top: top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		strokeWidth: 10,
		stroke: '#ffffff',
		strokeUniform: false,
		selectable: true,
		...(existingBubbleStroke && { ...existingBubbleStroke }),
		...options,
	});

	const existingBubble = getExistingObject(canvas, 'bubble') as fabric.Circle;
	var clipPath = new fabric.Circle({
		radius: strokeCircle.radius!,
		left: strokeCircle.left,
		top: strokeCircle.top,
		originX: 'center',
		originY: 'center',
		fill: 'transparent',
		opacity: 1,
		visible: true,
		selectable: true,
		strokeUniform: true,
		perPixelTargetFind: true,
		absolutePositioned: true,
		...(existingBubble && { ...existingBubble.clipPath }),
	});

	(clipPath as any).customType = 'bubbleClipPath';
	var imageElement = document.createElement('img');
	imageElement.src = imgUrl;
	imageElement.crossOrigin = 'anonymous';

	// Add the image to the canvas when needed
	imageElement.onload = function () {
		var fabricImage = new fabric.Image(imageElement);
		(fabricImage as any).customType = 'bubble';

		fabricImage.clipPath = clipPath;

		var circleCenter = strokeCircle.getCenterPoint();
		const circleRadius = strokeCircle.radius!;
		const scaleFactor = Math.max(
			(circleRadius * 2) / fabricImage.width!,
			(circleRadius * 2) / fabricImage.height!
		);

		const imgFitWidth = strokeCircle.width! + 50;
		const imgFitHeight = strokeCircle.height! + 50;

		scaleToFit(fabricImage, { width: imgFitWidth, height: imgFitHeight });

		fabricImage
			.set({
				absolutePositioned: false,
				perPixelTargetFind: true,
				left: circleCenter.x - (fabricImage.width! * scaleFactor) / 2 - 30,
				top: circleCenter.y - (fabricImage.height! * scaleFactor) / 2 - 30,
			})
			.setCoords();

		(strokeCircle as any).customType = 'bubbleStroke';
		if (existingBubble) canvas?.remove(existingBubble);
		if (existingBubbleStroke) canvas?.remove(existingBubbleStroke);
		canvas.insertAt(strokeCircle, 4, false);
		canvas.insertAt(fabricImage, 5, false);

		let prevLeft = strokeCircle.left!;
		let prevTop = strokeCircle.top!;

		strokeCircle.on('moving', function () {
			// Get the current position of the strokeCircle
			const currentLeft = strokeCircle.left!;
			const currentTop = strokeCircle.top!;

			// Calculate the delta (difference) in position
			const deltaX = currentLeft - prevLeft;
			const deltaY = currentTop - prevTop;

			// Update the previous position to the current position for the next move
			prevLeft = currentLeft;
			prevTop = currentTop;

			// Update the image position by the same delta
			fabricImage
				.set({
					left: fabricImage.left! + deltaX,
					top: fabricImage.top! + deltaY,
				})
				.setCoords();

			// Update the clipPath position to match the strokeCircle
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
				})
				.setCoords();

			canvas.renderAll();
		});

		strokeCircle.on('scaling', function () {
			clipPath.scaleToWidth(strokeCircle.getScaledWidth());
			clipPath.scaleToHeight(strokeCircle.getScaledHeight());
			clipPath
				.set({
					left: strokeCircle.left,
					top: strokeCircle.top,
					scaleX: strokeCircle.scaleX,
					scaleY: strokeCircle.scaleY,
					radius: strokeCircle.radius!,
				})
				.setCoords();
		});

		canvas.renderAll();
	};
};

export const updateBubbleElement = (
	canvas: fabric.Canvas,
	strokeCircle: fabric.Circle,
	options?: fabric.ICircleOptions
) => {
	const imageClipPath = getExistingObject(canvas, 'bubble')
		?.clipPath as fabric.Circle;

	// Update strokeCircle properties
	if (options) {
		if (options.strokeWidth !== undefined) {
			// Update the clipPath radius to maintain the desired stroke outside the circle
			imageClipPath.radius = strokeCircle.radius!;
			imageClipPath.setCoords();
		}

		strokeCircle.set({
			...options,
			radius: strokeCircle.radius,
			strokeUniform: false,
		});
		canvas?.requestRenderAll();
	}
};

export const createBubble = (canvas: fabric.Canvas, imgUrl: string) => {
	fabric.Image.fromURL(
		imgUrl,
		function (img: fabric.Image) {
			// Set the maximum radius for the circular clip mask
			var maxRadius = 80;
			let scale = +Math.min(270 / img.width!, 270 / img.height!).toFixed(2);

			img.scale(scale).set({
				angle: 0,
				originX: 'center',
				originY: 'center',
			});
			img.center();

			// Create a circular clip mask
			var clipMask = new fabric.Circle({
				radius: maxRadius,
				originX: 'center',
				originY: 'center',
				fill: 'transparent',
				absolutePositioned: true,
				strokeWidth: 10, // Set border width
				stroke: '#fff', // Set border color
			});
			// Group the image and the clip mask
			var group = new fabric.Group([img, clipMask], {
				clipPath: clipMask,
			});

			(group as any).customType = 'bubble';
			// Add the group to the canvas
			canvas.add(group);

			// Render the canvas
			canvas.renderAll();
		},
		{
			crossOrigin: 'anonymous',
		}
	);
};
