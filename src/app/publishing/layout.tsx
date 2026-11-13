import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth-session";
export default async function PublishingLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const session = verifySession(jar.get("nexus_session")?.value);
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/overview");
  return children;
}
