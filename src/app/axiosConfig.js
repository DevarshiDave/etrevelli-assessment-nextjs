const { default: axios } = require("axios");

const httpService = axios.create({
    baseURL: "https://swapi.dev/api"
})

export default httpService;