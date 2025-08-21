'use client';

import {
  Reel,
  ReelContent,
  ReelControls,
  ReelItem,
  ReelNavigation,
  ReelProgress,
  ReelVideo,
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
  <Reel className="w-auto" data={reels}>
    <ReelProgress />
    <ReelContent>
      {(reel) => (
        <ReelItem key={reel.id}>
          <ReelVideo src={reel.video} />
        </ReelItem>
      )}
    </ReelContent>
    <ReelNavigation />
    <ReelControls />
  </Reel>
);

export default Example;
