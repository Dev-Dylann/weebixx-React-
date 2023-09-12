import React, { useEffect, useState, useRef, useContext } from 'react'
import DataContext from '../context/DataContext'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { mangaApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import Recommendations from './Recommendations'
import { ChevronDoubleDownIcon, ArrowsUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const MangaInfo = () => {
    const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);

    const {mangaId} = useParams();
    const [mangaInfo, setMangaInfo] = useState([]);
    const [details, setDetails] = useState(false);
    const detailsRef = useRef();
    const expandRef = useRef();
    const [chapterSort, setChapterSort] = useState('Newest First');
    const [chapterList, setChapterList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchMangaInfo = async () => {
            try {
                const {data} = await mangaApi.get(`/info/${mangaId}`, { params: { provider: 'mangahere' } });
                console.log(data);
                setMangaInfo(data);
            } catch(err) {
                if (err.response) {
                    console.log(err.response);
                    setFetchError(err.response.data.message);
                } else {
                    console.log(err.message);
                    setFetchError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchMangaInfo();
    }, [mangaId])

    useEffect(() => {
        setOgTitle(`Weebixx - ${mangaInfo.title?.romaji}`);
        setOgDesc(`Read ${mangaInfo.title?.romaji} for free and discover more manga like this.`);
        setOgImg(mangaInfo?.image)
    }, [mangaInfo])

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
        if (mangaInfo.chapters) {
            const chaptersWithEncodedId = mangaInfo.chapters.map(chapter => {
              const encodedId = encodeURIComponent(chapter.id)
          
              return {...chapter, encodedId}
            })

            if (chapterSort === 'Newest First') {
                const newFirst = [...chaptersWithEncodedId];
                newFirst.reverse();
                setChapterList(newFirst.slice(0, 20));
            } else if (chapterSort === 'Oldest First') {
                const oldFirst = [...chaptersWithEncodedId];
                setChapterList(oldFirst.slice(0, 20));
            }
        }
    }, [mangaInfo, chapterSort])

  return (
    <main className='relative pt-36 sm:pt-28'>

        {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>
        
        <div className='absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center -z-[1]' style={{backgroundColor: mangaInfo.color, backgroundImage: `url(${mangaInfo.cover})`}}>
            <div className='w-full h-full bg-gradient-to-b from-overlay-light from-60% to-white dark:from-overlay-dark dark:to-background-dark'></div>
        </div>

        {isLoading && !fetchError && <Loader />}

        {fetchError && !isLoading && (
            <Error fetchError={fetchError} />
        )}

        {!isLoading && !fetchError && (
            <>
                <section className='flex flex-col items-center p-5 text-center gap-2 dark:text-white sm:px-7 md:px-10'>
                    <img src={mangaInfo.image} alt={mangaInfo.id} className='w-1/3 rounded-lg' />
                    <h2 className='text-2xl font-montserrat sm:font-bold'>{mangaInfo.title?.romaji}</h2>

                    <p className='flex items-center gap-3 text-gray-400 text-lg'>
                        {mangaInfo.chapters?.length} Chapters
                        <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                        {mangaInfo.status}
                        <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                        {mangaInfo.type}
                    </p>

                    <p className='flex flex-wrap justify-center gap-3 mt-2'>{mangaInfo.genres?.map(genre => (
                            <span className='bg-accent text-[#1a1a1a] dark:border dark:border-accent dark:bg-transparent dark:text-white px-3 py-1 text-center rounded-full' key={mangaInfo.genres?.indexOf(genre)}>{genre.trim()}</span>
                        ))}</p>

                    <p className='mt-2 sm:text-lg'>{mangaInfo.description}</p>

                    <button ref={expandRef} type='button' onClick={(e) => setDetails(prev => !prev)} className='p-2 rounded-full transition-all duration-300'>
                        <ChevronDoubleDownIcon className='h-6 w-6 dark:stroke-white' />
                    </button>

                    <article ref={detailsRef} className='hidden grid-cols-2 gap-x-3 gap-y-1 text-sm p-3 text-gray-400 sm:text-base'>
                        <p>Released: {mangaInfo.releaseDate}</p>
                        <p>Rating: {mangaInfo.rating}/100</p>
                        
                        <p className='col-span-full'>Alternative Name: {mangaInfo.title?.english}</p>
                    </article>
                </section>

                <section className='dark:text-white p-5 py-8 flex flex-col gap-3 sm:px-7 md:px-10'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-lg font-montserrat sm:font-bold'>Chapters</h3>
                        <button type='button' className='flex items-center gap-2' onClick={() => setChapterSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                            <p className='text-sm'>{chapterSort}</p>
                            <ArrowsUpDownIcon className='h-6 w-6 dark:stroke-white' />
                        </button>
                    </div>

                    <article className='flex flex-col'>
                        {chapterList.length ? (
                            chapterList.map(chapter => (
                                <Link  to={`/chapter/${mangaInfo.id}/${chapter.encodedId}`} key={chapter?.id} className='py-2 border-b dark:border-b-gray-700 hover:bg-[whitesmoke] dark:hover:bg-[#333] transition-all'>
                                    <div className='flex flex-col py-2'>
                                        <p className='line-clamp-1 text-ellipsis sm:text-lg'>Chapter {chapter.chapterNumber}: {chapter.title}</p>
                                        <p className='text-gray-400 text-sm sm:text-base'>{chapter.releasedDate}</p>
                                    </div>
                                </Link>
                            ))
                    ) : (
                        <p className='text-center py-8 sm:text-lg'>No chapters have been released yet.</p>
                     )}

                </article>

                <Link to={`/chapterlist/${mangaId}`} className='bg-accent text-sm p-2 rounded-lg dark:text-[#1a1a1a] self-end flex items-center gap-1 hover:brightness-90 transition-all sm:text-base'>
                    See All Chapters
                    <ChevronRightIcon className='h-6 w-6' />
                </Link>

                </section>

                <section className='py-8 flex flex-col gap-4 dark:text-white'>
                    <h3 className='text-lg font-montserrat px-5 sm:font-bold sm:px-7 md:px-10'>More Like This...</h3>

                    <Recommendations mediaInfo={mangaInfo} />
                </section>
            </>
        )}
    </main>
  )
}

export default MangaInfo