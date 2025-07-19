import React from 'react'

const Profile = () => {
  return (
    <div className=" w-full h-full pt-8 bg-[#EDF6F9]">
        <div className="flex flex-col  border border-[#808080] rounded-xl overflow-hidden">
            <div className="relative h-[200px] w-full " style={{backgroundImage: "url('/profilebannerbg.png')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <div className=" relative w-full bg-[#FFFFFF] px-10 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img src="/perimg.png" alt="profile photo" className=' size-36 rounded-full object-cover mt-[-5rem] z-10 border border-gray-300 shadow-lg' />
                        <div className="flex flex-col gap-2 text-[#212121]">
                            <h3 className='text-xl font-medium'>Aman Shaikh</h3>
                            <p className='text-sm font-medium'>@aman.shaikh</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>100</p>
                        <p className='text-sm font-medium text-[#808080]'>Posts</p>
                        </div>
                        <div className="w-[1px] h-[55px] bg-[#808080] "></div>
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>433</p>
                        <p className='text-sm font-medium text-[#808080]'>Followers</p>
                        </div>
                        <div className="w-[1px] h-[55px] bg-[#808080] "></div>
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>403</p>
                        <p className='text-sm font-medium text-[#808080]'>Following</p>
                        </div>
                    </div>
                    
            </div>
        </div>
    </div>
  )
}

export default Profile