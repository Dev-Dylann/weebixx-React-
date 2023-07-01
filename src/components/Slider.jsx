import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import { StarIcon } from '@heroicons/react/24/outline'

const Slider = ({ trending }) => {
    const [options] = useState({
        type: 'loop',
        autoplay: true,
        pagination: true,
        arrows: true,
        speed: 750,
        cover: true,
        classes: {
            arrow: 'splide__arrow slider-arrow',
            page: 'splide__pagination__page slider-page'
        }
    }) 

  return (
    <Splide options={options} aria-labelledby='Trending Anime' className='h-full flex'>
        {trending.map(item => (
            <SplideSlide key={trending.indexOf(item)} className='h-full'>
                <Link to={`anime/${item.id}`} className='h-full flex items-center relative group'>
                    <img src={item.image} alt={item.title.userPreferred} className='w-full brightness-[.6] group-hover:scale-105 transition-all md:brightness-[.5] lg:brightness-[.3] lg:group-hover:scale-[1.025]'/>
                    <div className='absolute bottom-8 left-10 w-[80%] flex items-end gap-4 md:left-16'>
                        <img src={item.image} alt={item.title.userPreferred} className='hidden w-1/4 rounded-md shadow-lg md:block lg:w-1/6' />

                        <div className='flex flex-col gap-2 font-nunito max-h-full md:mb-4'>
                            <p className='h-fit line-clamp-2 text-ellipsis sm:text-xl lg:text-lg lg:font-bold'>{item.title.userPreferred} <span className='text-xs ml-3 font-normal'><StarIcon className='h-4 w-4 inline fill-[gold] stroke-[gold]' />{item.rating}%</span></p>

                            <p className='hidden md:block'>
                                <span className='line-clamp-4 text-ellipsis lg:text-sm'>{item.description}</span>    
                            </p>

                            <p className='flex-wrap gap-2 flex text-xs md:text-base lg:text-sm'>
                                {item.genres?.map(genre => (
                                    <span className='border text-white px-2 py-1 text-center rounded-full' key={item.genres.indexOf(genre)} style={{borderColor: item.color}}>{genre}</span>
                                ))}
                            </p>
                        </div>
                    </div>
                    
                </Link>
            </SplideSlide>
        ))}
    </Splide>
  )
}

export default Slider