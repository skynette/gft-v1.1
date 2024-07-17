import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { LinkedinIcon, XIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";

export default function CompanyProfile() {
    return (
        <div className="bg-background text-foreground dark:bg-muted dark:text-muted-foreground">
            <header className="w-full bg-primary text-primary-foreground py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6 lg:space-y-8">
                        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
                            <img src="/placeholder.svg" width={64} height={64} alt="Company Logo" className="rounded-full" />
                            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Company Name Inc.</h1>
                        </div>
                        <img
                            src="/placeholder.svg"
                            width={1200}
                            height={400}
                            alt="Header Image"
                            className="w-full rounded-lg object-cover"
                        />
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
                                <a href="#" className="text-primary hover:underline">
                                    Company Name.com
                                </a>
                            </div>
                            <div>
                                <span className="font-medium">Box Limit:</span> 100
                            </div>
                            <div>
                                <span className="font-medium">Created At:</span> 2023-04-01
                            </div>
                            <div>
                                <span className="font-medium">Updated At:</span> 2023-06-15
                            </div>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-2">Social Media</h2>
                        <div className="space-y-2">
                            <div>
                                <a href="#" className="flex items-center space-x-2 text-primary hover:underline">
                                    <XIcon className="w-5 h-5" />
                                    <span>Twitter</span>
                                </a>
                            </div>
                            <div>
                                <a href="#" className="flex items-center space-x-2 text-primary hover:underline">
                                    <LinkedinIcon className="w-5 h-5" />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                            <div>
                                <a href="#" className="flex items-center space-x-2 text-primary hover:underline">
                                    <FaFacebook className="w-5 h-5" />
                                    <span>Facebook</span>
                                </a>
                            </div>
                            <div>
                                <a href="#" className="flex items-center space-x-2 text-primary hover:underline">
                                    <InstagramLogoIcon className="w-5 h-5" />
                                    <span>Instagram</span>
                                </a>
                            </div>
                            <div>
                                <a href="#" className="flex items-center space-x-2 text-primary hover:underline">
                                    <YoutubeIcon className="w-5 h-5" />
                                    <span>YouTube</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-2">Color Scheme</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Light Mode:</span>{" "}
                                <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground">#0077b6</span>
                            </div>
                            <div>
                                <span className="font-medium">Dark Mode:</span>{" "}
                                <span className="px-2 py-1 rounded-md bg-primary-foreground text-primary">#00a8ff</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-muted text-muted-foreground py-6 md:py-8 lg:py-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
                    <p className="text-sm">&copy; 2024 Company Name Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}