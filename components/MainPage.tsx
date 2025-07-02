import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

interface Post {
  id: string;
  message: string;
  timestamp: string;
  image?: string;
  name?: string;
}

interface SidebarData {
  name: string;
  subtitle: string;
  photo: string;
  networks: string[];
  city: string;
}

interface MainPageProps {
  sidebar: SidebarData;
  posts: Post[];
  message: string;
  image: File | null;
  imagePreview: string | null;
  error: string;
  maxChars: number;
  charsLeft: number;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShare: (e: React.FormEvent) => void;
  handleRemoveImage: () => void;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  sharing: boolean;
  hasNewPosts: boolean;
  isScrolledUp: boolean;
  onScrollToTop: () => void;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function MainPage({
  sidebar,
  posts,
  message,
  image,
  imagePreview,
  error,
  maxChars,
  charsLeft,
  handleImageChange,
  handleShare,
  handleRemoveImage,
  handleMessageChange,
  loading,
  sharing,
  hasNewPosts,
  isScrolledUp,
  onScrollToTop,
}: MainPageProps) {
  // Track loading state for each image by post id
  const [imageLoading, setImageLoading] = useState<{ [id: string]: boolean }>({});

  return (
    <main className="flex-1 w-full">
      {/* New Posts Indicator */}
      {hasNewPosts && isScrolledUp && (
        <div className="sticky top-4 z-10 mb-4">
          <button
            onClick={onScrollToTop}
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            aria-label="View new posts"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            New posts available - Click to view
          </button>
        </div>
      )}
      
      {/* Post Input */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
          <Label htmlFor="message">What's on your mind?</Label>
          <Textarea
            id="message"
            placeholder="Write something..."
            value={message}
            onChange={handleMessageChange}
            maxLength={maxChars}
            className="resize-none min-h-[80px] max-h-60 w-full break-all overflow-x-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Post message"
            rows={1}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          <span className={`text-xs font-medium ${charsLeft < 0 ? 'text-red-500' : charsLeft < 20 ? 'text-yellow-500' : 'text-muted-foreground'}`}>{charsLeft} characters remaining</span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
              {!imagePreview ? (
                <>
                  <label className="block border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors w-full focus-visible:ring-2 focus-visible:ring-primary" aria-label="Add photo">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      aria-label="Upload image"
                    />
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 3.13a4 4 0 010 7.75M12 7v6m0 0l-3-3m3 3l3-3" /></svg>
                    <span className="font-semibold text-gray-600 text-center">Click to add photo <span className="font-normal">(optional)</span></span>
                    <span className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</span>
                  </label>
                </>
              ) : (
                <div className="relative mt-4 w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={800}
                    height={400}
                    className="rounded border object-cover w-full h-auto max-h-80"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-100 dark:hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Remove image"
                  >
                    <span className="text-lg text-gray-500 dark:text-gray-300">&times;</span>
                  </button>
                </div>
              )}
          </div>
          <Button
            type="submit"
            className="bg-[#4285f4] text-white font-bold px-6 disabled:opacity-50 mt-2 sm:mt-0 cursor-pointer"
            disabled={!message.trim() || sharing}
            onClick={handleShare}
          >
            {sharing ? "Sharing..." : "Share"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardContent>
      </Card>
      {/* Feed */}
      <div className="flex flex-col gap-2 w-full">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <Card key={i} className="w-full p-0">
                <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full rounded mb-2" />
                  <Skeleton className="h-48 w-full rounded" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          posts.map(post => (
            <Card
              key={post.id}
              className="w-full p-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-card/90 border border-border rounded-2xl mb-4 group"
            >
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={sidebar.photo} alt="User photo" />
                    <AvatarFallback>{post.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-primary text-lg leading-tight">{post.name || 'Anonymous'}</span>
                    <span className="text-xs text-muted-foreground leading-none">{timeAgo(post.timestamp)}</span>
                  </div>
                </div>
                <div className="text-foreground text-base leading-relaxed whitespace-pre-line break-all mb-2 font-normal">
                  {post.message}
                </div>
                {post.image && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border bg-muted mt-2">
                    <Image
                      src={post.image}
                      alt="Post image"
                      width={800}
                      height={400}
                      className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                      style={{ aspectRatio: '16/9' }}
                      loading="lazy"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
} 