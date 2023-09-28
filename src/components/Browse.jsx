import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext';
import SettingsContext from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';
import ogImage from '../assets/og-image.png'
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { anilist, animeApi } from '../api/api'
import Slider from './Slider';
import Error from './Error';
import ToTop from './ToTop';
import { Splide, SplideSlide } from '@splidejs/react-splide'

const Browse = () => {

    const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);
    const {animeProvider} = useContext(SettingsContext)

    const [recent, setRecent] = useState([]);
    const [trending, setTrending] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sliderOptions] = useState({
        type: 'loop',
        autoplay: true,
        perPage: 8,
        perMove: 1,
        mediaQuery: 'min',
        gap: '6px',
        pagination: true,
        arrows: true,
        classes: {
            arrows: 'splide__arrows splide-arrows',
            arrow: 'splide__arrow slider-arrow',
            page: 'splide__pagination__page slider-page'
        }
    })

    useEffect(() => {
        setOgImg(ogImage);
        setOgTitle('Weebixx');
        setOgDesc('Discover your favourite animanga titles, all conveniently available for your enjoyment on Weebixx.')
    }, [])

    useEffect(() => {
        setFetchError(null);
        setIsLoading(true);

        const fetchRecent = async () => {
            try {
                // new stuff

                const { data } = await animeApi.get('recent-episodes', {
                    params: {
                        page: 1,
                        perPage: 60,
                        provider: animeProvider
                    }
                })
                console.log(data)

                /* const data = await anilist.fetchRecentEpisodes(animeProvider, 1, 60)
                console.log(animeProvider)

                console.log(data)
                setRecent(data.results) */
            } catch (err) {
                if (err.response) {
                    console.log(err.response);
                    setFetchError(err.response.data.message);
                } else {
                    console.log(err.messsage);
                    setFetchError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        const fetchTrending = async () => {
            try {
                // new stuff

                const { data } = await animeApi.get('trending', {
                    params: {
                        page: 1,
                        perPage: 10,
                    }
                })
                console.log(data)
                setTrending(data.results)

                /* const data = await anilist.fetchTrendingAnime(1, 10)

                console.log(data);
                setTrending(data.results); */
            } catch(err) {
                console.log(err.response);
            }
        }

        fetchTrending();
        fetchRecent();
    }, [animeProvider])

  return (
    <main className='flex flex-col gap-6 pb-16 dark:text-white lg:gap-3'>

        {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>

        <section className='relative text-white font-montserrat h-[30vh] bg-black sm:h-[35vh] lg:h-[70vh] lg:rounded-b-[50px] lg:overflow-hidden'>
            <h2 className='absolute top-5 left-5 font-bold z-[1] sm:text-lg sm:left-7 md:left-10 lg:left-16 lg:top-24 lg:text-base'>Trending Anime</h2>

            <Slider trending={trending} />
        </section>

        <section className='px-5 flex flex-col gap-3 sm:px-7 md:px-10 lg:px-0 lg:gap-0'>
            <h2 className='font-montserrat font-bold sm:text-lg lg:ml-16 lg:text-base'>Recent Anime Releases</h2>

            {isLoading && !fetchError && <Loader />}

            {fetchError && !isLoading && (
                <Error fetchError={fetchError} />
            )}

            {!fetchError && !isLoading && (
                <>
                    <article className='grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5 lg:hidden'>
                        {recent.map(episode => (
                            <Link to={`episode/${episode.id}/${episode.episodeNumber}`} key={recent.indexOf(episode)} className='relative h-full hover:scale-105 transition-all'>
                                <img src={episode.image} alt='' className='rounded-lg shadow-lg' />
                                <p className='p-1 bg-accent absolute top-2 right-2 text-xs rounded-md dark:text-[#1a1a1a] sm:text-sm'>Ep. {episode.episodeNumber}</p>
                                <p className='mt-1 text-sm line-clamp-2 text-ellipsis sm:text-base'>{episode.title.userPreferred}</p>
                            </Link>
                        ))}
                    </article>

                    <article className='px-16 hidden lg:block'>
                        <Splide options={sliderOptions} aria-labelledby='Recent Anime Releases' className='relative pb-10'>
                            {recent.map(episode => (
                                <SplideSlide key={recent.indexOf(episode)} className='hover:scale-105 transition-all py-3 px-1'>
                                    <Link to={`episode/${episode.id}/${episode.episodeNumber}`} className='relative h-full'>
                                        <img src={episode.image} alt='' className='rounded-lg shadow-lg' />
                                        <p className='p-1 bg-accent absolute top-2 right-2 text-xs rounded-md dark:text-[#1a1a1a] sm:text-sm lg:text-xs'>Ep. {episode.episodeNumber}</p>
                                        <p className='mt-1 text-sm line-clamp-2 text-ellipsis sm:text-base lg:text-sm'>{episode.title.userPreferred}</p>
                                    </Link>
                                </SplideSlide>
                            ))}

                            
                        </Splide>
                    </article>

                </>
            )}
        </section>

        <ToTop />
    </main>
  )
}

export default Browse