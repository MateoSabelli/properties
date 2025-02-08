import { SidebarDemo } from "@/components/SidebarDashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-black">
      <SidebarDemo user={{ ...user, email: user.email ?? "" }} />
    </div>
  );
}
