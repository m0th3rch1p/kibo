import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@repo/shadcn-ui/components/ui/navigation-menu";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Link from "next/link";

type LinksProps = {
  className?: string;
  links: {
    label: string;
    href: string;
  }[];
};

export const Links = ({ className, links }: LinksProps) => (
  <NavigationMenu className={className}>
    <NavigationMenuList>
      {links.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "h-auto px-3 py-1.5")}
          >
            <Link href={link.href}>{link.label}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
