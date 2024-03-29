import React, { useState, useEffect, useContext, useRef } from 'react'
import DataContext from '../context/DataContext'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import logo from '../assets/logo.png'
import darkLogo from '../assets/logo-dark.png'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const {isDark, setIsDark} = useContext(DataContext)

  const [searchIcon, setSearchIcon] = useState(false);
  const [navStatus, setNavStatus] = useState(false);
  const [query, setQuery] = useState('');

  const headerRef = useRef()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (scrollY >= 30) {
        headerRef.current.classList.add('lg:backdrop-blur-md')
      } else {
        headerRef.current.classList.remove('lg:backdrop-blur-md')
      }
    })
  }, [])

  return (
    <header ref={headerRef} className='relative font-montserrat lg:fixed lg:top-0 lg:left-0 lg:w-full lg:z-10 lg:transition-all lg:duration-300' style={location.pathname.includes('chapter') ? {position: 'relative'} : {}}>
      <section className='w-full max-w-[1400px] px-5 py-3 flex justify-between items-center gap-5 bg-white dark:bg-background-dark sm:px-7 md:px-10 lg:bg-transparent lg:dark:bg-transparent lg:px-16 lg:mx-auto lg:justify-center lg:py-5 lg:gap-3'>
        <button className='z-10 rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333] lg:hidden' onClick={() => setNavStatus(prev => !prev)}>
          {!navStatus ? <Bars3Icon className='h-8 w-8 dark:stroke-white' /> : <XMarkIcon className='h-8 w-8 dark:stroke-white' />}
        </button>

        <Link to='/' className='flex justify-center z-10 lg:hidden' ><img src={isDark ? darkLogo : logo} alt="Weebix" className='w-2/5 max-w-[300px] md:max-w-[375px]' /></Link>

        <Link to='/' className='hidden lg:block w-fit z-10' ><img src={window.location.pathname === '/' || isDark ? darkLogo : logo} alt="Weebix" className='w-1/4' /></Link>

        <form className='hidden lg:flex gap-1 z-10 w-4/5' onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className='absolute -left-[10000px]'>Search anime or manga...</label>
          <input type="text" id='search' placeholder='Search anime or manga...' autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className='px-3 py-1 rounded-full grow text-sm lg:outline lg:outline-1 lg:outline-black lg:focus:outline-[3px]' />
          
          <Link to={`search/${query}`}>
              <button type='submit' className='bg-accent px-3 py-1 rounded-full hover:brightness-90 text-sm'>Search</button>
          </Link>
        </form>

        <Link to={'settings'} className='hidden lg:block z-10' title="Settings" style={
          window.location.pathname === '/' || isDark ? 
            {color: 'white'} : {color: '#1a1a1a'}
        }>
          <Cog6ToothIcon className='h-8 w-8' />
        </Link>

          <button onClick={() => setIsDark(prev => !prev)} className='h-7 w-24 rounded-full p-1 bg-accent z-10 hidden lg:flex dark:justify-end transition-all duration-300'>
            <div className='h-full w-6 rounded-full bg-white dark:bg-background-dark dark:text-white grid place-content-center'>
              {isDark ? <MoonIcon className='h-4 w-4' /> : <SunIcon className='h-4 w-4' />}
            </div>
          </button>


        <button className='z-10 rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333] lg:hidden' onClick={() => setSearchIcon(prev => !prev)}>
          <MagnifyingGlassIcon className='h-7 w-7 dark:stroke-white'/>
        </button>

        <Nav navStatus={navStatus} setNavStatus={setNavStatus} />

        {searchIcon && (
          <form className='absolute w-[92%] h-[90%] top-[5%] left-[4%] bg-white flex gap-3 items-center font-nunito z-[11] dark:bg-background-dark' onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className='absolute -left-[10000px]'>Search anime or manga...</label>
            <input type="text" id='search' placeholder='Search anime or manga' autoFocus='on' value={query} onChange={(e) => setQuery(e.target.value)} className='grow rounded-lg px-3 py-1 border border-background-dark' />

            <Link to={`search/${query}`} onClick={() => setSearchIcon(prev => !prev)}>
              <button type='submit' className='font-bold bg-accent px-3 py-1 rounded-md hover:brightness-90'>Search</button>
            </Link>

            <button type='button' onClick={() => setSearchIcon(prev => !prev)} className='rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333]'>
              <XMarkIcon className='h-6 w-6 dark:stroke-white' />
            </button>
          </form>
        )}
      </section>  
    </header>
  )
}

export default Header