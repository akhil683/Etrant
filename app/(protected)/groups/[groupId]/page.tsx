"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Send,
  Users,
  Loader2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { format, isSameDay } from "date-fns";
import type { ExamGroup, GroupMember } from "@/types/groups";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CircleLoader from "@/components/loader/simple-loader-circle";

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<ExamGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage } = useGroupMessages({
    groupId,
    enabled: !!groupId,
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchMembers();
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        throw new Error("Group not found");
      }
      const data = await response.json();
      setGroup(data.group);
    } catch (error) {
      console.error("Error fetching group:", error);
      toast.error("Failed to load group");
      router.push("/groups");
    } finally {
      setIsLoadingGroup(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput.trim());
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center overflow-hidden bg-background">
        <Loader2 className="w-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">Group not found</h2>
        <Link href="/groups">
          <Button>Back to groups</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden bg-background">
      {/* Chat Area */}
      <div className="relative flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="z-10 flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link href="/groups" className="md:hidden">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Avatar className="h-10 w-10 cursor-pointer border border-border">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {getInitials(group.name)}
              </AvatarFallback>
            </Avatar>
            <div className="cursor-pointer">
              <h1 className="text-sm font-semibold text-foreground md:text-base">
                {group.name}
              </h1>
              <p className="max-w-[200px] truncate text-xs text-muted-foreground md:max-w-md">
                {members
                  .map((m) => m.user?.name)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(", ")}
                {members.length > 3 && `, +${members.length - 3} others`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Group members ({members.length})</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 h-[300px] pr-4">
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.user?.image || undefined} />
                          <AvatarFallback>
                            {getInitials(member.user?.name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {member.user?.name || "Unknown"}
                          </p>
                          <div className="flex items-center gap-2">
                            {member.role !== "member" && (
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                            )}
                            {member.isOnline && (
                              <span className="flex items-center gap-1 text-xs text-success">
                                <span className="h-2 w-2 rounded-full bg-success"></span>
                                Online
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="z-10 flex-1 bg-secondary/40 p-2 md:p-4">
          <div className="mx-auto max-w-5xl space-y-1 pb-4">
            {isLoading && messages.length === 0 ? (
              <CircleLoader />
            ) : messages.length === 0 ? (
              <div className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-card p-8 text-center">
                <Info className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-medium text-foreground">No messages yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send a message to start the conversation.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isMe = message.userId === session?.user?.id;
                const isSameUser =
                  index > 0 && messages[index - 1].userId === message.userId;
                const showDateSeparator =
                  index === 0 ||
                  !isSameDay(
                    new Date(message.createdAt),
                    new Date(messages[index - 1].createdAt),
                  );

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="my-4 flex justify-center">
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), "MMMM d, yyyy")}
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        "mb-1 flex w-full",
                        isMe ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "flex max-w-[85%] md:max-w-[65%]",
                          isMe ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        {!isMe && (
                          <div className="mr-2 flex w-8 flex-shrink-0 flex-col justify-end">
                            {!isSameUser ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={message.user?.image || undefined}
                                />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(message.user?.name || null)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8" />
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "relative rounded-lg px-3 py-2 text-sm shadow-sm",
                            isMe
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-card text-foreground",
                            !isMe && !isSameUser && "mt-1",
                          )}
                        >
                          {!isMe && !isSameUser && (
                            <p className="mb-1 text-xs font-semibold text-primary">
                              {message.user?.name || "Unknown"}
                            </p>
                          )}

                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>

                          <div
                            className={cn(
                              "mt-1 flex items-center justify-end gap-1 text-[10px] opacity-60",
                            )}
                          >
                            {format(new Date(message.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="z-10 border-t border-border bg-card p-2 md:p-3">
          <form
            onSubmit={handleSendMessage}
            className="mx-auto flex max-w-5xl items-end gap-2"
          >
            <div className="flex flex-1 items-center rounded-xl border border-border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="max-h-32 border-0 bg-transparent p-0 text-base focus-visible:ring-0"
                maxLength={5000}
              />
            </div>
            <Button
              type="submit"
              disabled={!messageInput.trim()}
              className="h-10 w-10 flex-shrink-0 rounded-full p-0"
            >
              <Send className="ml-0.5 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
