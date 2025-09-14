import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { ConditionalContainer } from "../../components/conditional-container";
import { Navbar } from "../../components/navbar";
import { source } from "../../lib/source";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <ConditionalContainer>
      <DocsLayout
        nav={{
          component: <Navbar />,
        }}
        sidebar={{
          collapsible: false,
        }}
        tree={source.pageTree}
      >
        {children}
      </DocsLayout>
    </ConditionalContainer>
  );
}
