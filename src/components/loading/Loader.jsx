import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-row gap-2 fixed top-0 left-0 w-full h-full opacity-[0.5] bg-white z-50 justify-center items-center">
      <div
        className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
      ></div>
    </div>
  )
}

export default Loader