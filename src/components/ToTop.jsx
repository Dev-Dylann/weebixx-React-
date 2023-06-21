import React, { useState, useEffect } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const ToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
            setIsVisible(scrollTop > 200);
          };

        window.addEventListener('scroll', handleScroll);
    }, [])

  return (
    <a href="#" className='fixed right-7 -bottom-4 bg-accent h-12 w-12 rounded-full grid place-content-center invisible transition-all hover:brightness-90 shadow-lg md:h-16 md:w-16' style={isVisible ? {bottom: '32px', visibility: 'visible'} : {}}><ChevronUpIcon className='h-6 w-6 dark:stroke-[#1a1a1a] md:h-8 md:w-8' /></a>
  )
}

export default ToTop