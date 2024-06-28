import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import UserNav from "./user-nav";
import Link from "next/link";
import Image from "next/image";

export default function GifterHeader() {
    return (
        <div className="fixed left-0 right-0 top-0 z-20 border bg-background/95 backdrop-blur">
            <nav className="container w-full flex h-14 items-center justify-between">
                <div className="hidden lg:block">
                    <Link
                        href={"/dashboard/gifter"}
                    >
                        <Image alt="logo" src={"/images/logo.webp"} width={30} height={30} />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <UserNav />
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
}