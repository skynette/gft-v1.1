"use client";

import useGetCompanyProfile from "@/lib/hooks/useGetCompanyProfile";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Twitter, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyProfile() {
    const { data, isPending } = useGetCompanyProfile();

    const renderColorScheme = (colorScheme: any, mode: string) => {
        if (colorScheme) return Object.keys(colorScheme).map((colorKey) => (
            <div key={colorKey}>
                <span className="font-medium capitalize">{colorKey.replace(/_/g, " ")}:</span>{" "}
                {isPending ? (
                    <Skeleton className="h-5 w-24" />
                ) : (
                    <span className={`px-2 py-1 rounded-md`} style={{ backgroundColor: `#${colorScheme[colorKey]}` }}>
                        #{colorScheme[colorKey]}
                    </span>
                )}
            </div>
        ));
        else return <></>
    };

    return (
        <div className="bg-background text-foreground dark:bg-muted dark:text-muted-foreground">
            <header className="w-full bg-primary text-primary-foreground py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6 lg:space-y-8">
                        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
                            {isPending ? (
                                <Skeleton className="w-16 h-16 rounded-full" />
                            ) : (
                                <img src={data?.logo} width={64} height={64} alt="Company Logo" className="rounded-full" />
                            )}
                            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                                {isPending ? <Skeleton className="h-8 w-48" /> : data?.name}
                            </h1>
                        </div>
                        {isPending ? (
                            <Skeleton className="w-full h-64 rounded-lg" />
                        ) : (
                            <img
                                src={data?.header_image}
                                width={1200}
                                height={400}
                                alt="Header Image"
                                className="w-full rounded-lg object-cover"
                            />
                        )}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">Company Info</h2>
                            <Link href="/dashboard/settings" className="text-primary hover:underline" prefetch={false}>
                                Edit
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Website:</span>{" "}
                                {isPending ? (
                                    <Skeleton className="h-5 w-full" />
                                ) : (
                                    <a href={data?.company_url} className="text-primary hover:underline">
                                        {data?.company_url}
                                    </a>
                                )}
                            </div>
                            <div>
                                <span className="font-medium">Box Limit:</span> {isPending ? <Skeleton className="h-5 w-full" /> : data?.box_limit}
                            </div>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-2">Social Media</h2>
                        <div className="space-y-2">
                            <div>
                                {isPending ? (
                                    <Skeleton className="h-5 w-full" />
                                ) : (
                                    <a href={data?.socials.twitter_url} className="flex items-center space-x-2 text-primary hover:underline">
                                        <Twitter className="w-5 h-5" />
                                        <span>{data?.socials.twitter_url}</span>
                                    </a>
                                )}
                            </div>
                            <div>
                                {isPending ? (
                                    <Skeleton className="h-5 w-full" />
                                ) : (
                                    <a href={data?.socials.facebook_url} className="flex items-center space-x-2 text-primary hover:underline">
                                        <FaFacebook className="w-5 h-5" />
                                        <span>{data?.socials.facebook_url}</span>
                                    </a>
                                )}
                            </div>
                            <div>
                                {isPending ? (
                                    <Skeleton className="h-5 w-full" />
                                ) : (
                                    <a href={data?.socials.instagram_url} className="flex items-center space-x-2 text-primary hover:underline">
                                        <InstagramLogoIcon className="w-5 h-5" />
                                        <span>{data?.socials.instagram_url}</span>
                                    </a>
                                )}
                            </div>
                            <div>
                                {isPending ? (
                                    <Skeleton className="h-5 w-full" />
                                ) : (
                                    <a href={data?.socials.youtube_url} className="flex items-center space-x-2 text-primary hover:underline">
                                        <YoutubeIcon className="w-5 h-5" />
                                        <span>{data?.socials.youtube_url}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-2">Color Scheme</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Light Mode</h3>
                                {renderColorScheme(data?.color_schema.light, 'light')}
                            </div>
                            <div>
                                <h3 className="font-semibold">Dark Mode</h3>
                                {renderColorScheme(data?.color_schema.dark, 'dark')}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-muted text-muted-foreground py-6 md:py-8 lg:py-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
                    <p className="text-sm">&copy; 2024 {isPending ? <Skeleton className="h-5 w-32 inline-block" /> : data?.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
