import { useSession } from "next-auth/react";

function Dashboard() {
  const { data: session } = useSession();

  if (session?.accessToken) {
    return <p>Welcome, {session.user?.email}. Your token is {session.accessToken}</p>;
  }

  return <p>You are not logged in.</p>;
}