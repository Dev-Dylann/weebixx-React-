import axios from "axios";
import { META } from "@consumet/extensions";

const mangaApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist-manga/",
});

const animeApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist/",
});

const anilist = new META.Anilist();

export { mangaApi, animeApi, anilist };
