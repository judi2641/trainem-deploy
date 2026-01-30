import https from 'https';
import { logger } from './logger';

interface OpenAIResponse {
	output?: Array<{
		type?: string;
		content?: Array<{ type?: string; text?: string }>;
	}>;
}

export async function createOpenAIResponse(payload: Record<string, unknown>): Promise<OpenAIResponse> {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		throw new Error('OPENAI_API_KEY is not set');
	}

	const body = JSON.stringify(payload);
	const start = Date.now();
	const model = typeof payload.model === 'string' ? payload.model : 'unknown';

	return new Promise((resolve, reject) => {
		const req = https.request(
			{
				hostname: 'api.openai.com',
				path: '/v1/responses',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(body),
					Authorization: `Bearer ${apiKey}`,
				},
			},
			(res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					const durationMs = Date.now() - start;
					if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
						try {
							const parsed = JSON.parse(data);
							const usage = parsed?.usage;
							const tokens = usage
								? ` tokens_in=${usage.input_tokens ?? 0} tokens_out=${usage.output_tokens ?? 0}`
								: '';
							logger.info(
								`openai response ok model=${model} status=${res.statusCode} duration_ms=${durationMs}${tokens}`,
							);
							resolve(parsed);
						} catch (err) {
							logger.warn(
								`openai response parse_failed model=${model} status=${res.statusCode} duration_ms=${durationMs}`,
							);
							reject(err);
						}
					} else {
						logger.warn(
							`openai response error model=${model} status=${res.statusCode} duration_ms=${durationMs}`,
						);
						reject(new Error(`OpenAI error ${res.statusCode}: ${data}`));
					}
				});
			},
		);

		req.on('error', reject);
		req.write(body);
		req.end();
	});
}

export function extractOutputText(response: OpenAIResponse): string {
	const direct = (response as { output_text?: string }).output_text;
	if (typeof direct === 'string' && direct.length > 0) {
		return direct;
	}

	const outputAny = (response as { output?: unknown }).output;
	if (Array.isArray(outputAny)) {
		for (const item of outputAny) {
			if (item && typeof item === 'object') {
				const itemText = (item as { text?: string; output_text?: string }).text ?? (item as { output_text?: string }).output_text;
				if (typeof itemText === 'string' && itemText.length > 0) {
					return itemText;
				}
				const itemJson = (item as { json?: unknown }).json;
				if (itemJson && typeof itemJson === 'object') {
					return JSON.stringify(itemJson);
				}
			}
		}
	}

	const output = response.output;
	if (Array.isArray(output)) {
		for (const item of output) {
			if (!item?.content || !Array.isArray(item.content)) continue;
			for (const content of item.content) {
				if (typeof content.text === 'string' && content.text.length > 0) {
					return content.text;
				}
				const jsonText = (content as { json?: unknown }).json;
				if (typeof jsonText === 'string' && jsonText.length > 0) {
					return jsonText;
				}
				if (jsonText && typeof jsonText === 'object') {
					return JSON.stringify(jsonText);
				}
			}
		}
	}

	const found = findWorkoutsObject(response as Record<string, unknown>);
	if (found) {
		return JSON.stringify(found);
	}

	const summary = summarizeResponse(response as Record<string, unknown>);
	logger.warn(`openai response has no extractable text: ${summary}`);
	throw new Error('No output text found in OpenAI response');
}

function findWorkoutsObject(value: unknown): unknown | null {
	if (!value || typeof value !== 'object') return null;
	const asRecord = value as Record<string, unknown>;
	if (Array.isArray(asRecord.workouts)) {
		return asRecord;
	}
	for (const key of Object.keys(asRecord)) {
		const found = findWorkoutsObject(asRecord[key]);
		if (found) return found;
	}
	return null;
}

function summarizeResponse(response: Record<string, unknown>): string {
	const output = response.output;
	const summary = Array.isArray(output)
		? output.map((item) => {
				const contentTypes = Array.isArray((item as { content?: unknown }).content)
					? (item as { content: Array<{ type?: string }> }).content.map((c) => c.type ?? 'unknown')
					: [];
				return {
					type: (item as { type?: string }).type ?? 'unknown',
					contentTypes,
					keys: item && typeof item === 'object' ? Object.keys(item as Record<string, unknown>) : [],
				};
			})
		: [];
	return JSON.stringify({ hasOutput: Array.isArray(output), outputSummary: summary }).slice(0, 1500);
}
