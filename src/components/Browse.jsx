import React, { useState, useEffect } from 'react'
import Loader from './Loader';
import {animeApi} from '../api/api'
import Slider from './Slider';
import Error from './Error';

const Browse = () => {
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
                        provider: 'gogoanime'
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
    <main className='flex flex-col gap-6 pb-16'>
        <section className='relative text-white font-montserrat h-[30vh] bg-black'>
            <h2 className='absolute top-5 left-5 font-bold z-[1]'>Trending Anime</h2>
            <Slider trending={trending} />
        </section>

        <section className='px-5 flex flex-col gap-3'>
            <h2 className='font-montserrat font-bold'>Recent Anime Releases</h2>

            {isLoading && !fetchError && <Loader />}

            {fetchError && !isLoading && (
                <Error fetchError={fetchError} />
            )}

            {!fetchError && !isLoading && (
                <article className='grid grid-cols-3 gap-3'>
                    {recent.map(episode => (
                        <div key={episode.id} className='relative h-full'>
                            <img src={episode.image} alt='' className='rounded-lg shadow-lg' />
                            <p className='p-1 bg-accent absolute top-2 right-2 text-xs rounded-md'>Ep. {episode.episodeNumber}</p>
                            <p className='mt-1 text-sm line-clamp-2 text-ellipsis'>{episode.title.userPreferred}</p>
                        </div>
                    ))}
                </article>
            )}
        </section>
    </main>
  )
}

export default Browse