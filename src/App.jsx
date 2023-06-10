import { useEffect } from 'react'
import { DataProvider } from "./context/DataContext";
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Browse from "./components/Browse";
import Search from "./components/Search"
import AnimeInfo from "./components/AnimeInfo";
import AllEpisodes from "./components/AllEpisodes";
import EpisodeInfo from './components/EpisodeInfo';
import MangaInfo from './components/MangaInfo';
import AllChapters from './components/AllChapters';
import MangaReader from './components/MangaReader';
import Error from './components/Error';

function App() {

  useEffect(() => {
    
  }, [])

  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Browse />} />
          <Route path="search/:query" element={<Search />} />
          <Route path="anime/:animeId" element={<AnimeInfo />} />
          <Route path="episodelist/:animeId" element={<AllEpisodes />} />
          <Route path="episode/:animeId/:episodeNumber" element={<EpisodeInfo/>} />
          <Route path="manga/:mangaId" element={<MangaInfo />} />
          <Route path="chapterlist/:mangaId" element={<AllChapters />} />
          <Route path="chapter/:mangaId/:chapterId" element={<MangaReader />} />
          <Route path="*" element={<Error fetchError={'The page you requested doesn\'t seem to exist'} />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}

export default App
