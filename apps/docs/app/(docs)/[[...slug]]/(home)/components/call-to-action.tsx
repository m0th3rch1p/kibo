import { TextLoop } from '../../../../../components/motion-primitives/text-loop';
import { source } from '../../../../../lib/source';

const components = source
  .getPages()
  .filter((page) => page.slugs.at(0) === 'components')
  .map((page) => page.slugs.at(1))
  .filter((slug) => !slug?.startsWith('ai-'))
  .filter(Boolean) as string[];

export const CallToAction = () => (
  <div className="container mx-auto rounded-4xl bg-secondary py-16">
    <div className="mx-auto grid w-full max-w-2xl gap-4 text-center">
      <h2 className="font-semibold text-3xl">Get started with Kibo UI</h2>
      <p className="text-balance text-lg text-muted-foreground">
        Install your first component in seconds with the Kibo UI or shadcn CLI.
      </p>
      <div className="w-full text-left">
        <pre className='mx-auto w-fit rounded-full bg-primary px-6 py-3 text-primary-foreground text-xl'>
          <code>
            npx kibo-ui add{' '}
            <TextLoop>
              {components.map((component) => (
                <span key={component}>{component}</span>
              ))}
            </TextLoop>
          </code>
        </pre>
      </div>
    </div>
  </div>
);
