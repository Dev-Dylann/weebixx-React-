import axios from "axios";
import { META, MANGA } from "@consumet/extensions";

const mangaApi = axios.create({
  baseURL: "https://consumet-weebixx.up.railway.app/meta/anilist-manga/",
});

const animeApi = axios.create({
  baseURL: "https://consumet-weebixx.up.railway.app/meta/anilist/",
});

const anilist = new META.Anilist({ url: "https://corsproxy.io/?" });
const mangakakalot = new MANGA.MangaKakalot();

export { mangaApi, animeApi, anilist, mangakakalot };
