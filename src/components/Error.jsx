import React from 'react'
import { Link } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'


const Error = ({ fetchError }) => {
  return (
    <article className='text-center py-10 px-5 flex flex-col gap-4 items-center sm:py-20'>
        <ExclamationCircleIcon className='h-16 w-16 dark:stroke-white sm:h-20 sm:w-20' />
        <p className='text-xl font-bold font-montserrat dark:text-white sm:text-2xl'>{fetchError}</p>
        <Link to='/' className='text-gray-400 -mt-2 underline sm:no-underline sm:hover:underline sm:text-lg'>Back to Homepage</Link>
    </article>
  )
}

export default Error