import axios from "axios";

const mangaApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist-manga/",
});

const animeApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist/",
});

export { mangaApi, animeApi };
