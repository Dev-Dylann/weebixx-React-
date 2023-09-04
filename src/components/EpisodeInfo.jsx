import React, {useState, useEffect, useContext} from 'react'
import DataContext from '../context/DataContext';
import SettingsContext from '../context/SettingsContext';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom'
import { animeApi, anilist } from '../api/api';
import Loader from './Loader';
import Error from './Error';
import VideoPlayer from './VideoPlayer';
import HlsDownloader from '../modules/HLSDownloader';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const EpisodeInfo = () => {
    const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);
    const {streamQuality, setStreamQuality} = useContext(SettingsContext)

    const {animeId, episodeNumber} = useParams();
    const [animeInfo, setAnimeInfo] = useState({});
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState({});
    const [streamLinks, setStreamLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
       setOgTitle(`Weebixx - ${animeInfo.title?.romaji} Episode ${currentEpisode?.number}`);
       setOgDesc(`Stream ${animeInfo.title?.romaji} in different qualities for free.`);
       setOgImg(animeInfo.image);
    }, [animeInfo, currentEpisode])

    useEffect(() => {
        console.log(streamQuality);
    }, [streamQuality])

    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchEpisodeDetails = async () => {
            try {
                // new stuff

                const data = await anilist.fetchAnimeInfo(animeId)
                console.log(data)
                
                setAnimeInfo(data);
                setEpisodeList(data.episodes);
            } catch(err) {
                if (err.response) {
                    console.log(err.response)
                    setFetchError(err.response.data.message);
                } else {
                    console.log(err.message)
                    setFetchError(err.message);
                }
            }
        }

        fetchEpisodeDetails();
    }, [])

    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchStreamLinks = async () => {
            const currentEp = episodeList.find(episode => {
                return episode.number.toString() === episodeNumber;
            })

            try {
                /* const {data} = await animeApi.get(`/watch/${currentEp?.id}`);
                console.log(data);
                console.log(currentEp);
                setCurrentEpisode(currentEp);
                setStreamLinks(data.sources);
                setStreamQuality(data.sources[0].quality); */

                // new stuff

                const response = await anilist.fetchEpisodeSources(currentEp?.id)
                console.log(response)
            } catch(err) {
                if (err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (Object.keys(episodeList).length !== 0) {
           fetchStreamLinks();
        }

    }, [episodeNumber, episodeList])

    const handleQualityChange = (event) => {
        setStreamQuality(event.target.value)
    }

    const handleDownload = () => {
        const streamLink = streamLinks.find(link => {
            return link.quality === streamQuality;
        })
        
        const episodeName = `${animeInfo.title?.romaji}_episode_${currentEpisode?.number}[Weebixx]`;

        HlsDownloader(streamLink?.url, episodeName);
    };

  return (
        <main className='flex flex-col gap-4 dark:text-white pb-8'>

            {/* Dynamically change the og meta tags */}
            <Helmet prioritizeSeoTags>
                <title>{ogTitle}</title>
                <meta property='og:title' content={ogTitle} data-rh='true' />
                <meta property='og:description' content={ogDesc} data-rh='true' />
                <meta property='og:image' content={ogImg} data-rh='true' />
            </Helmet>

                <section className='px-5 py-4 flex flex-col gap-4 sm:px-7 md:px-10'>
                    <div className='flex flex-col text-center font-montserrat items-center gap-1'>
                        <Link to={`/anime/${animeInfo.id}`} className='underline sm:text-lg sm:font-bold sm:no-underline sm:hover:underline'>{animeInfo.title?.romaji}</Link>
                        <p className='sm:text-lg'>Episode {currentEpisode.number}</p>
                    </div>

                    <VideoPlayer streamLinks={streamLinks} streamQuality={streamQuality} poster={currentEpisode.image} />

                    <select onChange={handleQualityChange} name="quality" id="quality" className='mx-auto px-2 bg-white dark:bg-transparent outline outline-1 outline-gray-400 rounded-md sm:text-lg'>
                        {streamLinks.map(link => (
                            <option key={streamLinks.indexOf(link)}  value={link.quality}>{link.quality}</option>
                        ))}
                    </select>

                    <div className='flex justify-between items-center dark:text-[#1a1a1a]' style={currentEpisode.number === 1 ? {justifyContent: 'flex-end'} : currentEpisode.number === episodeList.length ? {justifyContent: 'flex-start'} : {}}>
                        <Link to={`/episode/${animeInfo.id}/${currentEpisode.number - 1}`} className='flex text-sm items-center gap-1 px-2 py-1 rounded-lg bg-accent hover:brightness-90' style={currentEpisode.number === 1 ? {display: 'none'} : {}}><ChevronDoubleLeftIcon className='h-6 w-6' />Prev</Link>

                        <Link to={`/episode/${animeInfo.id}/${currentEpisode.number + 1}`} className='flex text-sm items-center gap-1 px-2 py-1 rounded-lg bg-accent hover:brightness-90' style={currentEpisode.number === episodeList.length ? {display: 'none'} : {}}>Next<ChevronDoubleRightIcon className='h-6 w-6' /></Link>
                    </div>
                </section>

            {isLoading && !fetchError && <Loader />}

            {fetchError && !isLoading && <Error fetchError={fetchError} />}

            {!fetchError && !isLoading && (
                <>
                <section className='px-5 sm:px-7 md:px-10'>
                    <h2 className='text-lg font-montserrat sm:font-bold sm:text-xl'>{currentEpisode.title}</h2>

                    <p className='text-gray-400 text-sm sm:text-base'>Released: {currentEpisode.airDate?.slice(0, currentEpisode.airDate.indexOf('T'))}</p>

                    <p className='mt-2 sm:text-lg'>{currentEpisode.description}</p>

                    <button onClick={handleDownload} className='dark:text-[#1a1a1a] bg-accent p-2 rounded-lg mt-4 flex gap-2 hover:brightness-90'>
                        <ArrowDownTrayIcon className='h-6 w-6' />
                        Download Episode
                    </button>

                </section>

                <Link to={`/episodelist/${animeInfo.id}`} className='text-gray-400 underline px-5 text-sm w-fit sm:text-base sm:px-7 sm:no-underline sm:hover:underline md:px-10'>{animeInfo.title?.romaji} Episode List</Link>
                <Link to={`/anime/${animeInfo.id}`} className='text-gray-400 underline px-5 text-sm w-fit sm:text-base sm:px-7 sm:no-underline sm:hover:underline md:px-10'>Back to anime details</Link>

                </>
            )}
        </main>
  )
}

export default EpisodeInfo