import { requireAdmin } from "@/lib/admin/admin-auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <>
      <div className="border-b border-navy-900/10 bg-navy-900 px-4 py-2.5 text-center text-sm text-cream-100">
        Admin olarak oturum açıldı:{" "}
        <span className="font-semibold text-white">{admin.email}</span>
      </div>
      {children}
    </>
  );
}
