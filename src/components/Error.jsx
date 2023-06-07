import React from 'react'
import { Link } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'


const Error = ({ fetchError }) => {
  return (
    <article className='text-center py-10 px-5 flex flex-col gap-4 items-center'>
        <ExclamationCircleIcon className='h-16 w-16 dark:stroke-white' />
        <p className='text-xl font-bold font-montserrat dark:text-white'>{fetchError}</p>
        <Link to='/' className='text-gray-400 -mt-2 underline'>Back to Homepage</Link>
    </article>
  )
}

export default Error