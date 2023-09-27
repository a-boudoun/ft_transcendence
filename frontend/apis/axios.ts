import axios from 'axios';

const baseURL = process.env.BACKEND || "http://localhost:8000/";

axios.defaults.baseURL = baseURL;


axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] =  'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
	async function (config) {
		
			return config
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
		console.log(error);
		return Promise.reject(error);
	}
);

export default axios;