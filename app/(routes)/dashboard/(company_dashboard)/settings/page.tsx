import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import useGetCompanyProfile from "@/lib/hooks/useGetCompanyProfile";

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
                    <div className="grid gap-6">

                        {/* General Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="Acme Inc" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="logo">Logo</Label>
                                    <img src="/placeholder.svg" width="100" height="100" alt="Company Logo" className="rounded-md" />
                                    <Button variant="outline" className="flex items-center" size="icon">
                                        <PlusIcon className="h-4 w-4" />
                                        Upload Logo
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="header-image">Header Image</Label>
                                    <img src="/placeholder.svg" width="400" height="150" alt="Company Header" className="rounded-md" />
                                    <Button variant="outline" className="flex items-center" size="icon">
                                        <PlusIcon className="h-4 w-4" />
                                        Upload Header
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company-url">Company URL</Label>
                                    <Input id="company-url" defaultValue="https://acme.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="box-limit">Box Limit</Label>
                                    <Input id="box-limit" type="number" defaultValue="100" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Socials Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Socials</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="twitter">Twitter</Label>
                                        <Input id="twitter" defaultValue="acmeinc" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input id="linkedin" defaultValue="acmeinc" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input id="facebook" defaultValue="acmeinc" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input id="instagram" defaultValue="acmeinc" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="snapchat">Snapchat</Label>
                                        <Input id="snapchat" defaultValue="acmeinc" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="youtube">YouTube</Label>
                                        <Input id="youtube" defaultValue="acmeinc" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Colors Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Color Schema</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="primary-color">Primary Color</Label>
                                        <Input
                                            id="primary-color"
                                            type="color"
                                            defaultValue="#123456"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="secondary-color">Secondary Color</Label>
                                        <Input
                                            id="secondary-color"
                                            type="color"
                                            defaultValue="#789abc"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="background-color">Background Color</Label>
                                        <Input
                                            id="background-color"
                                            type="color"
                                            defaultValue="#ffffff"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="qr-code-text-color">QR Code Text Color</Label>
                                        <Input
                                            id="qr-code-text-color"
                                            type="color"
                                            defaultValue="#000000"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="background-border-color">Background Border Color</Label>
                                        <Input
                                            id="background-border-color"
                                            type="color"
                                            defaultValue="#cccccc"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="background-hover-color">Background Hover Color</Label>
                                        <Input
                                            id="background-hover-color"
                                            type="color"
                                            defaultValue="#f0f0f0"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="foreground-color">Foreground Color</Label>
                                        <Input
                                            id="foreground-color"
                                            type="color"
                                            defaultValue="#333333"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="header-color">Header Color</Label>
                                        <Input
                                            id="header-color"
                                            type="color"
                                            defaultValue="#555555"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="footer-color">Footer Color</Label>
                                        <Input
                                            id="footer-color"
                                            type="color"
                                            defaultValue="#777777"
                                            className="h-10 w-full rounded-md"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Button className="w-fit">Update Company Profile</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
