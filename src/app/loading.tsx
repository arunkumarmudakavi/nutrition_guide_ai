"use client"
import React from 'react'
import { Bars } from 'react-loader-spinner'

const loading = () => {
  return (
    <div className='flex justify-center align-middle m-18'>
      <Bars
      height="80"
      width="80"
      color="#000"
      ariaLabel="bars-loading"
      visible={true}
      />
    </div>
  )
}

export default loading