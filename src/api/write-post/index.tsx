import { BaseURL } from '../../constants';

export async function getSummary(formData: {
	url: string;
	vibe: string;
	format: string;
	emojis: boolean;
	hashtags: string[];
	social_media: string;
	char_count: number;
}) {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	const raw = JSON.stringify(formData);

	const requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	try {
		const response = await fetch(`${BaseURL}/api/get-summary`, requestOptions);
		const result = await response.json();
		// console.log('🚀 ~ result:', result);

		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}
