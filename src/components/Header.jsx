import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import logo from '../assets/logo.png'
import darkLogo from '../assets/logo-dark.png'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Header = () => {

  const [searchIcon, setSearchIcon] = useState(false);
  const [navStatus, setNavStatus] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <header className='relative px-5 py-3 font-montserrat flex justify-between items-center gap-5'>
        <button className='z-10' onClick={() => setNavStatus(prev => !prev)}>
          {!navStatus ? <Bars3Icon className='h-8 w-8' /> : <XMarkIcon className='h-8 w-8' />}
        </button>

        <Link to='/' className='flex justify-center z-10' ><img src={logo} alt="Weebix" className='w-1/2' /></Link>

        <button className='z-10' onClick={() => setSearchIcon(prev => !prev)}>
          <MagnifyingGlassIcon className='h-6 w-6'/>
        </button>

        <Nav navStatus={navStatus} />

        {searchIcon && (
          <form className='absolute w-[90%] h-[90%] top-[5%] bottom-[5%] bg-white flex gap-3 items-center font-nunito z-[11]' onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className='absolute -left-[10000px]'>Search anime or manga...</label>
            <input type="text" id='search' placeholder='Search anime or manga' autoFocus='on' value={query} onChange={(e) => setQuery(e.target.value)} className='grow rounded-lg px-3 py-1 border border-background-dark' />

            <Link to={`search/${query}`} onClick={() => setSearchIcon(prev => !prev)}>
              <button type='submit' className='font-bold bg-accent px-3 py-1 rounded-md'>Search</button>
            </Link>

            <button type='button' onClick={() => setSearchIcon(prev => !prev)}>
              <XMarkIcon className='h-6 w-6' />
            </button>
          </form>
        )}
    </header>
  )
}

export default Header