import React from 'react'
import Error404 from './components/Tv404'
import NeoBtn from './components/NeoBtn'

const NotFound = () => {
  return (
    <div className='w-screen flex justify-center min-h-[calc(70vh)] items-center pb-5 flex-col'>
         <Error404 />
         <NeoBtn text={"NashBot!"} href={"/"} className="mb-10"></NeoBtn>
    </div>
   
  )
}

export default NotFound
