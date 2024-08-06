import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import UserNav from "./user-nav";
import { Session } from "../../../types";
import Notifications from "./notifications";

interface GifterHeaderProps {
    currUser: Session['user'] | null;
}

export default function GifterHeader({ currUser }: GifterHeaderProps) {
    return (
        <div className="sticky left-0 right-0 top-0 z-20 border bg-background/95 backdrop-blur">
            <nav className="container w-full flex h-14 items-center justify-between">
                <div className="hidden lg:block">
                    <Link href={"/dashboard/gifter"}>
                        <Image unoptimized alt="logo" src={"/images/logo.webp"} width={30} height={30} />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Notifications />
                    <UserNav currUser={currUser} />
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
}