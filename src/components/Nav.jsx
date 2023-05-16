import React, {useRef} from 'react'
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const Nav = ({ navStatus }) => {
  const animeDropdown = useRef();
  const toggleRef = useRef()

  const toggleDropdown = (dropdownRef) => {
    if (dropdownRef.current.classList.contains('hidden')) {
      dropdownRef.current.classList.remove('hidden');
    } else {
      dropdownRef.current.classList.add('hidden')
    }
  }

  const toggleTheme = () => {
    toggleRef.current.classList.add('translate-x-[40px]')
  }

  return (
    <section id='nav-container' className='fixed top-0 left-0 w-full z-[5] -translate-x-full transition-all duration-500' style={navStatus ? {transform: "translateX(0)"} : {}}>
        <article className='bg-white w-[60%] h-full flex flex-col justify-between pt-24 pb-6'>
            <nav>
                <ul className='text-lg flex flex-col gap-4 px-6'>

                  <div className='flex justify-around items-center pb-4'>
                    <SunIcon className='h-8 w-8' />

                    <div onClick={toggleTheme} className='w-[72px] h-8 rounded-full relative bg-accent'>
                      <div ref={toggleRef} className='absolute h-7 w-7 rounded-full bg-white top-[1.5px] transition-all duration-300 left-0.5'></div>
                    </div>

                    <MoonIcon className='h-8 w-8' />
                  </div>
                  
                    <li className='py-1 flex items-center gap-2'><QuestionMarkCircleIcon className='h-6 w-6' />About Weebixx</li>
                </ul>
            </nav>

        </article>
    </section>
  )
}

export default Nav