import React, { useState, useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import logo from '../assets/logo.png'
import darkLogo from '../assets/logo-dark.png'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const {isDark, setIsDark} = useContext(DataContext)
  const [searchIcon, setSearchIcon] = useState(false);
  const [navStatus, setNavStatus] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark])

  return (
    <header className='relative px-5 py-3 font-montserrat flex justify-between items-center gap-5 bg-white dark:bg-background-dark sm:px-7 md:px-10 lg:bg-transparent lg:dark:bg-transparent lg:absolute lg:px-16 lg:justify-center lg:py-5'>
        <button className='z-10 rounded-md hover:bg-[whitesmoke] dark:hover:bg-[#333] lg:hidden' onClick={() => setNavStatus(prev => !prev)}>
          {!navStatus ? <Bars3Icon className='h-8 w-8 dark:stroke-white' /> : <XMarkIcon className='h-8 w-8 dark:stroke-white' />}
        </button>

        <Link to='/' className='flex justify-center z-10 lg:hidden' ><img src={isDark ? darkLogo : logo} alt="Weebix" className='w-2/5 max-w-[300px] md:max-w-[375px]' /></Link>

        <Link to='/' className='hidden lg:block w-fit z-10' ><img src={darkLogo} alt="Weebix" className='w-1/4' /></Link>

        <form className='hidden lg:flex gap-1 z-10 w-4/5' onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className='absolute -left-[10000px]'>Search anime or manga...</label>
          <input type="text" id='search' placeholder='Search anime or manga...' autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className='px-3 py-1 rounded-full grow text-sm' />
          
          <Link to={`search/${query}`}>
              <button type='submit' className='bg-accent px-3 py-1 rounded-full hover:brightness-90 text-sm'>Search</button>
          </Link>
        </form>

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
    </header>
  )
}

export default Header