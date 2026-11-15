"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { ExamGroup } from "@/types/groups";
import { useParams } from "next/navigation";

async function fetchMyGroups(searchQuery?: string): Promise<ExamGroup[]> {
  const params = new URLSearchParams();
  params.append("myGroups", "true");
  if (searchQuery) params.append("query", searchQuery);

  const response = await fetch(`/api/groups?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }
  const data = await response.json();
  return data.groups || [];
}

export function GroupsSidebar() {
  const params = useParams();
  const currentGroupId = params.groupId as string;
  const [searchQuery, setSearchQuery] = useState("");

  // Use TanStack Query for caching the groups list
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["myGroups", searchQuery],
    queryFn: () => fetchMyGroups(searchQuery),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="hidden w-80 flex-col border-r border-border bg-card md:flex md:w-96">
      {/* Sidebar Header */}
      <div className="border-b border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Chats</h2>
          <div className="flex gap-2">
            <Link href="/groups/create">
              <Button variant="ghost" size="icon" title="Create group">
                <Users className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="bg-background pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Groups List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : groups.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No groups found
            </div>
          ) : (
            groups.map((g) => (
              <Link
                key={g.id}
                href={`/groups/${g.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border-b border-border/60 p-4 transition-colors hover:bg-accent/60",
                  g.id === currentGroupId && "bg-accent",
                )}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {getInitials(g.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {g.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground">
                      {g.lastActivityAt &&
                        formatDistanceToNow(new Date(g.lastActivityAt), {
                          addSuffix: false,
                        })}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {g.description || "No description"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
