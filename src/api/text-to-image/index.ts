import { BaseURL } from '../../constants';

export async function textToImage(prompt: string) {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	const raw = JSON.stringify({
		prompt: prompt,
		dall_e_version: 'dall-e-3',
	});

	const requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	try {
		const response = await fetch(`${BaseURL}/api/get-images`, requestOptions);
		const result = await response.json();

		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}
