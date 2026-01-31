import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';
import { PixelArtModel } from './PixelArtModel';

function isValidPixelArt(payload: any) {
	if (!payload) return false;
	if (!payload.auth0ID || typeof payload.auth0ID !== 'string') return false;
	if (!payload.gridSize || typeof payload.gridSize !== 'number') return false;
	if (payload.gridSize < 1 || payload.gridSize > 128) return false;
	if (!Array.isArray(payload.pixels)) return false;

	for (const pixel of payload.pixels) {
		if (typeof pixel.x !== 'number' || typeof pixel.y !== 'number') return false;
		if (typeof pixel.color !== 'string') return false;
		if (pixel.x < 0 || pixel.y < 0) return false;
		if (pixel.x >= payload.gridSize || pixel.y >= payload.gridSize) return false;
	}

	return true;
}

export async function savePixelArt(auth0ID: string, payload: any) {
	if (!auth0ID) {
		throw new HttpError(400, 'auth0ID is missing');
	}

	const data: any = {
		auth0ID,
		gridSize: payload.gridSize,
		pixels: payload.pixels,
	};

	if (!isValidPixelArt(data)) {
		throw new HttpError(400, 'invalid pixel art payload');
	}

	try {
		const updated = await PixelArtModel.findOneAndUpdate(
			{ auth0ID },
			{ $set: data },
			{ new: true, upsert: true },
		);

		return updated;
	} catch (error) {
		logger.error('failed to save pixel art', error);
		throw new HttpError(500, 'failed to save pixel art');
	}
}

export async function getPixelArt(auth0ID: string) {
	if (!auth0ID) {
		throw new HttpError(400, 'auth0ID is missing');
	}

	try {
		const pixelArt = await PixelArtModel.findOne({ auth0ID });
		if (!pixelArt) {
			throw new HttpError(404, 'pixel art not found');
		}
		return pixelArt;
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}
		logger.error('failed to load pixel art', error);
		throw new HttpError(500, 'failed to load pixel art');
	}
}
