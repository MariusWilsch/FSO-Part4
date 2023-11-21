import axios from 'axios';
const baseURL = 'http://localhost:3003/api/blogs';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
	return token;
};

const getAll = async () => {
	const res = await axios.get(baseURL);
	return res.data;
};

const create = async (newObject) => {
	console.log('Creating new blog');
	const config = { headers: { Authorization: token } };
	const response = await axios.post(baseURL, newObject, config);
	console.log(response.status);
	return response.data;
};

export default { getAll, setToken, create };
