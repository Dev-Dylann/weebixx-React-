import { anilist, animeApi, gogoanime } from "../api/api";

const fetchGogoInfo = async (animeId) => {
  try {
    const data = await gogoanime.fetchAnimeInfo(animeId);

    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const matchGogoToAnilist = async (gogoInfo) => {
  try {
    const sliceIndex = gogoInfo?.title.indexOf(":" || ",");
    const keyword = gogoInfo?.title.slice(0, sliceIndex);
    console.log(keyword);

    const aniSearch = await animeApi.get(keyword);
    const results = aniSearch.data.results;
    console.log(gogoInfo);

    const matchedAnime = results.find((anime) => {
      return (
        anime.releaseDate == gogoInfo.releaseDate &&
        anime.currentEpisodeCount == gogoInfo.totalEpisodes
      );
    });
    console.log(matchedAnime);

    return matchedAnime;
  } catch (err) {
    console.log(err.message);
  }
};

// Anime info page uses the anilist extension and can only fetch info with anilist Ids of anime. This is an attempt to match a gogo id to its respective anilist Id

// 'animeId' here is probably a gogoId.
// If anilist fetches it successfully, then we return the anime object back to the anime info page (or whatever page that wants to request the animeInfo)
// If anilist returns an error saying media not found(essentially it tried to fetch with a gogoId), then we go ahead to try whatever tf.

const mapToAnilist = async (animeId, animeProvider) => {
  try {
    /* const animeInfo = await anilist.fetchAnimeInfo(21);
    console.log(animeInfo); */

    const { data } = await animeApi.get(`info/${animeId}`, {
      params: {
        provider: animeProvider,
      },
    });

    return data;
  } catch (err) {
    console.log(err.message);

    const gogoInfo = await fetchGogoInfo(animeId);

    const matchedAnime = await matchGogoToAnilist(gogoInfo);

    return matchedAnime.id;
  }
};

export default mapToAnilist;
