import { createContext, useState } from "react";
import ogImage from '../assets/og-image.png';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [ogTitle, setOgTitle] = useState('Weebixx');
  const [ogDesc, setOgDesc] = useState('Discover your favourite animanga titles, all conveniently available for your enjoyment on Weebixx.');
  const [ogImg, setOgImg] = useState(ogImage);

  const [isDark, setIsDark] = useState(false);

  const [animeProvider, setAnimeProvider] = useState('gogoanime')
  const [streamQuality, setStreamQuality] = useState('360p')


  return (
    <DataContext.Provider
      value={{
        ogTitle, setOgTitle,
        ogDesc, setOgDesc,
        ogImg, setOgImg,
        isDark, setIsDark,
        animeProvider, setAnimeProvider,
        streamQuality, setStreamQuality,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
