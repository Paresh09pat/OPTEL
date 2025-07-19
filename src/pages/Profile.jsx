import React from 'react'
import CreatePostSection from '../components/specific/Home/CreatePostSection'
import QuickActionSection from '../components/specific/Home/QuickActionSection'

import PostCard from '../components/specific/Home/PostCard'

const Profile = () => {
    const posts = [
        {
          id: 1,
          user: {
            name: 'feeliummagic',
            avatar: '/perimg.png'
          },
          content: 'Explore new horizons... Follow us for design inspiration, Check out our latest graphic design and branding content. @feeliummagic...more',
          image: '/mobile.jpg',
          likes: '2k+',
          comments: '100+',
          shares: '250+',
          saves: '50+',
          timeAgo: '2h ago'
        },
        {
          id: 2,
          user: {
            name: '_amu_456',
            avatar: '/perimg.png'
          },
          content: 'What a thrilling clash between MI & LSG last night! LSG got the time only with Mitchell Marsh hammering 60 off just 31 balls, powering them to a massive 204/5. Mumbai fought back strongly, but Suryakumar Yadav brought them back with a classy 67 (43). Hardik Pandya shined with the ball (3/21), but LSG\'s bowlers held their nerve in the death overs, sealing a 12-run win. Momentum shift. Playoff race heating up! This IPL just keeps getting better. #MIvsLSG #IPL2025 #CricketMadness #GameDay',
          image: null,
          likes: '2k+',
          comments: '100+',
          shares: '250+',
          saves: '50+',
          timeAgo: '4h ago'
        }
      ];
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
        <div className="w-full mt-4 px-5">
        <CreatePostSection  />
        </div>
        <div className="w-full mt-4 px-5">
            <QuickActionSection />
        </div>
        <div className="w-full mt-4 px-5">
        <PostCard
              user={posts[0].user}
              content={posts[0].content}
              image={posts[0].image}
              likes={posts[0].likes}
              comments={posts[0].comments}
              shares={posts[0].shares}
              saves={posts[0].saves}
              timeAgo={posts[0].timeAgo}
            />
        </div>
    </div>
  )
}

export default Profile