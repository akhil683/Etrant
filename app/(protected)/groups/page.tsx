"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Calendar, BookOpen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { useGroups, useJoinGroup } from "@/hooks/use-groups";
import { cn } from "@/lib/utils";

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");

  const { data: groups = [], isLoading } = useGroups(searchQuery, examTypeFilter);
  const joinGroupMutation = useJoinGroup();

  const handleJoinGroup = async (groupId: string) => {
    try {
      await joinGroupMutation.mutateAsync(groupId);
      window.location.href = `/groups/${groupId}`;
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const examTypes = ["JEE", "NEET", "UPSC", "CAT", "GATE", "SSC", "Banking"];

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Study together</p>
          <h1 className="page-title">Exam groups</h1>
          <p className="page-description">
            Join a room, share resources and keep each other accountable.
          </p>
        </div>
        <Link href="/groups/create">
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Create group
          </Button>
        </Link>
      </div>

      <div className="mb-7 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setExamTypeFilter("")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              examTypeFilter === ""
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            All
          </button>
          {examTypes.map((type) => (
            <button
              key={type}
              onClick={() => setExamTypeFilter(type)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                examTypeFilter === type
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <CircleLoader />
      ) : groups.length === 0 ? (
        <div className="surface py-16 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="mb-1 text-xl font-bold">No groups found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Try a different search, or start a group for your exam.
          </p>
          <Link href="/groups/create">
            <Button>Create a group</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id} className="surface surface-hover flex flex-col p-5">
              <div className="border-b border-border pb-4">
                <h2 className="line-clamp-1 text-lg font-bold text-foreground">
                  {group.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {group.description || "No description"}
                </p>
              </div>

              <div className="mt-4 flex-1 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">
                    <BookOpen className="h-3 w-3" />
                    {group.examType}
                  </Badge>
                  {group.examYear && (
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3" />
                      {group.examYear}
                    </Badge>
                  )}
                  {group.subject && (
                    <Badge variant="secondary">{group.subject}</Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  {group.memberCount || 0} members
                  {group.maxMembers && ` / ${group.maxMembers}`}
                </div>

                {group.tags && group.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {group.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {group.isMember ? (
                <Link href={`/groups/${group.id}`} className="mt-4 block w-full">
                  <Button className="w-full" variant="outline">
                    Open chat
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => handleJoinGroup(group.id)}
                  className="mt-4 w-full"
                >
                  Join group
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
