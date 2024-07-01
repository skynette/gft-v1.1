import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { NextResponse } from "next/server"

async function handler(req: any, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        return NextResponse.json(session)
    } catch (error) {
        NextResponse.json({ message: "You must be logged in." }, { status: 401 })
    }
}

export { handler as GET}