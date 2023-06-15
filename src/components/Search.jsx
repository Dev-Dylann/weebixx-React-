import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import SearchAnime from './SearchAnime'
import SearchManga from './SearchManga'

const Search = () => {
  const {ogTitle, setOgTitle, ogDesc, ogImg} = useContext(DataContext);

    const { query } = useParams();
    const [activeTab, setActiveTab] = useState('anime');

    useEffect(() => {
      setOgTitle(`Weebixx - Search Results for "${query}"`);
    }, [])

  return (
    <main className='p-5 flex flex-col gap-3 sm:px-7'>

      {/* Dynamically change the og meta tags */}
      <Helmet prioritizeSeoTags>
        <title>{ogTitle}</title>
        <meta property='og:title' content={ogTitle} data-rh='true' />
        <meta property='og:description' content={ogDesc} data-rh='true' />
        <meta property='og:image' content={ogImg} data-rh='true' />
      </Helmet>

        <section className='font-montserrat flex justify-evenly items-center gap-6 border-b dark:border-b-gray-700 dark:text-white sm:text-lg'>
            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'anime' ? {borderBottom: '2px solid #e3b3ff'} : {color: "#9ca3af"} }>Anime</button>

            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'manga' ? {borderBottom: '2px solid #e3b3ff'} : {color: "#9ca3af"} }>Manga</button>
        </section>

        <h2 className='font-montserrat font-bold dark:text-white sm:text-lg'>Results for "{query}" in {activeTab}</h2>

        
        {activeTab === 'anime' ? <SearchAnime query={query} /> : <SearchManga query={query} /> }
        
    </main>
  )
}

export default Search