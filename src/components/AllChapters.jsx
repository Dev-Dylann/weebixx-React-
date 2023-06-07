import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mangaApi } from '../api/api'
import Loader from './Loader'
import Error from './Error'
import { ArrowsUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import ToTop from './ToTop'

const AllChapters = () => {
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
    if (mangaInfo) {
        document.title = `Weebixx - ${mangaInfo.title?.romaji} Chapters`;
    } else {
        document.title = 'Weebixx'
    }
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
      <section className='flex flex-col p-5 gap-4'>
            <h2 className='font-montserrat'><Link to={`/manga/${mangaInfo.id}`} className='underline'>{mangaInfo.title?.romaji}</Link> All Chapters</h2>

            <div className='flex items-center self-end gap-4'>
                <button type='button' className='flex gap-2 items-center' onClick={() => setChapterSort(prev => prev === 'Newest First' ? 'Oldest First' : 'Newest First')}>
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
                  <Link to={`/chapter/${mangaInfo.id}/${chapter.encodedId}`} key={chapter.id} className='py-2 px-5 border-b dark:border-b-gray-700'>
                      <div className='flex flex-col py-2'>
                          <p className='line-clamp-1 text-ellipsis'>Chapter {chapter.chapterNumber}: {chapter.title}</p>
                          <p className='text-gray-400 text-sm'>{chapter.releasedDate}</p>
                      </div>
                  </Link>
              ))
          ) : (
              <p className='text-center col-span-full'>No chapters have been released yet.</p>
          )}

        </section>
      )}

      <ToTop />
    </main>
  )
}

export default AllChapters