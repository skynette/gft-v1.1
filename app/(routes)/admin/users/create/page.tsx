'use client';

import { Heading } from "@/components/ui/heading";
import AdminCreateUserForm from "../components/create-user-form";
export default function CampaignPage(){

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="max-w-[60%] w-full bg-white shadow-md rounded-lg p-8">
                <Heading title="Manage User" description="Create or update your User" />
                <AdminCreateUserForm />
            </div>
        </div>
    );
};

