import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  SiAmericanexpress,
  SiDinersclub,
  SiDiscover,
  SiJcb,
  SiMastercard,
  SiVisa,
} from '@icons-pack/react-simple-icons';
import { NfcIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export type CreditCardProps = HTMLAttributes<HTMLDivElement>;

export const CreditCard = ({ className, ...props }: CreditCardProps) => (
  <Card
    className={cn(
      'relative aspect-[8560/5398] gap-0 rounded-2xl transition-transform duration-300',
      'hover:-rotate-y-180',
      className
    )}
    style={{
      transformStyle: 'preserve-3d',
    }}
    {...props}
  />
);

export type CreditCardNumberProps = HTMLAttributes<HTMLParagraphElement>;

export const CreditCardNumber = ({
  className,
  ...props
}: CreditCardNumberProps) => (
  <p
    className={cn(
      'absolute bottom-[10%] left-[5%] font-mono text-2xl',
      className
    )}
    {...props}
  />
);

export type CreditCardNameProps = HTMLAttributes<HTMLParagraphElement>;

export const CreditCardName = ({
  className,
  ...props
}: CreditCardNameProps) => (
  <p
    className={cn(
      'absolute bottom-[10%] left-[5%] font-semibold uppercase',
      className
    )}
    {...props}
  />
);

export type CreditCardExpiryProps = HTMLAttributes<HTMLParagraphElement>;

export const CreditCardExpiry = ({
  className,
  ...props
}: CreditCardExpiryProps) => (
  <p className={cn('font-mono', className)} {...props} />
);

export type CreditCardCvvProps = HTMLAttributes<HTMLParagraphElement>;

export const CreditCardCvv = ({ className, ...props }: CreditCardCvvProps) => (
  <p className={cn('font-mono', className)} {...props} />
);

export type CreditCardChipProps = HTMLAttributes<SVGSVGElement> & {
  withNfcIcon?: boolean;
};

export const CreditCardChip = ({
  className,
  withNfcIcon = true,
  ...props
}: CreditCardChipProps) => (
  <div
    className={cn(
      '-translate-y-1/2 absolute top-1/2 left-[5%] flex w-full items-center gap-[1%]',
      className
    )}
  >
    <svg
      enableBackground="new 0 0 42.2 32.4"
      viewBox="0 0 42.2 32.4"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[12.5%] shrink-0 rounded-[13px] bg-[#c6b784]"
      {...props}
    >
      <title>Chip</title>
      <path
        d="m34.8.7h-27.3c-3.6 0-6.5 2.9-6.5 6.5v17.7c0 3.6 2.9 6.5 6.5 6.5h27.2c3.6 0 6.5-2.9 6.5-6.5v-17.7c0-3.6-2.9-6.5-6.4-6.5zm-.1 29.4h-6.5c-.4-.3-.7-.8-.8-1.3-.1-.6 0-1.3.4-1.8 1-1.3 1.1-2.5 1.1-4.8v-.9h11v3.5c.1 3-2.3 5.3-5.2 5.3zm-5.7-18c0-.1 0-.3.3-.3h10.7v8.3h-11zm-1.2 0v10.1c0 2-.1 3.1-.9 4-.6.8-.8 1.7-.6 2.7.1.4.2.8.4 1.1h-11c.2-.3.3-.7.4-1.1.2-1-.1-1.9-.6-2.7-.8-1-.9-2-.9-4v-12.6c0-2 .1-3 .9-4 .6-.7.8-1.6.6-2.6-.1-.4-.2-.8-.4-1.1h11.1c-.2.3-.3.7-.4 1.1-.2 1 .1 1.9.7 2.7.3.4.6.9.7 1.5l.1.4 1.2-.3-.1-.4c-.2-.7-.5-1.3-.9-1.9-.4-.5-.5-1.1-.4-1.7.1-.5.4-1.1.7-1.3h6.4.1c2.9 0 5.2 2.4 5.2 5.3v3.5h-10.8c-.9-.2-1.5.4-1.5 1.3zm-25.6 8v-8.2h11.2v8.2zm12.8-16.9c.1.6 0 1.2-.4 1.7-1 1.2-1.1 2.5-1.1 4.7v1.1h-11.3v-3.5c0-2.9 2.4-5.3 5.3-5.3h6.7c.4.3.7.8.8 1.3zm-12.8 18.1h11.2v1c0 2.2.2 3.5 1.1 4.7.4.5.5 1.1.4 1.7s-.4 1.1-.8 1.3h-6.6c-2.9 0-5.3-2.4-5.3-5.3z"
        fill="#000"
        stroke="#000"
        strokeWidth={0.1}
      />
    </svg>
    {withNfcIcon && <NfcIcon className="aspect-square h-auto w-[7%]" />}
  </div>
);

export type CreditCardLogoProps = HTMLAttributes<HTMLDivElement>;

export const CreditCardLogo = ({
  className,
  ...props
}: CreditCardLogoProps) => (
  <div
    className={cn('absolute top-[5%] right-[5%] h-full max-h-[19%]', className)}
    {...props}
  />
);

export type CreditCardFrontProps = HTMLAttributes<HTMLDivElement>;

export const CreditCardFront = ({
  className,
  ...props
}: CreditCardFrontProps) => (
  <div
    className={cn('backface-hidden absolute inset-0', className)}
    {...props}
  />
);

export type CreditCardBackProps = HTMLAttributes<HTMLDivElement>;

export const CreditCardBack = ({
  className,
  ...props
}: CreditCardBackProps) => (
  <div
    className={cn('backface-hidden absolute inset-0 rotate-y-180', className)}
    {...props}
  />
);

export type CreditCardProviderProps = HTMLAttributes<HTMLDivElement> & {
  type?:
    | 'visa'
    | 'mastercard'
    | 'american-express'
    | 'discover'
    | 'diners-club'
    | 'jcb';
};

const icons: Record<
  NonNullable<CreditCardProviderProps['type']>,
  typeof SiVisa
> = {
  visa: SiVisa,
  mastercard: SiMastercard,
  'american-express': SiAmericanexpress,
  discover: SiDiscover,
  'diners-club': SiDinersclub,
  jcb: SiJcb,
};

export const CreditCardProvider = ({
  className,
  children,
  type,
  ...props
}: CreditCardProviderProps) => {
  const Icon = type ? icons[type] : 'div';

  return (
    <div
      className={cn(
        'absolute right-[5%] bottom-[5%] h-full max-h-[25%] w-auto',
        className
      )}
      {...props}
    >
      {children ?? <Icon className="size-full" />}
    </div>
  );
};

export type CreditCardMagStripeProps = HTMLAttributes<HTMLDivElement>;

export const CreditCardMagStripe = ({
  className,
  ...props
}: CreditCardMagStripeProps) => (
  <div
    className={cn(
      'absolute top-[8%] right-0 left-0 h-[14%] bg-secondary',
      className
    )}
    {...props}
  />
);
