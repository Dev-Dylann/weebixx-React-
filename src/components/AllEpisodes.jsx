import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { animeApi } from '../api/api'
import Loader from './Loader';
import Error from './Error';
import { ArrowsUpDownIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ToTop from './ToTop';

const AllEpisodes = () => {
    const {animeId} = useParams();
    const [animeInfo, setAnimeInfo] = useState([]);
    const [episodeList, setEpisodeList] = useState([]);
    const [episodeSort, setEpisodeSort] = useState('Newest First');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [view, setView] = useState('List');

    useEffect(() => {
        if (animeInfo) {
            document.title = `Weebixx - ${animeInfo.title?.romaji} Episodes`;
        } else {
            document.title = 'Weebixx'
        }
    }, [animeInfo])

    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchEpisodeList = async () => {
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

        fetchEpisodeList();
    }, [])

    useEffect(() => {
        if (animeInfo.episodes) {
            if (episodeSort === 'Newest First') {
                const newFirst = [...animeInfo.episodes];
                newFirst.reverse();
                setEpisodeList(newFirst);
            } else if (episodeSort === 'Oldest First') {
                const oldFirst = animeInfo.episodes;
                setEpisodeList(oldFirst);
            }
        }
    }, [animeInfo, episodeSort])

  return (
    <main className='dark:text-white'>
        <section className='flex flex-col p-5 gap-4'>
            <h2 className='font-montserrat'><Link to={`/anime/${animeInfo.id}`} className='underline'>{animeInfo.title?.romaji}</Link> All Episodes</h2>

            <div className='flex items-center self-end gap-4'>
                <button type='button' className='flex gap-2 items-center' onClick={() => setEpisodeSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                    <p className='text-sm'>{episodeSort}</p>
                    <ArrowsUpDownIcon className='h-6 w-6' />
                </button>

                <button type='button' className='self-end flex gap-2 items-center' onClick={() => setView(prev => prev === 'List' ? 'Grid' : 'List')}>
                    <p className='text-sm'>{view}</p>
                    {view === 'List' ? <ListBulletIcon className='h-6 w-6' /> : <Squares2X2Icon className='h-6 w-6' />}
                </button>
            </div>
        </section>

        {isLoading && !fetchError && <Loader />}

        {fetchError && !isLoading && <Error fetchError={fetchError} />}

        {!fetchError && !isLoading && (
            <section className={view === 'List' ? 'flex flex-col' : 'grid grid-cols-3 gap-3 px-5'}>
                {episodeList?.length ? (
                    episodeList.map(episode => (
                        <Link to={`/episode/${animeInfo.id}/${episode.number}`} key={episode.id} className={view === 'List' ? 'grid grid-cols-4 gap-x-2 py-4 px-5 border-b dark:border-b-gray-700' : 'flex flex-col gap-2'}>
                            <img src={episode.image} alt={`Ep. ${episode.number}`} className={view === 'List' ? 'col-span-1 h-full' : ''} />
                            <div className='col-span-3 flex flex-col py-2'>
                                <p className={view === 'List' ? 'line-clamp-1 text-ellipsis' : 'line-clamp-2 text-ellipsis text-sm'}>{episode.number}. {episode.title}</p>
                                <p className={view === 'List' ? 'text-gray-400 text-sm' : 'text-gray-400 text-xs'}>{episode.airDate?.slice(0, episode.airDate.indexOf('T'))}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-center col-span-full'>No episodes have been released yet.</p>
                )}
            </section>
        )}

        <ToTop />
    </main>
  )
}

export default AllEpisodes