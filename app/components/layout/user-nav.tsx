import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Session } from '../../../types';
import { SignOutButton } from '../sign-out-button';

interface UserNavProps {
    currUser: Session['user'] | null | undefined;
}

function UserNav({ currUser }: UserNavProps) {
    if (currUser) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={currUser.image ?? ''}
                                alt={currUser.name ?? ''}
                            />
                            <AvatarFallback>{currUser.email?.[0]}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {currUser.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {currUser.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        User type: {currUser.role}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            {currUser.role === "company" && <Link href={'/dashboard/settings'}>Company Settings</Link>}
                            {currUser.role === "user" && <Link href={'/dashboard/gifter/settings'}>Settings</Link>}
                            {currUser.role === "super_admin" && <Link href={'/admin/settings'}>Settings</Link>}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <SignOutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
    return null;
}

export default UserNav;
