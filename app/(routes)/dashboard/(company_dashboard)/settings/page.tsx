'use client';

import Link from "next/link";
import useGetCompanyProfile from "@/lib/hooks/useGetCompanyProfile";
import SettingsForm from "@/components/forms/SettingsForm";

export default function Page() {
    const { data, isPending } = useGetCompanyProfile();

    return (
        <div className="flex flex-col">
            <main className="flex bg-muted/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="max-w-6xl w-full grid gap-2">
                    <h1 className="font-semibold text-3xl">Company Settings</h1>
                    <p className="text-muted-foreground">Manage your company settings and preferences.</p>
                </div>
                <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full">
                    <nav className="text-sm text-muted-foreground grid gap-4">
                        <Link href="#" className="text-primary" prefetch={false}>
                            Profile
                        </Link>
                        <Link href="#" className="font-semibold" prefetch={false}>
                            Account
                        </Link>
                        <Link href="#" className="font-semibold" prefetch={false}>
                            Appearance
                        </Link>
                        <Link href="#" className="font-semibold" prefetch={false}>
                            Notifications
                        </Link>
                        <Link href="#" className="font-semibold" prefetch={false}>
                            Display
                        </Link>
                    </nav>
                    <SettingsForm />
                </div>
            </main>
        </div>
    );
}
