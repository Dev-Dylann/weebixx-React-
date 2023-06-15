import React, { useEffect, useState, useRef, useContext } from 'react'
import DataContext from '../context/DataContext'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { animeApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import Recommendations from './Recommendations'
import { ChevronDoubleDownIcon, ArrowsUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const AnimeInfo = () => {
    const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);

    const {animeId} = useParams();
    const [animeInfo, setAnimeInfo] = useState([]);
    const [episodeList, setEpisodeList] = useState([]);
    const [episodeSort, setEpisodeSort] = useState('Newest First');
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [details, setDetails] = useState(false);
    const detailsRef = useRef();
    const expandRef = useRef();
    
    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchAnimeInfo = async () => {
            try {
                const {data} = await animeApi.get(`info/${animeId}`, {
                    params:{
                        provider: 'gogoanime',
                }});
                console.log(data);
                setAnimeInfo(data);
            } catch(err) {
                if (err.response) {
                    console.log(err.response);
                    setFetchError(err.response.data.message)
                } else {
                    console.log(err.message);
                    setFetchError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchAnimeInfo();
    }, [animeId])

    useEffect(() => {
        setOgTitle(`Weebixx - ${animeInfo.title?.romaji}`);
        setOgDesc(`Stream ${animeInfo.title?.romaji} for free and discover more anime like this.`);
        setOgImg(animeInfo?.image)
    }, [animeInfo])

    useEffect(() => {
        const handleDetailsToggle = () => {
            if (details) {
                expandRef.current.classList.add('rotate-180');
                detailsRef.current.classList.replace('hidden', 'grid');
            } else {
                expandRef.current?.classList.remove('rotate-180');
                detailsRef.current?.classList.replace('grid', 'hidden');''
            }
        }

        handleDetailsToggle();
    }, [details])

    useEffect(() => {
        if (animeInfo.episodes) {
            if (episodeSort === 'Newest First') {
                const newFirst = [...animeInfo.episodes];
                newFirst.reverse();
                setEpisodeList(newFirst.slice(0, 12));
            } else if (episodeSort === 'Oldest First') {
                const oldFirst = animeInfo.episodes;
                setEpisodeList(oldFirst.slice(0, 12));
            }
        }
    }, [animeInfo, episodeSort])

  return (
    <main className='relative pt-36 sm:pt-28'>

        {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>

        <div className='absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center -z-[1]' style={{backgroundColor: animeInfo.color, backgroundImage: `url(${animeInfo.cover})`}}>
            <div className='w-full h-full bg-gradient-to-b from-overlay-light from-60% to-white dark:from-overlay-dark dark:to-background-dark'></div>
        </div>

        {isLoading && !fetchError && <Loader />}

        {fetchError && !isLoading && (
            <Error fetchError={fetchError} />
        )}

        {!isLoading && !fetchError && (
            <>
            <section className='flex flex-col items-center p-5 text-center gap-2 dark:text-white sm:px-7'>
            <img src={animeInfo.image} alt={animeInfo.id} className='w-1/3 rounded-lg sm:max-w-[200px]' />
            <h2 className='text-2xl font-montserrat sm:font-bold'>{animeInfo.title?.romaji}</h2>

            <p className='flex items-center gap-3 text-gray-400 text-lg'>
                {animeInfo.currentEpisode} Episodes
                <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                {animeInfo.status}
                <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                {animeInfo.type}
            </p>

            <p className='flex flex-wrap justify-center gap-3 mt-2'>{animeInfo.genres?.map(genre => (
                <span className='bg-accent text-[#1a1a1a] dark:border dark:border-accent dark:bg-transparent dark:text-white px-3 py-1 text-center rounded-full' key={animeInfo.genres.indexOf(genre)}>{genre}</span>
            ))}
            </p>

            <p className='mt-2 sm:text-lg'>{animeInfo.description}</p>

            <button ref={expandRef} type='button' onClick={(e) => setDetails(prev => !prev)} className='p-2 rounded-full transition-all duration-300'>
                <ChevronDoubleDownIcon className='h-6 w-6 dark:stroke-white' />
            </button>

            <article ref={detailsRef} className='hidden grid-cols-2 gap-x-3 gap-y-1 text-sm p-3 text-gray-400 sm:text-base'>
                <p>Released: {animeInfo.releaseDate}</p>
                <p>Adult Content: {animeInfo.isAdullt ? 'Yes' : 'No'}</p>
                <p>Rating: {animeInfo.rating}/100</p>
                <p>Studio: {animeInfo.studios}</p>
                
                <p className='col-span-full'>Alternative Name: {animeInfo.title?.english}</p>
            </article>
        </section>

        <section className='dark:text-white p-5 py-8 flex flex-col gap-3 sm:px-7'>
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-montserrat sm:font-bold'>Episodes</h3>
                <button type='button' className='flex items-center gap-2' onClick={() => setEpisodeSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                    <p className='text-sm'>{episodeSort}</p>
                    <ArrowsUpDownIcon className='h-6 w-6 dark:stroke-white' />
                </button>
            </div>

            <article className='flex flex-col'>
                {episodeList.length ? (
                    episodeList.map(episode => (
                        <Link  to={`/episode/${animeInfo.id}/${episode.number}`} key={episode.id} className='grid grid-cols-4 gap-x-2 py-4 border-b dark:border-b-gray-700 hover:bg-[whitesmoke] dark:hover:bg-[#333] transition-all'>
                            <img src={episode.image} alt={`Ep. ${episode.number}`} className='col-span-1 h-full' />
                            <div className='col-span-3 flex flex-col py-2'>
                                <p className='line-clamp-1 text-ellipsis sm:text-lg'>{episode.number}. {episode.title}</p>
                                <p className='text-gray-400 text-sm sm:text-base'>{episode.airDate?.slice(0, episode.airDate.indexOf('T'))}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-center py-8 sm:text-lg'>No episodes have been released yet.</p>
                )}

            </article>

            <Link to={`/episodelist/${animeId}`} className='bg-accent text-sm p-2 rounded-lg dark:text-[#1a1a1a] self-end flex items-center gap-1 hover:brightness-90 transition-all sm:text-base'>
                See All Episodes
                <ChevronRightIcon className='h-6 w-6' />
            </Link>

        </section>

        <section className='py-8 flex flex-col gap-4 dark:text-white'>
            <h3 className='text-lg font-montserrat px-5 sm:font-bold sm:px-7'>More Like This...</h3>

            <Recommendations mediaInfo={animeInfo} />
        </section>

        </>
        )}
    </main>
  )
}

export default AnimeInfo