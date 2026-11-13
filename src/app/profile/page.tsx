import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth-session";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = verifySession(cookieStore.get("nexus_session")?.value);
  if (!user) redirect("/login");
  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  return <main className="mx-auto max-w-3xl space-y-5">
    <header><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Account</p><h1 className="mt-2 text-3xl font-semibold text-white">My profile</h1><p className="mt-2 text-sm text-slate-400">Your signed-in NEXUS account information and access level.</p></header>
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-5"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-xl font-semibold text-cyan-200">{initials}</div><div><h2 className="text-xl font-semibold text-white">{user.name}</h2><p className="text-sm text-slate-400">{user.email}</p></div></div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-wider text-slate-500">Access role</dt><dd className="mt-1 font-medium capitalize text-slate-100">{user.role}</dd></div><div><dt className="text-xs uppercase tracking-wider text-slate-500">Organization</dt><dd className="mt-1 font-medium text-slate-100">{user.organization || "NEXUS Workspace"}</dd></div>{user.age !== undefined && <div><dt className="text-xs uppercase tracking-wider text-slate-500">Age</dt><dd className="mt-1 font-medium text-slate-100">{user.age}</dd></div>}<div><dt className="text-xs uppercase tracking-wider text-slate-500">Account ID</dt><dd className="mt-1 break-all font-mono text-xs text-slate-300">{user.id}</dd></div></dl>
    </section>
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><h2 className="font-semibold text-white">Account security</h2><p className="mt-2 text-sm leading-6 text-slate-400">Your session uses a signed, HTTP-only cookie. Use Sign out in the top navigation when you finish. Profile editing and password changes are not yet available.</p></section>
  </main>;
}
