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

const reels: ReelItem[] = [
  {
    id: 1,
    type: 'video',
    src: '/videos/grok-imagine-1.mp4',
    duration: 6, // 6 seconds
    title: 'Grok Imagine Demo 1',
    description: 'First demo video',
  },
  {
    id: 2,
    type: 'video',
    src: '/videos/grok-imagine-2.mp4',
    duration: 6, // 6 seconds
    title: 'Grok Imagine Demo 2',
    description: 'Second demo video',
  },
  {
    id: 3,
    type: 'video',
    src: '/videos/grok-imagine-3.mp4',
    duration: 6, // 6 seconds
    title: 'Grok Imagine Demo 3',
    description: 'Third demo video',
  },
];

const Example = () => (
  <Reel data={reels}>
    <ReelProgress />
    <ReelContent>
      {(reel) => (
        <ReelItem key={reel.id}>
          <ReelVideo src={reel.src} />
        </ReelItem>
      )}
    </ReelContent>
    <ReelNavigation />
    <ReelControls />
  </Reel>
);

export default Example;
