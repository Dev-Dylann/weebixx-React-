import React, { useEffect, useContext } from 'react'
import DataContext from '../context/DataContext'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const { setIsDark } = useContext(DataContext)

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [])

  return (
    <div className=''>
        <Header />
        <Outlet />
    </div>
  )
}

export default Layout