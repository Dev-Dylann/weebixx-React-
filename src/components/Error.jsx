import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'


const Error = ({ fetchError }) => {
  return (
    <article className='text-center py-10 flex flex-col gap-4 items-center'>
        <ExclamationCircleIcon className='h-16 w-16' />
        <p className='text-xl font-bold font-montserrat'>{fetchError}</p>
    </article>
  )
}

export default Error