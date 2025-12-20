// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Card from "../components/Card";
import API, { getSocketBaseUrl } from "../utils/api";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import { io } from "socket.io-client";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);

  useEffect(() => {
    let mounted = true;
    let socket;

    (async () => {
      try {
        const res = await API.get("/posts");
        if (mounted) setPosts(res.data || []);
      } catch (err) {
        console.error("Failed to load posts", err);
      }

      // 🔌 WebSocket connection
      try {
        const socketBaseUrl = getSocketBaseUrl(); // e.g. http://localhost:4000
        socket = io(socketBaseUrl, {
          withCredentials: false,
        });

        socket.on("connect", () => {
          // console.log("Connected to WebSocket:", socket.id);
        });

        // New post event
        socket.on("post:created", (newPost) => {
          setPosts((prev) => {
            if (prev.some((p) => p._id === newPost._id)) return prev;
            return [newPost, ...prev];
          });
        });

        // Like/unlike event
        socket.on("post:liked", (updatedPost) => {
          setPosts((prev) =>
            prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
          );
        });

        socket.on("disconnect", () => {
          // console.log("Disconnected from WebSocket");
        });
      } catch (e) {
        // fail silently if socket setup fails
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  // Like / Unlike a post (for current user)
  const handleLike = async (postId) => {
    if (!user) return; // optionally redirect to login
    setLikeLoading(postId);

    try {
      const res = await API.post(`/posts/${postId}/like`);
      const updatedPost = res.data.post;

      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    } catch (err) {
      console.error("Failed to like/unlike post", err);
    } finally {
      setLikeLoading(null);
    }
  };

  const isAuthor = (post) => {
    if (!user) return false;
    if (post.author && post.author._id) {
      return String(post.author._id) === String(user.id);
    }
    return String(post.author) === String(user.id);
  };

  const hasLiked = (post) => {
    if (!user || !post.likes) return false;
    return post.likes.some((id) => String(id) === String(user.id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const uploadsBase = `${getSocketBaseUrl()}/uploads`;

  return (
    <Container className="py-6 sm:py-8">
      {/* Floating create button (mobile) */}
      {user && (
        <Link to="/create-post">
          <Button
            className="fixed bottom-6 right-6 z-30 rounded-full bg-accent px-4 py-3 text-xl text-white shadow-lg shadow-slate-900/60 hover:bg-accent/90 sm:hidden"
            variant="primary"
          >
            +
          </Button>
        </Link>
      )}

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        {/* Left column: feed */}
        <div className="flex flex-col gap-4">
          {/* Hero / CTA */}
          <Card className="border-slate-700/40 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/60 text-slate-50 shadow-lg shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Campus feed
                </p>
                <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  See what&apos;s happening around your college
                </h1>
                <p className="mt-1 max-w-md text-sm text-slate-300">
                  Share events, projects, opportunities and random thoughts with
                  your campus network.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                {user ? (
                  <>
                    <Link to="/create-post">
                      <Button className="w-full sm:w-auto">
                        Create a post
                      </Button>
                    </Link>
                    <p className="max-w-[260px] text-right text-xs text-slate-400">
                      Pro tip: posts with images and clear titles get more
                      engagement.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 text-right">
                    <p className="text-xs text-slate-300">
                      Log in to start posting &amp; liking.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/login"
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="text-xs font-medium text-slate-200/90 hover:underline"
                      >
                        Create account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Posts list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="animate-pulse border-slate-800/80 bg-slate-900/70"
                >
                  <div className="mb-3 h-4 w-40 rounded-full bg-slate-700/70" />
                  <div className="mb-2 h-3 w-3/4 rounded-full bg-slate-700/60" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-700/60" />
                  <div className="mt-4 h-6 w-28 rounded-full bg-slate-700/70" />
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="border-dashed border-slate-700/60 bg-slate-900/50 text-slate-300">
              <p className="text-sm font-medium">
                No posts yet. Be the first to share something!
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Share an upcoming event, a club announcement, internship
                opening, or anything useful for your peers.
              </p>
              {user && (
                <Link to="/create-post">
                  <Button size="sm" className="mt-3">
                    Create your first post
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => {
                const liked = hasLiked(p);
                const likesCount = p.likes ? p.likes.length : 0;

                return (
                  <Card
                    key={p._id}
                    className="border-slate-700/70 bg-slate-900/80 text-slate-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold uppercase text-slate-200">
                            {p.author?.name?.[0] || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              {p.author?.name || "Unknown user"}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.author?.college || "Campus"} •{" "}
                              {formatDate(p.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-sm leading-relaxed text-slate-100 whitespace-pre-wrap">
                          {p.content}
                        </div>

                        {p.imageUrl && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900">
                            <img
                              src={`${uploadsBase}/${p.imageUrl}`}
                              alt="post"
                              className="max-h-96 w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      {/* Edit / Delete for author */}
                      {isAuthor(p) && (
                        <div className="flex flex-col items-end gap-1 text-xs">
                          <Link
                            to={`/edit-post/${p._id}`}
                            className="rounded-full border border-slate-700/80 px-3 py-1 font-medium text-slate-200 hover:bg-slate-800"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="rounded-full border border-slate-700/80 px-3 py-1 text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Like + info row */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleLike(p._id)}
                        disabled={!user || likeLoading === p._id}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                          liked
                            ? "border-red-500/80 bg-red-500/15 text-red-200"
                            : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent-200"
                        } ${
                          likeLoading === p._id ? "cursor-wait opacity-60" : ""
                        }`}
                      >
                        <span>{liked ? "❤️" : "🤍"}</span>
                        <span>
                          {likesCount === 0
                            ? "Like"
                            : `${likesCount} like${
                                likesCount !== 1 ? "s" : ""
                              }`}
                        </span>
                      </button>

                      {isAuthor(p) && (
                        <p className="text-[11px] text-slate-500">
                          Only you can edit or delete this post
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: quick actions */}
        <div className="space-y-3">
          <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
            <h3 className="text-sm font-semibold">Posting guidelines</h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              <li>• Keep it relevant to your college / campus.</li>
              <li>• Be respectful and avoid spam or promotions.</li>
              <li>• Add clear details for events (date, time, venue).</li>
              <li>• Use images for posters, achievements, and projects.</li>
            </ul>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
            <h3 className="text-sm font-semibold">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-2 text-xs">
              <Link
                to="/profile"
                className="text-accent hover:underline"
              >
                Go to your profile
              </Link>
              <Link
                to="/register"
                className="text-slate-300 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
