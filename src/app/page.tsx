"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useInfinitePosts } from "@/hooks/use-posts";
import { Bookmark, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState<boolean | undefined>();
  const [tagsLimit, setTagsLimit] = useState(10);

  // Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfinitePosts({
      limit: 6,
      search: search || undefined,
      tags: selectedTags.join(",") || undefined,
      isFeatured: featured,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  // Flatten posts for display
  const allPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const allTags = useMemo(() => {
    if (!allPosts.length) return [];
    const tags = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [allPosts]);

  // Intersection Observer for infinite scroll load trigger
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px", // Pre-load before reaching bottom
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    // React Query handles refetching automatically when params change
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed Content - Spans 8 cols */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant="ghost"
              className={`cursor-pointer rounded-none border-b-2 pb-2 px-1 hover:bg-transparent ${
                featured === undefined
                  ? "border-foreground font-semibold"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => setFeatured(undefined)}
            >
              For you
            </Button>
            <Button
              variant="ghost"
              className={`cursor-pointer rounded-none border-b-2 pb-2 px-1 hover:bg-transparent ${
                featured === true
                  ? "border-foreground font-semibold"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => setFeatured(true)}
            >
              Featured
            </Button>
          </div>

          {isPending ? (
            <div className="space-y-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 flex-col">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : allPosts.length > 0 ? (
            <div className="space-y-10">
              {allPosts.map((post, idx) => (
                <div
                  key={`post-${post.id}-idx-${idx}`}
                  className="group cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    {/* Author Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs overflow-hidden">
                        {post.author.image ? (
                          <img src={post.author.image} alt={"Author Image"} />
                        ) : (
                          <span>{post.author.name?.[0] || "A"}</span>
                        )}
                      </div>
                      <span className="text-foreground tracking-tight font-medium">
                        {post.author.name || "Anonymous"}
                      </span>
                      {post.isFeatured && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] font-normal"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>

                    <Link href={`/posts/${post.id}`} className="block">
                      <div className="flex justify-between gap-8">
                        <div className="space-y-2 max-w-2xl">
                          <h2 className="text-xl md:text-2xl font-bold leading-tight font-serif group-hover:underline decoration-black underline-offset-4 decoration-2">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-3 md:line-clamp-2 md:text-base text-sm leading-relaxed font-serif">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Meta Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                        <span>·</span>
                        <span>
                          {Math.max(1, Math.ceil(post.content.length / 500))}{" "}
                          min read
                        </span>
                        <span>·</span>
                        {post.tags.length > 0
                          ? post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="hidden md:block bg-secondary px-2 py-0.5 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))
                          : null}
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-8" />
                </div>
              ))}

              {/* Sentinel for Infinite Scroll */}
              <div ref={ref} className="py-8 text-center">
                {isFetchingNextPage ? (
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                    {/* Optional Spinner */}
                  </div>
                ) : hasNextPage ? (
                  <span className="text-sm text-muted-foreground">
                    Scroll to load more
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    You're all caught up!
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium">No posts found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Spans 4 cols, Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-4 pl-8 border-l min-h-screen">
          <div className="sticky top-24 space-y-10">
            {/* Search */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Search</h4>
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Recommended Topics */}
            {isPending ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Recommended topics</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            ) : (
              allTags.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Recommended topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, tagsLimit).map((tag) => (
                      <Button
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "secondary"
                        }
                        size="sm"
                        className="rounded-full font-normal text-xs h-8"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    onClick={() =>
                      setTagsLimit(
                        tagsLimit < allTags.length ? allTags.length : 10
                      )
                    }
                    className="text-green-600 p-0 h-auto text-sm mt-2"
                  >
                    See {tagsLimit < allTags.length ? "all" : "less"} topics
                  </Button>
                </div>
              )
            )}

            {/* Reading List Dummy */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Reading list</h4>
              <p className="text-xs text-muted-foreground">
                Click the <Bookmark className="w-3 h-3 inline mx-1" /> on any
                story to easily add it to your reading list or a custom list
                that you can share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
