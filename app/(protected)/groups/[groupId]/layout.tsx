import { GroupsSidebar } from "@/components/groups/groups-sidebar";

export default function GroupChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background max-md:mt-[64px] max-md:h-[calc(100vh-64px)]">
            {/* Left Sidebar - Persistent, won't re-render when groupId changes */}
            <GroupsSidebar />

            {/* Right Side - Only this part refreshes when switching groups */}
            {children}
        </div>
    );
}
