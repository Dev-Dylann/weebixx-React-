import React from 'react'

const Loader = () => {
  return (
    <article className='py-10 flex justify-center'>
        <div className='loading animate-spin duration-500 bg-accent h-12 w-12 rounded-full grid place-content-center'>
            <div className='bg-white h-9 w-9 rounded-full dark:bg-background-dark'></div>
        </div>
    </article>
  )
}

export default Loader