/**
 * Internal dependencies.
 */
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatThread } from "@/components/ChatThread";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Page = () => (
  // The shell owns the viewport height so only the conversation scrolls.
  <SidebarProvider className="h-svh overflow-hidden">
    <AppSidebar />

    <SidebarInset className="min-h-0 overflow-hidden">
      <AppHeader />
      <ChatThread />
      <ChatComposer />
    </SidebarInset>
  </SidebarProvider>
);

export default Page;
