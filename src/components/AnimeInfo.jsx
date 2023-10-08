import React, { useEffect, useState, useRef, useContext } from 'react'
import DataContext from '../context/DataContext'
import SettingsContext from '../context/SettingsContext'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { anilist, animeApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import Recommendations from './Recommendations'
import { ChevronDoubleDownIcon, ArrowsUpDownIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline'

const AnimeInfo = () => {
    const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);
    const {animeProvider} = useContext(SettingsContext)

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
                // new stuff

                const { data } = await animeApi.get(`info/${animeId}`, {
                    params: {
                        provider: animeProvider
                    }
                })
                console.log(data)
                setAnimeInfo(data);

                /* const data = await anilist.fetchAnimeInfo(animeId)

                console.log(data)
                setAnimeInfo(data); */
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

        <div className='absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center -z-[1] lg:h-screen lg:w-[60%]' style={{backgroundColor: animeInfo.color, backgroundImage: `url(${animeInfo.cover})`}}>
            <div className='w-full h-full bg-gradient-to-b from-overlay-light from-60% to-white dark:from-overlay-dark dark:to-background-dark lg:bg-gradient-to-r'>
                <div className='hidden lg:block w-full h-full bg-gradient-to-b from-transparent to-white dark:to-background-dark'></div>
            </div>
        </div>

        {isLoading && !fetchError && <Loader />}

        {fetchError && !isLoading && (
            <Error fetchError={fetchError} />
        )}

        {!isLoading && !fetchError && (
            <>
            <section className='flex flex-col items-center p-5 text-center gap-2 dark:text-white sm:px-7 md:px-10 lg:px-16 lg:grid lg:grid-cols-[auto,_1fr] lg:gap-x-10 lg:gap-y-0 lg:grid-rows-[auto,_auto,_auto,_auto,_auto] lg:text-left lg:max-h-screen lg:relative xl:px-28'>
            <img src={animeInfo.image} alt={animeInfo.id} className='w-1/3 rounded-lg sm:max-w-[200px] lg:row-span-full lg:max-w-[260px] lg:w-full lg:self-start' />
            <h2 className='text-2xl font-montserrat sm:font-bold lg:w-[60%] lg:flex lg:items-center' title={animeInfo.title?.english}>{animeInfo.title?.romaji} <span className='hidden lg:block text-xs ml-3 font-normal'><StarIcon className='h-4 w-4 inline fill-[gold] stroke-[gold]' />{animeInfo.rating}%</span></h2>

            <p className='hidden lg:block font-montserrat text-lg w-[60%] -mt-1'>{animeInfo.studios.map((studio, index) => <span key={`studio${index}`}>{studio}, </span>)}</p>

            <p className='flex items-center gap-3 text-gray-400 text-lg lg:w-[60%]'>
                {animeInfo.currentEpisode} Episodes
                <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                {animeInfo.status}
                <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                {animeInfo.type}
            </p>

            <p className='flex flex-wrap justify-center gap-3 mt-2 lg:justify-start lg:w-[60%]'>{animeInfo.genres?.map(genre => (
                <span className='bg-accent text-[#1a1a1a] dark:border dark:border-accent dark:bg-transparent dark:text-white px-3 py-1 text-center rounded-full' key={animeInfo.genres.indexOf(genre)}>{genre}</span>
            ))}
            </p>

            <p className='mt-2 sm:text-lg lg:w-[80%]'>{animeInfo.description}</p>

            <button ref={expandRef} type='button' onClick={(e) => setDetails(prev => !prev)} className='p-2 rounded-full transition-all duration-300 lg:invisible'>
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

        <section className='dark:text-white py-8 flex flex-col gap-3 lg:px-16 xl:px-28'>
            <div className='flex items-center justify-between px-5 sm:px-7 md:px-10 lg:px-0'>
                <h3 className='text-lg font-montserrat sm:font-bold'>Episodes</h3>
                <button type='button' className='flex items-center p-2 gap-2 rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333]' onClick={() => setEpisodeSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                    <p className='text-sm'>{episodeSort}</p>
                    <ArrowsUpDownIcon className='h-6 w-6 dark:stroke-white' />
                </button>
            </div>

            <article className='flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-4'>
                {episodeList.length ? (
                    episodeList.map(episode => (
                        <Link  to={`/episode/${animeInfo.id}/${episode.number}`} key={episode.id} className='grid grid-cols-4 gap-x-2 py-4 px-5 border-b last:border-0 dark:border-b-gray-700 hover:bg-[whitesmoke] dark:hover:bg-[#333] transition-all sm:px-7 md:px-10 lg:px-4 lg:last:border-b'>
                            <img src={episode.image} alt={`Ep. ${episode.number}`} className='col-span-1 my-auto' />
                            <div className='col-span-3 flex flex-col py-2'>
                                <p className='line-clamp-1 text-ellipsis sm:text-lg'>{episode.number}. {episode.title}</p>
                                <p className='text-gray-400 text-sm sm:text-base'>{episode.airDate?.slice(0, episode.airDate.indexOf('T'))}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-center py-8 sm:text-lg lg:col-span-full'>No episodes have been released yet.</p>
                )}

            </article>

            <Link to={`/episodelist/${animeId}`} className='bg-accent text-sm p-2 mr-5 rounded-lg dark:text-[#1a1a1a] self-end flex items-center gap-1 hover:brightness-90 transition-all sm:text-base sm:mr-7 md:mr-10 lg:mr-0'>
                See All Episodes
                <ChevronRightIcon className='h-6 w-6' />
            </Link>

        </section>

        <section className='py-8 flex flex-col gap-4 dark:text-white px-5 sm:px-7 md:px-10 lg:px-16 xl:px-28'>
            <h3 className='text-lg font-montserrat sm:font-bold'>More Like This...</h3>

            <Recommendations mediaInfo={animeInfo} />
        </section>

        </>
        )}
    </main>
  )
}

export default AnimeInfo