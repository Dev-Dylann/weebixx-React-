import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'
import SettingsContext from '../context/SettingsContext'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { mangaApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const MangaReader = () => {
  const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);
  const {mangaProvider} = useContext(SettingsContext)

  const {mangaId, chapterId} = useParams();
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapterList, setChapterList] = useState([]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const fetchMangaInfo = async () => {
      try {
        const {data} = await mangaApi.get(`info/${mangaId}`, {
          params: {
            provider: mangaProvider,
          }
        });
        console.log(data);
        setMangaInfo(data);
        setChapterList(data.chapters);
      } catch(err) {
        if (err.response) {
          console.log(err.response.data.message);
          setFetchError(err.response.data.message);
        } else {
          console.log(err.message);
          setFetchError(err.message);
        }
      }
    }

    if (mangaProvider !== '') {
      fetchMangaInfo();
    }
  }, [mangaProvider])

  useEffect(() => {
    setOgTitle(`Weebixx - ${mangaInfo.title?.romaji} Chapter ${chapterList[chapterIndex]?.chapterNumber}`);
    setOgDesc(`Read ${mangaInfo.title?.romaji} Chapter ${chapterList[chapterIndex]?.chapterNumber} for free.`);
    setOgImg(mangaInfo?.image);
  }, [mangaInfo, chapterIndex])
  
  useEffect(() => {
    const decodedId = decodeURIComponent(chapterId);

    const currentChapter = chapterList.find(chapter => {
      return chapter.id === decodedId;
    })

    const currentChapterIndex = chapterList.indexOf(currentChapter);
    setChapterIndex(currentChapterIndex);
  }, [mangaInfo])

  useEffect(() => {
    setIsLoading(true);

    const currentChapter = chapterList[chapterIndex];

    const fetchPages = async () => {
      try {
        const {data} = await mangaApi.get(`/read`, {
          params: {
            chapterId: currentChapter?.id,
            provider: mangaProvider
          }
        })
        console.log(data);
        setPages(data);
      } catch(err) {
        if (err.response) {
          console.log(err.response.data.message);
        } else {
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (currentChapter) {
      fetchPages()
    }
  }, [chapterIndex])
  
  return (
    <main className='relative'>

      {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>

      <section className='sticky top-0 left-0 w-full px-5 py-2 bg-overlay-dark font-montserrat text-white flex flex-col gap-1 sm:px-7 md:px-10 lg:px-16 lg:top-0 xl:px-28'>
        <p className='text-xs sm:text-sm lg:text-base'>{mangaInfo.title?.romaji}</p>
        <p className='text-sm sm:text-base lg:text-lg'>Ch. {chapterList[chapterIndex]?.chapterNumber}: {chapterList[chapterIndex]?.title}</p>
      </section>

      {isLoading && !fetchError && <Loader />}

      {fetchError && !isLoading && <Error fetchError={fetchError} />}

      {!fetchError && !isLoading && (
        <>
          <section className='flex flex-col px-5 py-2 gap-1 items-center dark:text-white sm:px-7 md:px-10 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-8 lg:px-16 lg:py-6 lg:max-w-[1000px] lg:mx-auto xl:px-28'>
            {pages.map(page => (
              <img className='lg:self-start' key={`Page${page.page}`} src={`https://api-consumet-55ajst2bq-isaactan98.vercel.app/utils/image-proxy?url=${encodeURIComponent(page.img)}&referer=${page.headerForImage.Referer}`} alt={`Page ${pages.page}`} />
            ))}
          </section>
        </>
      )}

      <section className='dark:text-[#1a1a1a] fixed w-full bottom-4 left-0 flex justify-between px-5 sm:px-7 md:px-10 lg:px-16 xl:px-28'>
        <button disabled={chapterIndex === 0} onClick={() => setChapterIndex(prev => prev - 1)} className='bg-accent p-3 rounded-full disabled:invisible hover:brightness-90'><ChevronLeftIcon className='h-6 w-6 sm:w-8 sm:h-8' /></button>
        <button disabled={chapterIndex === chapterList.length - 1} onClick={() => setChapterIndex(prev => prev + 1)} className='bg-accent p-3 rounded-full disabled:invisible hover:brightness-90'><ChevronRightIcon className='h-6 w-6 sm:w-8 sm:h-8' /></button>
      </section>
      
    </main>
  )
}

export default MangaReader