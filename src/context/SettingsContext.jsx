import { createContext, useState, useEffect } from "react";

const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {
    
  const [animeProvider, setAnimeProvider] = useState('')
  const [streamQuality, setStreamQuality] = useState('')
  const [mangaProvider, setMangaProvider] = useState('')

  useEffect(() => {
    const settings = fetchSettings()

    setAnimeProvider(settings.animeProvider)
    setStreamQuality(settings.streamQuality)
    setMangaProvider(settings.mangaProvider)
  }, [])

  useEffect(() => {
    if (animeProvider != '' && streamQuality != '' && mangaProvider != '') {
        updateSettings()
    }
  }, [animeProvider, streamQuality, mangaProvider])

  const fetchSettings = () => {
    const stringSettings = localStorage.getItem('WeebixxSettings')

    if (typeof stringSettings === 'string') {
        const parsedSettings = JSON.parse(stringSettings)
        return parsedSettings
    }

    return {animeProvider: 'gogoanime', streamQuality: '360p', mangaProvider: 'mangakakalot'}
  }

  const updateSettings = () => {
    const newSettings = {
        animeProvider,
        streamQuality,
        mangaProvider,
    }

    const stringSettings = JSON.stringify(newSettings)
    localStorage.setItem('WeebixxSettings', stringSettings)
  }

    return (
        <SettingsContext.Provider
            value={{
                animeProvider, setAnimeProvider,
                streamQuality, setStreamQuality,
                mangaProvider, setMangaProvider,
            }} 
        >
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext