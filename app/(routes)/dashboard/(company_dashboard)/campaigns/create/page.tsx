'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { useGetAdminCampaignById } from "@/lib/hooks/admin-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import CreateCampaignForm from "@/components/forms/CreateCampaignForm";

export default function CampaignPage(){

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="max-w-[60%] w-full bg-white shadow-md rounded-lg p-8">
                <Heading title="Manage Campaign" description="Create or update your campaign" />
{/* 
                {isPending ? (
                    <div>
                        <Skeleton className="w-48 h-8 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-16 mb-4" />
                        <Skeleton className="w-full h-10 mb-4" />
                    </div>
                ) : (
                )} */}
                <CreateCampaignForm />
            </div>
        </div>
    );
};

