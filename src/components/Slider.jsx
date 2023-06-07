import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

const Slider = ({ trending }) => {
    const [options] = useState({
        type: 'loop',
        autoplay: true,
        pagination: true,
        arrows: false,
        speed: 750,
        cover: true
    }) 

  return (
    <Splide options={options} aria-labelledby='Trending Anime' className='h-full flex'>
        {trending.map(item => (
            <SplideSlide key={trending.indexOf(item)} className='h-full'>
                <Link to={`anime/${item.id}`} className='h-full flex items-center relative'>
                    <img src={item.image} alt={item.title.userPreferred} className='w-full brightness-[.7] hover:scale-110 transition-all'/>
                    <p className='absolute bottom-8 left-5 w-[80%] h-fit line-clamp-2 text-ellipsis font-nunito'>{item.title.userPreferred}</p>
                </Link>
            </SplideSlide>
        ))}
    </Splide>
  )
}

export default Slider