import React, {useEffect, useRef, useContext} from 'react'
import DataContext from '../context/DataContext'
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const Nav = ({ navStatus }) => {
  const { isDark, setIsDark } = useContext(DataContext)
  const toggleRef = useRef()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark])

  return (
    <section id='nav-container' className='fixed top-0 left-0 w-full z-[5] -translate-x-full transition-all duration-500 lg:hidden' style={navStatus ? {transform: "translateX(0)"} : {}}>
        <article className='bg-white w-[60%] h-full flex flex-col justify-between pt-24 pb-6 dark:bg-background-dark dark:text-white sm:max-w-[350px]'>
            <nav>
                <ul className='text-lg flex flex-col gap-4 px-6 sm:px-8'>

                  <div className='flex justify-around items-center pb-4 sm:justify-center sm:gap-8 sm:pb-5'>
                    <SunIcon className='h-8 w-8' />

                    <div onClick={() => setIsDark(prev => !prev)} className='w-[72px] h-8 rounded-full relative bg-accent'>
                      <div ref={toggleRef} className='absolute h-7 w-7 rounded-full bg-white dark:bg-background-dark top-[1.5px] transition-all duration-300 left-0.5' style={isDark ? {transform: 'translateX(40px)'} : {}}></div>
                    </div>

                    <MoonIcon className='h-8 w-8' />
                  </div>
                  
                    <li className='py-1 flex items-center gap-2 sm:text-lg'><QuestionMarkCircleIcon className='h-6 w-6' />About Weebixx</li>
                </ul>
            </nav>

        </article>
    </section>
  )
}

export default Nav