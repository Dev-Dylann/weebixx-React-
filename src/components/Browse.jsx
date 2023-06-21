import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import {animeApi} from '../api/api'
import Slider from './Slider';
import Error from './Error';
import ToTop from './ToTop';

const Browse = () => {
    const {ogTitle, ogDesc, ogImg} = useContext(DataContext);
    const [recent, setRecent] = useState([]);
    const [trending, setTrending] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFetchError(null);
        setIsLoading(true);

        const fetchRecent = async () => {
            try {
                const {data} = await animeApi.get('/recent-episodes', {
                    params: {
                        page: 1,
                        perPage: 50,
                        provider: 'crunchyroll'
                    }
                });
                console.log(data);
                setRecent(data.results);
            } catch (err) {
                if (err.response) {
                    console.log(err.response);
                    setFetchError(`err.response.data.message`);
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
                const {data} = await animeApi.get('/trending', {
                    params: {
                        page: 1,
                        perPage: 10
                    }
                });
                console.log(data.results);
                setTrending(data.results);
            } catch(err) {
                console.log(err.response);
            }
        }

        fetchTrending();
        fetchRecent();
    }, [])

  return (
    <main className='flex flex-col gap-6 pb-16 dark:text-white'>

        {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>

        <section className='relative text-white font-montserrat h-[30vh] bg-black sm:h-[35vh]'>
            <h2 className='absolute top-5 left-5 font-bold z-[1] sm:text-lg sm:left-7'>Trending Anime</h2>

            <Slider trending={trending} />
        </section>

        <section className='px-5 flex flex-col gap-3 sm:px-7'>
            <h2 className='font-montserrat font-bold sm:text-lg'>Recent Anime Releases</h2>

            {isLoading && !fetchError && <Loader />}

            {fetchError && !isLoading && (
                <Error fetchError={fetchError} />
            )}

            {!fetchError && !isLoading && (
                <article className='grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5'>
                    {recent.map(episode => (
                        <Link to={`episode/${episode.id}/${episode.episodeNumber}`} key={recent.indexOf(episode)} className='relative h-full hover:scale-105 transition-all'>
                            <img src={episode.image} alt='' className='rounded-lg shadow-lg' />
                            <p className='p-1 bg-accent absolute top-2 right-2 text-xs rounded-md dark:text-[#1a1a1a] sm:text-sm'>Ep. {episode.episodeNumber}</p>
                            <p className='mt-1 text-sm line-clamp-2 text-ellipsis sm:text-base'>{episode.title.userPreferred}</p>
                        </Link>
                    ))}
                </article>
            )}
        </section>

        <ToTop />
    </main>
  )
}

export default Browse