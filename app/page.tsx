"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import MainPage from "@/components/MainPage";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner"

// Define the Post type
interface Post {
  id: string;
  name?: string;
  message: string;
  timestamp: string;
  image?: string;
}

// Define the database response type
interface DatabasePost {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  image: string | null;
}

const sidebar = {
  name: "Greg Wientjes",
  subtitle: "wall",
  photo: "/profile-photo.jpg",
  networks: ["Harvard", "CAPM"],
  city: "San Francisco",
  info: "Full Stack Developer",
};

export default function Page() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const maxChars = 280;
  const charsLeft = maxChars - message.length;
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("id, name, message, created_at, image")
        .order("created_at", { ascending: false })
        .limit(50);
      setLoading(false);
      if (error) {
        setError("Failed to fetch posts");
      } else if (data) {
        setPosts(
          data.map((p: DatabasePost) => ({
            id: p.id,
            name: p.name || undefined,
            message: p.message,
            timestamp: p.created_at,
            image: p.image || undefined,
          }))
        );
        if (data.length > 0) {
          setLastPostId(data[0].id);
        }
      }
    };
    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const p = payload.new as DatabasePost;
        const newPost = {
          id: p.id,
          name: p.name || undefined,
          message: p.message,
          timestamp: p.created_at,
          image: p.image || undefined,
        };
        
        // Check if this is a new post (not the initial load)
        if (lastPostId && p.id !== lastPostId) {
          setHasNewPosts(true);
        }
        
        setPosts((prev) => [newPost, ...prev]);
        setLastPostId(p.id);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [lastPostId]);

  // Handle scroll events to track if user is scrolled up
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolledUp(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top and clear new posts indicator
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHasNewPosts(false);
  };

  async function handleShare(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }
    if (message.length > maxChars) {
      setError(`Message must be ${maxChars} characters or less.`);
      return;
    }

    setSharing(true);
    let imageBase64 = null;
    if (image) {
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    }

    // Insert post with base64 image
    const { error: insertError } = await supabase.from("posts").insert({
      name: sidebar.name,
      message,
      image: imageBase64,
    });
    if (insertError) {
      setError("Failed to share post");
    } else {
      setMessage("");
      setImage(null);
      setImagePreview(null);
      setError("");
    }
    setSharing(false);
    toast.success("Post has been created.")

  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  }

  function handleRemoveImage() {
    setImage(null);
    setImagePreview(null);
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-8 px-2">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`fixed md:relative top-0 left-0 h-full md:h-auto w-80 z-50 transform transition-transform duration-300 ease-in-out md:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0 bg-background' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-4 md:p-0">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <RightSidebar sidebar={sidebar} />
          </div>
        </aside>
        <MainPage
          sidebar={sidebar}
          posts={posts}
          message={message}
          image={image}
          imagePreview={imagePreview}
          error={error}
          maxChars={maxChars}
          charsLeft={charsLeft}
          handleImageChange={handleImageChange}
          handleShare={handleShare}
          handleRemoveImage={handleRemoveImage}
          handleMessageChange={handleMessageChange}
          loading={loading}
          sharing={sharing}
          hasNewPosts={hasNewPosts}
          isScrolledUp={isScrolledUp}
          onScrollToTop={scrollToTop}
        />
      </div>
    </div>
  );
}
