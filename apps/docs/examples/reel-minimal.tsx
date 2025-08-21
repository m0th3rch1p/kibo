'use client';

import {
  Reel,
  ReelContent,
  ReelItem,
  ReelVideo,
  ReelProgress,
  ReelNavigation,
} from '@repo/reel';

const reels = [
  {
    id: 1,
    video: '/videos/grok-imagine-1.mp4',
  },
  {
    id: 2,
    video: '/videos/grok-imagine-2.mp4',
  },
  {
    id: 3,
    video: '/videos/grok-imagine-3.mp4',
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
          </ReelItem>
        )}
      </ReelContent>
      <ReelNavigation />
    </Reel>
  </div>
);

export default Example;