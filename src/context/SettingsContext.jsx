import { createContext, useState, useEffect } from "react";

const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {
    
  const [animeProvider, setAnimeProvider] = useState('')
  const [streamQuality, setStreamQuality] = useState('')

  useEffect(() => {
    const settings = fetchSettings()

    setAnimeProvider(settings.animeProvider)
    setStreamQuality(settings.streamQuality)
  }, [])

  useEffect(() => {
    if (animeProvider != '' && streamQuality != '') {
        updateSettings()
    }
  }, [animeProvider, streamQuality])

  const fetchSettings = () => {
    const stringSettings = localStorage.getItem('WeebixxSettings')

    if (typeof stringSettings === 'string') {
        const parsedSettings = JSON.parse(stringSettings)
        return parsedSettings
    }

    return {animeProvider: 'gogoanime', streamQuality: '360p'}
  }

  const updateSettings = () => {
    const newSettings = {
        animeProvider,
        streamQuality,
    }

    const stringSettings = JSON.stringify(newSettings)
    localStorage.setItem('WeebixxSettings', stringSettings)
  }

    return (
        <SettingsContext.Provider
            value={{
                animeProvider, setAnimeProvider,
                streamQuality, setStreamQuality,
            }} 
        >
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext