import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  // The login page has its own bare layout — it renders inside this layout
  // too (same /admin route tree), so skip the chrome when there's no session.
  if (!session) {
    return children;
  }

  return <AdminShell userEmail={session.user?.email}>{children}</AdminShell>;
}
