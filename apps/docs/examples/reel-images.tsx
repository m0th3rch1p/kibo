'use client';

import {
  Reel,
  ReelContent,
  ReelItem,
  ReelImage,
  ReelProgress,
  ReelControls,
  ReelNavigation,
  ReelFooter,
} from '@repo/reel';

const reels = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1753731683731-1032f9457b02?w=1080&h=1920&fit=crop',
    title: 'Mountain Adventure',
    description: 'Exploring the peaks',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop',
    title: 'Ocean Waves',
    description: 'Sunset at the beach',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop',
    title: 'Forest Trail',
    description: 'Into the woods',
  },
];

const Example = () => (
  <div className="flex items-center justify-center p-8">
    <div className="max-w-[400px] w-full">
      <Reel data={reels}>
        <ReelProgress />
        <ReelContent>
          {(reel) => (
            <ReelItem>
              <ReelImage src={reel.image} alt={reel.title} duration={5} />
              <ReelFooter>
                <div className="text-white">
                  <h3 className="text-lg font-semibold">{reel.title}</h3>
                  <p className="text-sm opacity-90">{reel.description}</p>
                </div>
              </ReelFooter>
            </ReelItem>
          )}
        </ReelContent>
        <ReelNavigation />
        <ReelControls />
      </Reel>
    </div>
  </div>
);

export default Example;