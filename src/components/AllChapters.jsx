import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { mangaApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import ToTop from './ToTop'

const AllChapters = () => {
  const {ogTitle, ogDesc, ogImg, setOgTitle, setOgDesc, setOgImg} = useContext(DataContext);

  const {mangaId} = useParams();
  const [mangaInfo, setMangaInfo] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [chapterSort, setChapterSort] = useState('Newest First');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const fetchMangaInfo = async () => {
      try {
        const {data} = await mangaApi.get(`info/${mangaId}`, {
          params: {
            provider: 'mangadex',
          }
        });
        console.log(data);
        setMangaInfo(data);
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

    fetchMangaInfo();
  }, [])

  useEffect(() => {
    setOgTitle(`Weebixx - ${mangaInfo.title?.romaji}`);
    setOgDesc(`Read all ${mangaInfo.title?.romaji} chapters for free and discover more manga like this.`);
    setOgImg(mangaInfo?.image)
  }, [mangaInfo])

  useEffect(() => {
    if (mangaInfo.chapters) {
      const chaptersWithEncodedId = mangaInfo.chapters.map(chapter => {
        const encodedId = encodeURIComponent(chapter.id)

        return {...chapter, encodedId}
      })

        if (chapterSort === 'Newest First') {
            const newFirst = [...chaptersWithEncodedId];
            newFirst.reverse();
            setChapterList(newFirst);
        } else if (chapterSort === 'Oldest First') {
            const oldFirst = [...chaptersWithEncodedId];
            setChapterList(oldFirst);
        }
    }

  }, [mangaInfo, chapterSort])

  return (
    <main className='dark:text-white relative'>

      {/* Dynamically change the og meta tags */}
        <Helmet prioritizeSeoTags>
            <title>{ogTitle}</title>
            <meta property='og:title' content={ogTitle} data-rh='true' />
            <meta property='og:description' content={ogDesc} data-rh='true' />
            <meta property='og:image' content={ogImg} data-rh='true' />
        </Helmet>

      <section className='flex flex-col p-5 gap-4 sm:px-7'>
            <h2 className='font-montserrat sm:text-lg'><Link to={`/manga/${mangaInfo.id}`} className='underline sm:font-bold sm:no-underline sm:hover:underline'>{mangaInfo.title?.romaji}</Link> All Chapters</h2>

            <div className='flex items-center self-end gap-4'>
                <button type='button' className='flex gap-2 items-center p-1 rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333] transition-all' onClick={() => setChapterSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
                    <p className='text-sm'>{chapterSort}</p>
                    <ArrowsUpDownIcon className='h-6 w-6' />
                </button>
            </div>
      </section>

      {isLoading && !fetchError && <Loader />}

      {fetchError && !isLoading && <Error fetchError={fetchError} />}

      {!fetchError && !isLoading && (
        <section className='flex flex-col'>
          {chapterList ? (
              chapterList.map(chapter => (
                  <Link to={`/chapter/${mangaInfo.id}/${chapter.encodedId}`} key={chapter.id} className='py-2 px-5 border-b dark:border-b-gray-700 hover:bg-[whitesmoke] dark:hover:bg-[#333] transition-all sm:px-7'>
                      <div className='flex flex-col py-2'>
                          <p className='line-clamp-1 text-ellipsis sm:text-lg'>Chapter {chapter.chapterNumber}: {chapter.title}</p>
                          <p className='text-gray-400 text-sm sm:text-base'>{chapter.releasedDate}</p>
                      </div>
                  </Link>
              ))
          ) : (
              <p className='text-center col-span-full sm:text-lg'>No chapters have been released yet.</p>
          )}

        </section>
      )}

      <ToTop />
    </main>
  )
}

export default AllChapters