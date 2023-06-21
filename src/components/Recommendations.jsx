import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Splide, SplideSlide } from '@splidejs/react-splide'

const Recommendations = ({mediaInfo}) => {
    const [sliderOptions] = useState({
        type: 'slide',
        perPage: 3,
        perMove: 3,
        mediaQuery: 'min',
        breakpoints: {
            640: {
                perPage: 4,
                perMove: 4,
            }
        },
        gap: '12px',
        autoplay: false,
        pagination: false,
        arrows: false,
    }) 

  return (
    <Splide options={sliderOptions} aria-labelledby='Recommended Anime' className='flex gap-3 px-5 sm:px-7 md:px-10'>
        {mediaInfo.recommendations?.map(item => (
            <SplideSlide key={item.id} className='hover:scale-105 transition-all'>
                <Link to={`/anime/${item.id}`} className='h-full relative flex flex-col gap-2 pb-4'>
                    <img src={item.image} alt={item.title.userPreferred} className='rounded-lg'/>
                    <p className='line-clamp-2 text-ellipsis font-nunito text-sm sm:text-base'>{item.title.userPreferred}</p>
                </Link>
            </SplideSlide>
        ))}
    </Splide>
  )
}

export default Recommendations