"use server"

import { authOptions } from "@/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

export async function getSession() {
    const session = await getServerSession(authOptions)
    return session
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function getCompanyAPIKey(){
    const session = await getServerSession(authOptions)
    return session?.companyAPIKey
}