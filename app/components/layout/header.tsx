import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import UserNav from "./user-nav";
import Link from "next/link";
import Image from "next/image";
import { Session } from "../../../types";
import { AdminMobileSidebar } from "./admin-mobile-sidebar";

interface HeaderProps {
    currUser: Session['user'] | null;
}

export default function Header({ currUser }: HeaderProps) {
    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
            <nav className="flex h-14 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link href={"/dashboard"}>
                        <Image unoptimized alt="logo" src={"/images/logo.webp"} width={30} height={30} />
                    </Link>
                </div>

                <div className={cn("block lg:!hidden")}>
                    {currUser?.role == "company" && <MobileSidebar />}
                    {currUser?.role == "super_admin" && <AdminMobileSidebar />}
                </div>

                <div className="flex items-center gap-2">
                    <UserNav currUser={currUser} />
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
}
