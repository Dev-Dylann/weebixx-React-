import axios from "axios";
import { META, MANGA } from "@consumet/extensions";

const mangaApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist-manga/",
});

const animeApi = axios.create({
  baseURL: "https://api.consumet.org/meta/anilist/",
});

const anilist = new META.Anilist();
const mangakakalot = new MANGA.MangaKakalot();

export { mangaApi, animeApi, anilist, mangakakalot };
