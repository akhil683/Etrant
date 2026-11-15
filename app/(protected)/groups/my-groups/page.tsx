"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Users, Calendar, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamGroup } from "@/types/groups";
import CircleLoader from "@/components/loader/simple-loader-circle";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<ExamGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyGroups();
  }, [searchQuery]);

  const fetchMyGroups = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("myGroups", "true");
      if (searchQuery) params.append("query", searchQuery);

      const response = await fetch(`/api/groups?${params.toString()}`);
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error("Error fetching my groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Your rooms</p>
          <h1 className="page-title">My study groups</h1>
          <p className="page-description">
            Groups you have joined and are participating in.
          </p>
        </div>
        <Link href="/groups">
          <Button variant="outline">Browse all groups</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <CircleLoader />
      ) : groups.length === 0 ? (
        <div className="surface py-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-bold">No groups joined yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Browse available groups and join a community.
          </p>
          <Link href="/groups">
            <Button>Browse groups</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="surface-hover">
              <CardHeader className="pb-4">
                <CardTitle className="line-clamp-1 text-lg">
                  {group.name}
                </CardTitle>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {group.description || "No description"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <BookOpen className="h-3 w-3" />
                      {group.examType}
                    </Badge>
                    {group.examYear && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3" />
                        {group.examYear}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {group.memberCount || 0} members
                  </div>

                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {group.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/groups/${group.id}`} className="block w-full">
                    <Button className="w-full gap-2" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                      Open chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
