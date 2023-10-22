import axios from "axios";
import { META, MANGA, ANIME } from "@consumet/extensions";

const mangaApi = axios.create({
  baseURL: "https://consumet-api-for-weebixx.onrender.com/meta/anilist-manga/",
});

const animeApi = axios.create({
  baseURL: "https://consumet-api-for-weebixx.onrender.com/meta/anilist/",
});

const anilist = new META.Anilist({ url: "https://corsproxy.io/?" });
const gogoanime = new ANIME.Gogoanime();
const mangakakalot = new MANGA.MangaKakalot();

export { mangaApi, animeApi, anilist, gogoanime, mangakakalot };
