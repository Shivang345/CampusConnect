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

  useEffect(() => {
    let mounted = true;
    let socket;

    async function load() {
      try {
        const res = await API.get("/posts");
        if (mounted) setPosts(res.data);
      } catch (err) {
        // ignore or log
      }
    }

    load();

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
    }

    return () => {
      mounted = false;
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Delete a post
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

    try {
      const res = await API.post(`/posts/${postId}/like`);
      const updatedPost = res.data.post;

      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    } catch (err) {
      console.error("Failed to like/unlike post", err);
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

  return (
    <Container className="py-8">
      {user && (
        <Link to="/create-post">
          <Button className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg text-xl">
            +
          </Button>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <h3 className="font-semibold mb-2">Feed</h3>
            {!posts.length && (
              <div className="text-sm text-gray-500">
                No posts yet. Create one!
              </div>
            )}
            <div className="space-y-3 mt-3">
              {posts.map((p) => {
                const liked = hasLiked(p);
                const likesCount = p.likes ? p.likes.length : 0;

                return (
                  <div key={p._id} className="border p-3 rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {p.author?.name?.[0]}
                      </div>
                      <div>
                        <div className="font-medium">{p.author?.name}</div>
                        <div className="text-xs text-gray-500">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">{p.content}</div>

                    {p.imageUrl && (
                      <img
                        src={`${getSocketBaseUrl()}/uploads/${p.imageUrl}`}
                        alt="post"
                        className="w-full rounded mb-2"
                      />
                    )}

                    {/* Like + Edit/Delete actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(p._id)}
                          className="text-sm flex items-center gap-1"
                          disabled={!user}
                        >
                          <span
                            className={
                              liked
                                ? "text-red-500 text-lg"
                                : "text-gray-500 text-lg"
                            }
                          >
                            {liked ? "❤️" : "🤍"}
                          </span>
                          <span className="text-gray-700">
                            {likesCount} like{likesCount !== 1 ? "s" : ""}
                          </span>
                        </button>
                      </div>

                      {isAuthor(p) && (
                        <div className="flex gap-2">
                          <Link
                            to={`/edit-post/${p._id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold mb-2">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="text-sm text-blue-600">
                Go to your profile
              </Link>
              <Link to="/register" className="text-sm text-blue-600">
                Create an account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
