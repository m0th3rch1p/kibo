import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  type HTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type EnrichedTweet,
  QuotedTweet as ReactQuotedTweet,
  TweetActions as ReactTweetActions,
  TweetBody as ReactTweetBody,
  TweetHeader as ReactTweetHeader,
  TweetInReplyTo as ReactTweetInReplyTo,
  TweetInfo as ReactTweetInfo,
  TweetMedia as ReactTweetMedia,
  TweetReplies as ReactTweetReplies,
  TweetNotFound,
  TweetSkeleton,
  enrichTweet,
  useTweet,
} from 'react-tweet';

type TweetContextProps = {
  data: EnrichedTweet | null;
};

const TweetContext = createContext<TweetContextProps>({
  data: null,
});

type TweetContainerProps = HTMLAttributes<HTMLDivElement>;

export const TweetContainer = ({
  id,
  className,
  ...props
}: TweetContainerProps) => {
  const { data, error } = useTweet(id);
  const [tweet, setTweet] = useState<EnrichedTweet | null>(null);

  useEffect(() => {
    if (data && !tweet) {
      setTweet(enrichTweet(data));
    }
  }, [data, tweet]);

  if (error) {
    return <TweetNotFound />;
  }

  if (!tweet) {
    return <TweetSkeleton />;
  }

  return (
    <TweetContext.Provider value={{ data: tweet }}>
      <div
        className={cn(
          'size-full min-w-[250px] max-w-[550px] overflow-hidden rounded-xl border bg-background p-4 transition-colors',
          'hover:bg-accent',
          className
        )}
        {...props}
      />
    </TweetContext.Provider>
  );
};

export type TweetHeaderProps = {};

export const TweetHeader = () => {
  const { data } = useContext(TweetContext);

  if (!data) {
    return null;
  }

  return (
    <ReactTweetHeader
      tweet={data}
      components={{
        AvatarImg: ({ src, alt, height, width }) => (
          <Avatar style={{ height, width }}>
            <AvatarImage src={src} alt={alt} className="size-full" />
            <AvatarFallback>{alt.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ),
      }}
    />
  );
};

export type TweetInReplyToProps = {};

export const TweetInReplyTo = () => {
  const { data } = useContext(TweetContext);

  if (!data || !data.in_reply_to_status_id_str) {
    return null;
  }

  return <ReactTweetInReplyTo tweet={data} />;
};

export type TweetBodyProps = {};

export const TweetBody = () => {
  const { data } = useContext(TweetContext);

  if (!data) {
    return null;
  }

  return <ReactTweetBody tweet={data} />;
};

export type TweetMediaProps = {};

export const TweetMedia = () => {
  const { data } = useContext(TweetContext);

  if (!data || !data.mediaDetails?.length) {
    return null;
  }

  return <ReactTweetMedia tweet={data} />;
};

export type TweetQuotedTweetProps = {};

export const TweetQuotedTweet = () => {
  const { data } = useContext(TweetContext);

  if (!data || !data.quoted_tweet) {
    return null;
  }

  return <ReactQuotedTweet tweet={data.quoted_tweet} />;
};

export type TweetInfoProps = {};

export const TweetInfo = () => {
  const { data } = useContext(TweetContext);

  if (!data) {
    return null;
  }

  return <ReactTweetInfo tweet={data} />;
};

export type TweetActionsProps = {};

export const TweetActions = () => {
  const { data } = useContext(TweetContext);

  if (!data) {
    return null;
  }

  return <ReactTweetActions tweet={data} />;
};

export type TweetRepliesProps = {};

export const TweetReplies = () => {
  const { data } = useContext(TweetContext);

  if (!data) {
    return null;
  }

  return <ReactTweetReplies tweet={data} />;
};

export type TweetProps = {
  id: string;
};

export const Tweet = ({ id }: TweetProps) => (
  <TweetContainer id={id}>
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
