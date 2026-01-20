export interface IPixel {
	x: number;
	y: number;
	color: string;
}

export interface IPixelArt {
	auth0ID: string;
	gridSize: number;
	pixels: IPixel[];
}
