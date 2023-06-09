import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mangaApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import { ChevronDoubleDownIcon, ArrowsUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Splide, SplideSlide } from '@splidejs/react-splide'

const MangaInfo = () => {
    const {mangaId} = useParams();
    const [mangaInfo, setMangaInfo] = useState([]);
    const [details, setDetails] = useState(false);
    const detailsRef = useRef();
    const expandRef = useRef();
    const [chapterSort, setChapterSort] = useState('Newest First');
    const [chapterList, setChapterList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [sliderOptions] = useState({
        type: 'slide',
        perPage: 3,
        perMove: 3,
        gap: '12px',
        autoplay: false,
        pagination: true,
        arrows: false,
    })

    useEffect(() => {
        setIsLoading(true);
        setFetchError(null);

        const fetchMangaInfo = async () => {
            try {
                const {data} = await mangaApi.get(`/info/${mangaId}`, { params: { provider: 'mangadex' } });
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
        if (mangaInfo) {
            document.title = `Weebixx - ${mangaInfo.title?.romaji}`;
        } else {
            document.title = 'Weebixx'
        }
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
    <main className='relative pt-36'>
        <div className='absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center -z-[1]' style={{backgroundColor: mangaInfo.color, backgroundImage: `url(${mangaInfo.cover})`}}>
            <div className='w-full h-full bg-gradient-to-b from-overlay-light from-60% to-white dark:from-overlay-dark dark:to-background-dark'></div>
        </div>

        {isLoading && !fetchError && <Loader />}

        {fetchError && !isLoading && (
            <Error fetchError={fetchError} />
        )}

        {!isLoading && !fetchError && (
            <>
                <section className='flex flex-col items-center p-5 text-center gap-2 dark:text-white'>
                    <img src={mangaInfo.image} alt={mangaInfo.id} className='w-1/3 rounded-lg' />
                    <h2 className='text-2xl font-montserrat'>{mangaInfo.title?.romaji}</h2>

                    <p className='flex items-center gap-3 text-gray-400 text-lg'>
                        {mangaInfo.chapters?.length} Chapters
                        <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                        {mangaInfo.status}
                        <span className='w-2 h-2 rounded-full bg-gray-400'></span>
                        {mangaInfo.type}
                    </p>

                    <p className='flex flex-wrap justify-center gap-3 mt-2'>{mangaInfo.genres?.map(genre => (
                            <span className='bg-accent text-[#1a1a1a] dark:border dark:border-accent dark:bg-transparent dark:text-white px-3 py-1 text-center rounded-full' key={mangaInfo.genres.indexOf(genre)}>{genre.trim()}</span>
                        ))}</p>

                    <p className='mt-2'>{mangaInfo.description}</p>

                    <button ref={expandRef} type='button' onClick={(e) => setDetails(prev => !prev)} className='p-2 rounded-full transition-all duration-300'>
                        <ChevronDoubleDownIcon className='h-6 w-6 dark:stroke-white' />
                    </button>

                    <article ref={detailsRef} className='hidden grid-cols-2 gap-x-3 gap-y-1 text-sm p-3 text-gray-400'>
                        <p>Released: {mangaInfo.releaseDate}</p>
                        <p>Rating: {mangaInfo.rating}/100</p>
                        
                        <p className='col-span-full'>Alternative Name: {mangaInfo.title?.english}</p>
                    </article>
                </section>

                <section className='dark:text-white p-5 py-8 flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-lg font-montserrat'>Chapters</h3>
                        <button type='button' className='flex items-center gap-2' onClick={() => setChapterSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                            <p className='text-sm'>{chapterSort}</p>
                            <ArrowsUpDownIcon className='h-6 w-6 dark:stroke-white' />
                        </button>
                    </div>

                    <article className='flex flex-col'>
                        {chapterList.length ? (
                            chapterList.map(chapter => (
                                <Link  to={`/chapter/${mangaInfo.id}/${chapter.encodedId}`} key={chapter.id} className='py-2 border-b dark:border-b-gray-700'>
                                    <div className='flex flex-col py-2'>
                                        <p className='line-clamp-1 text-ellipsis'>Chapter {chapter.chapterNumber}: {chapter.title}</p>
                                        <p className='text-gray-400 text-sm'>{chapter.releasedDate}</p>
                                    </div>
                                </Link>
                            ))
                    ) : (
                        <p className='text-center py-8'>No chapters have been released yet.</p>
                     )}

                </article>

                <Link to={`/chapterlist/${mangaId}`} className='bg-accent text-sm p-2 rounded-lg dark:text-[#1a1a1a] self-end flex items-center gap-1'>
                    See All Chapters
                    <ChevronRightIcon className='h-6 w-6' />
                </Link>

                <article className='py-8 flex flex-col gap-4'>
                    <h3 className='text-lg font-montserrat'>More Like This...</h3>

                    <Splide options={sliderOptions} aria-labelledby='Recommended Manga' className='flex gap-3'>
                        {mangaInfo.recommendations?.map(item => (
                            <SplideSlide key={item.id} className=''>
                                <Link to={`/manga/${item.id}`} className='h-full relative flex flex-col gap-2 pb-4'>
                                    <img src={item.image} alt={item.title.userPreferred} className='rounded-lg'/>
                                    <p className='line-clamp-2 text-ellipsis font-nunito text-sm'>{item.title.userPreferred}</p>
                                </Link>
                            </SplideSlide>
                        ))}
                    </Splide>
                </article>

                </section>
            </>
        )}
    </main>
  )
}

export default MangaInfo