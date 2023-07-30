import { useSession } from "next-auth/react";
import { Notes, Landing } from "~/components";

export default function Home() {
  const { data: sessionData } = useSession();
  return sessionData ? <Notes /> : <Landing />;
}
