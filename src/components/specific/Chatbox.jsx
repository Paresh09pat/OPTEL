import React from 'react'
import { FaPlus, FaUser, FaUsers } from 'react-icons/fa'
import { CiCircleMore } from 'react-icons/ci'
import { BiBell } from 'react-icons/bi'
import { FaTimes } from 'react-icons/fa'
import { HiUsers } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";



const Chatbox = ({ onClose, isMobile = false }) => {
  // Random conversation data
  const conversations = [
    {
      id: 1,
      name: "Sana Rizvi",
      message: "I am sending the design...",
      time: "now",
      isOnline: true,
      avatar: "/perimg.png"
    },
    {
      id: 2,
      name: "Alex Johnson",
      message: "Hey! How's the project going?",
      time: "2m",
      isOnline: true,
      avatar: "/perimg.png"
    },
    {
      id: 3,
      name: "Sarah Chen",
      message: "Thanks for the meeting notes 📝",
      time: "15m",
      isOnline: false,
      avatar: "/perimg.png"
    },
    {
      id: 4,
      name: "Mike Torres",
      message: "Let's schedule a call tomorrow",
      time: "1h",
      isOnline: true,
      avatar: "/perimg.png"
    },
    {
      id: 5,
      name: "Emma Davis",
      message: "The presentation looks great!",
      time: "2h",
      isOnline: false,
      avatar: "/perimg.png"
    },
  ];

  return (
    <div className={`bg-[#EDF6F9] px-6 py-8 h-full overflow-y-auto scrollbar-hide smooth-scroll pt-0  ${
      isMobile ? 'w-full' : 'w-60'
    }`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4 lg:hidden pt-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages & Activity</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      )}
  
      {/* Profile Section */}
      <div className="pt-8 sticky top-0 z-10 bg-[#EDF6F9] ">
      <div className="w-full xl:p-3 lg:p-2 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#808080] sticky top-8 z-10">
        <div className="flex xl:p-4 lg:p-2 items-center justify-between">
          <div className="relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px] border-inset border-[#ffffff] shadow-md shadow-fuchsia-400">
            <div className="grid place-items-center absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white">
              <FaPlus className='text-white size-[10px]' />
            </div>
          </div>

          <div className="flex items-center justify-center xl:gap-4 lg:gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7}></circle>
                <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
              </g>
            </svg>
            <BiBell className='text-gray-500 size-[25px] cursor-pointer' />
            <CiCircleMore className='text-gray-500 size-[25px] cursor-pointer' />
            <input type="text" placeholder='Search' className='text-gray-500 text-sm outline-none ml-2 w-full bg-transparent hidden transition-colors duration-300 rounded-md p-2' />
          </div>
        </div>
      </div>
      </div>

      {/* Individual/Groups Toggle */}
      <div className="flex flex-col p-5 mt-2.5 bg-white rounded-lg border border-[#808080]">
        <div className="flex w-full items-center justify-between">
          <button className='relative flex items-center gap-2 border border-[#212121] xl:px-4 lg:px-2 py-2 rounded-xl cursor-pointer'>
            <div className="grid absolute bg-[#B3261E] place-items-center w-6 h-6 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUser className='text-[#212121] xl:size-[24px] lg:size-[18px] ' />
            <span className='text-[#212121] text-sm font-medium'>Individual</span>
          </button>

          <button className='relative flex items-center gap-2 cursor-pointer'>
            <div className="grid absolute bg-[#B3261E] place-items-center w-5 h-5 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUsers className='text-[#808080] xl:size-[32px] lg:size-[24px]  ' />
          </button>
        </div>

      <div className="flex flex-col xl:gap-4 lg:gap-2">
                 {conversations.map((conversation) => (
           <div key={conversation.id} className="mt-6 w-full flex items-center justify-between xl:gap-4 lg:gap-2">
             {/* profile photo */}
             <div className="grid xl:size-11 lg:size-8 rounded-full bg-black relative" > 
               <div className={`xl:size-4 lg:size-3 rounded-full ${conversation.isOnline ? 'bg-[#4CAF50]' : 'bg-gray-400'} absolute -right-0 -bottom-0 border-2 border-inset border-white`}></div>
             </div>

            <div className="flex flex-col gap-1">
              <p className="xl:text-sm lg:text-xs font-semibold text-[#212121]">{conversation.name}</p>
              <p className="xl:text-xs lg:text-xs text-[#212121] line-clamp-1">{conversation.message}</p>
            </div>
            <span className='text-[#212121] xl:text-sm lg:text-xs font-medium'>{conversation.time}</span>
          </div>
        ))}
      </div>
      </div>

      <div className="flex flex-col p-5 mt-2.5 bg-white rounded-lg border border-[#808080]">
        <div className="flex items-center justify-between w-full">
          <h5 className='text-lg font-semibold text-gray-800 '>Pages you may like</h5> 
          <button>
          <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7}></circle>
                <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
              </g>
            </svg>
          </button>
        </div>

        <div className="flex w-full overflow-x-auto scrollbar-hide mt-6">
          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
              <HiUsers className='text-[#808080] size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>20 Members</span>
              </div>
              <div className="flex gap-1.5">
              <img src="/icons/book.png" alt="book" className='size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>200+Posts</span>
              </div>
              </div>
            </div>
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>


          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
              <HiUsers className='text-[#808080] size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>20 Members</span>
              </div>
              <div className="flex gap-1.5">
              <img src="/icons/book.png" alt="book" className='size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>200+Posts</span>
              </div>
              </div>
            </div>
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>


          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
              <HiUsers className='text-[#808080] size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>20 Members</span>
              </div>
              <div className="flex gap-1.5">
              <img src="/icons/book.png" alt="book" className='size-[15px]' />
              <span className='text-[#808080] text-xs font-medium'>200+Posts</span>
              </div>
              </div>
            </div>
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>
        
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-6 bg-white mt-2.5 rounded-lg border border-[#808080]">
        <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-[#212121]">Trending Topics</h5>
        <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7}></circle>
                <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
              </g>
            </svg>
        </div>
      
        <div className="space-y-1 mt-5">
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
              <a href="#" className="font-medium ">#Technology</a>
              <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
              <a href="#" className="font-medium ">#Technology</a>
              <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
              <a href="#" className="font-medium ">#Technology</a>
              <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
              <a href="#" className="font-medium ">#Technology</a>
              <p className="text-sm ">12.5k posts</p>
          </div>

        </div>
      </div>

      {/* Who to Follow */}
      <div className="py-4 px-6 mt-2.5 bg-[#808080] rounded-lg border border-[#808080]">
      <img src="/logos/ouptelfootericon.svg" alt="ouptel-logo" />
        <div className="grid grid-cols-2 gap-11 text-white mt-3.5 text-[12px]">
         <div className="flex flex-col gap-1.5 ">
          <a href="">About us</a>
          <a href="">Blogs</a>
          <a href="">Contact us</a>
          <a href="">Developers</a>
         </div>
         <div className="flex flex-col gap-1.5 ">
          <a href="">Languages</a>
          <a href="">Terms & Condition</a>
          <a href="">Privacy Policy</a>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbox
