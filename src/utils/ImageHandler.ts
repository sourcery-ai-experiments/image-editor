// @ts-nocheck
import { fabric } from 'fabric';

export const createImage = (
	canvas: fabric.Canvas | null,
	imageUrl: string,
	options: fabric.IImageOptions
): Promise<fabric.Image | undefined> => {
	return new Promise((resolve) => {
		if (!canvas) {
			resolve(undefined);
			return;
		}

		fabric.Image.fromURL(
			imageUrl,
			function (img) {
				const imgWidth = img.width || 0;
				const snappyImg = new fabric.SnappyImage(img.getElement(), {
					left: canvas.getWidth() / 2 - imgWidth / 2,
					top: canvas.getHeight() / 2,
					...options,
				});
				if (options.customType) snappyImg.customType = options.customType;
				snappyImg.applyFilters();
				canvas.add(snappyImg);
				canvas.centerObject(snappyImg);
				requestAnimationFrame(() => {
					canvas.renderAll();
				});
			},
			{
				crossOrigin: 'anonymous',
			}
		);

		// fabric.Image.fromURL(
		//   imageUrl,
		//   (img) => {
		//     const imgWidth = img.width || 0;
		//     const defaultOptions: fabric.IImageOptions = {
		//       left: canvas.getWidth() / 2 - imgWidth / 2,
		//       top: canvas.getHeight() / 2,
		//     };

		//     img.set({ ...defaultOptions, ...options });

		//     if (options.customType) img.customType = options.customType;
		//     img.applyFilters();
		//     canvas.add(img);
		//     canvas.renderAll();

		//     resolve(img);
		//   },
		//   {
		//     crossOrigin: "anonymous",
		//   }
		// );
	});
};

export const createImageLogo = (
	canvas: fabric.Canvas | null,
	imageUrl: string,
	options: fabric.IImageOptions
): Promise<fabric.Image | undefined> => {
	return new Promise((resolve) => {
		if (!canvas) {
			resolve(undefined);
			return;
		}
		console.log('imageUrl', imageUrl);

		fabric.Image.fromURL(
			imageUrl,
			(img) => {
				const imgWidth = img.width || 0;
				const defaultOptions: fabric.IImageOptions = {
					left: canvas.getWidth() / 2 - imgWidth / 2,
					top: canvas.getHeight() / 2,
				};

				img.set({ ...defaultOptions, ...options });

				if (options.customType) img.customType = options.customType;
				img.applyFilters();
				canvas.add(img);
				canvas.renderAll();

				resolve(img);
			},
			{
				crossOrigin: 'anonymous',
			}
		);
	});
};

export const updateImageSource = (
	canvas: fabric.Canvas,
	imageUrl: string,
	activeObject: fabric.Object
) => {
	activeObject.setSrc(
		imageUrl,
		() => {
			const { width, height } = canvas;

			if (!(width && height)) return;

			let scaleToWidth = width;
			let scaleToHeight = height;

			activeObject.scaleToWidth(scaleToWidth);
			activeObject.scaleToHeight(scaleToHeight);

			activeObject.center();
			requestAnimationFrame(() => {
				canvas.renderAll();
			});
		},
		{
			crossOrigin: 'anonymous',
		}
	);
};
export const updateImageProperties = (
	canvas: fabric.Canvas | null,
	imageObject: fabric.Image,
	options: fabric.IImageOptions
) => {
	if (!canvas) return;

	if (imageObject && imageObject.isType('image')) {
		// Check if the object is an image
		imageObject.set({
			...options,
		});
		x;
		imageObject.filters = [imageObject.filters, options.filters];
		imageObject.applyFilters();
		return canvas.renderAll();
	}
};

export const scaleToFit = (
	img: fabric.Image,
	dimension: { width: number; height: number }
) => {
	const { width, height } = dimension;
	const widthScaleFactor = width / img.width!;
	const heightScaleFactor = height / img.height!;

	// Use the minimum scale factor to fit the image within both width and height
	const scaleFactor = Math.max(widthScaleFactor, heightScaleFactor);

	img.scaleToWidth(img.width! * scaleFactor);
	img.scaleToHeight(img.height! * scaleFactor);

	// const scaleFactor = Math.max((width / 2) / img.width!, height / img.height!);

	// img.scaleToWidth(img.width! * scaleFactor);
	// img.scaleToHeight(img.height! * scaleFactor);
};

export const updateImageColor = (
	canvas: fabric.Canvas | null,
	activeObject: fabric.Image,
	color: string
) => {
	if (!canvas) return;
	// if (activeObject) {
	console.log('activeObject color', color);
	var filter = new fabric.Image.filters.BlendColor({
		color,
		mode: 'tint',
		alpha: 1,
	});
	activeObject.filters.push(filter);
	activeObject.applyFilters();
	return canvas.renderAll();
	// }
};
