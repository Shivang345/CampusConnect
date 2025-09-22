import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Card from "../components/Card";
import API from "../utils/api";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await API.get("/posts");
        if (mounted) setPosts(res.data);
      } catch (err) {
        // ignore for starter
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Delete a post
  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      // Remove deleted post from state so feed updates
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
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
              {posts.map((p) => (
                <div key={p._id} className="border p-3 rounded">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {p.author?.name?.[0]}
                    </div>
                    <div>
                      <div className="font-medium">{p.author?.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">{p.content}</div>
                  {p.imageUrl && (
                    <img
                      src={`http://localhost:4000/uploads/${p.imageUrl}`}
                      alt="post"
                      className="w-full rounded"
                    />
                  )}
                  {String(p.author) === String(user) && (
                    <div className="flex gap-2 mt-2">
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
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold mb-2">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <a href="/profile" className="text-sm text-blue-600">
                Go to your profile
              </a>
              <a href="/register" className="text-sm text-blue-600">
                Create an account
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
