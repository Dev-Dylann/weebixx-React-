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

        <section className='font-montserrat flex justify-evenly items-center border-b'>
            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'anime' ? {color: '#e3b3ff', borderBottom: '2px solid #e3b3ff'} : {} }>Anime</button>

            <button onClick={(e) => setActiveTab(e.target.textContent.toLowerCase())} type='button' className='px-4 pb-1' style={activeTab === 'manga' ? {color: '#e3b3ff', borderBottom: '2px solid #e3b3ff'} : {} }>Manga</button>
        </section>

        <h2 className='font-montserrat font-bold'>Results for "{query}" in {activeTab}</h2>

        
        {activeTab === 'anime' ? <SearchAnime query={query} /> : <SearchManga query={query} /> }
        
    </main>
  )
}

export default Search