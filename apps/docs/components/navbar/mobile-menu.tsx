import { Button } from "@repo/shadcn-ui/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type MobileMenuProps = {
  className?: string;
  links: {
    label: string;
    href: string;
  }[];
};

export const MobileMenu = ({ links }: MobileMenuProps) => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button className="size-8" size="icon" variant="ghost">
        <MenuIcon size={16} />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="sr-only">
        <DrawerTitle>Mobile Menu</DrawerTitle>
      </DrawerHeader>
      <div className="mt-8 mb-24 flex flex-col space-y-4 px-6">
        {links.map((link) => (
          <DrawerClose asChild key={link.href}>
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          </DrawerClose>
        ))}
      </div>
    </DrawerContent>
  </Drawer>
);
