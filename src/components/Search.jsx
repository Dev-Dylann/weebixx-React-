import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SearchAnime from './SearchAnime'
import SearchManga from './SearchManga'

const Search = () => {
    const { query } = useParams();
    const [activeTab, setActiveTab] = useState('anime');

    useEffect(() => {
        document.title = `Weebixx - Results for "${query}"`;
    }, [])



  return (
    <main className='p-5 flex flex-col gap-3'>

        <section className='font-montserrat flex justify-evenly items-center gap-6 border-b dark:border-b-gray-700 dark:text-white'>
            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'anime' ? {borderBottom: '2px solid #e3b3ff'} : {color: "#9ca3af"} }>Anime</button>

            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'manga' ? {borderBottom: '2px solid #e3b3ff'} : {color: "#9ca3af"} }>Manga</button>
        </section>

        <h2 className='font-montserrat font-bold dark:text-white'>Results for "{query}" in {activeTab}</h2>

        
        {activeTab === 'anime' ? <SearchAnime query={query} /> : <SearchManga query={query} /> }
        
    </main>
  )
}

export default Search