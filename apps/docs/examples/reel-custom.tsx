'use client';

import {
  Reel,
  ReelContent,
  ReelItem,
  ReelVideo,
  ReelProgress,
  ReelHeader,
  ReelFooter,
  ReelOverlay,
} from '@repo/reel';
import { Heart, MessageCircle, Share } from 'lucide-react';

const reels = [
  {
    id: 1,
    video: '/videos/grok-imagine-1.mp4',
    author: 'Alex Johnson',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    description: 'Check out this amazing view! #travel #adventure',
    likes: '12.5K',
    comments: '234',
  },
  {
    id: 2,
    video: '/videos/grok-imagine-2.mp4',
    author: 'Sarah Chen',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    description: 'Living my best life 🌟 #happy #vibes',
    likes: '8.3K',
    comments: '156',
  },
  {
    id: 3,
    video: '/videos/grok-imagine-3.mp4',
    author: 'Mike Davis',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    description: 'Creating magic every day ✨ #creativity',
    likes: '15.2K',
    comments: '412',
  },
];

const Example = () => (
  <div className="h-[600px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
    <Reel data={reels} className="h-full max-h-[600px]">
      <ReelProgress />
      <ReelContent>
        {(reel) => (
          <ReelItem>
            <ReelVideo src={reel.video} />
            
            <ReelHeader>
              <div className="flex items-center gap-2">
                <img
                  src={reel.avatar}
                  alt={reel.author}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="text-white font-medium text-sm">
                  {reel.author}
                </span>
                <button className="ml-auto px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/30 transition-colors">
                  Follow
                </button>
              </div>
            </ReelHeader>

            <ReelFooter>
              <div className="flex items-end justify-between">
                <div className="flex-1 text-white">
                  <p className="text-sm mb-2">{reel.description}</p>
                </div>
                
                <div className="flex flex-col gap-4 ml-4">
                  <button className="flex flex-col items-center gap-1 text-white">
                    <Heart className="w-6 h-6" />
                    <span className="text-xs">{reel.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-white">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs">{reel.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-white">
                    <Share className="w-6 h-6" />
                    <span className="text-xs">Share</span>
                  </button>
                </div>
              </div>
            </ReelFooter>
          </ReelItem>
        )}
      </ReelContent>
    </Reel>
  </div>
);

export default Example;