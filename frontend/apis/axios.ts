import axios from 'axios';
import { config } from 'dotenv';

config();

const baseURL = process.env.NEXT_PUBLIC_BACKEND_HOST;
axios.defaults.baseURL = baseURL;

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] =  'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
	async function (conf) {
			return conf
	},

	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		return Promise.reject(error);
	}
);

export default axios;