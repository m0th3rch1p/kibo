'use client';

import {
  TweetActions,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetInfo,
  TweetMedia,
  TweetQuotedTweet,
  TweetReplies,
} from '@repo/tweet';

const Example = () => (
  <TweetContainer id="1917370626215666164">
    <TweetHeader />
    <TweetInReplyTo />
    <TweetBody />
    <TweetMedia />
    <TweetQuotedTweet />
    <TweetInfo />
    <TweetActions />
    <TweetReplies />
  </TweetContainer>
);

export default Example;
