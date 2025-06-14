import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar/>
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">{children}</main>
    </div>
  )
}