import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";

export default function EditPost() {
  const { id } = useParams(); // post id from URL
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load post data on mount
  useEffect(() => {
    async function loadPost() {
      try {
        const res = await API.get(`/posts/${id}`);
        const post = res.data;
        setContent(post.content || "");
        setExistingImageUrl(post.imageUrl || "");
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = existingImageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await API.post("/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url || uploadRes.data.filename || imageUrl;
      }

      await API.put(`/posts/${id}`, { content, imageUrl });
      navigate("/");
    } catch (err) {
      console.error("Failed to update post", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Edit post
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
            Update your post
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Make small edits, update information, or change the banner
            image.
          </p>
        </div>
        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-slate-200 hover:underline"
        >
          Back to feed
        </Link>
      </div>

      <Card className="max-w-2xl bg-slate-900/80 border-slate-700/70 text-slate-100">
        {loading ? (
          <p className="text-sm text-slate-300">Loading post...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/25"
                placeholder="Update what you want to share with your campus..."
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-medium text-slate-300">
                Image (optional)
              </label>
              {existingImageUrl && !imageFile && (
                <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  <img
                    src={existingImageUrl}
                    alt="Current"
                    className="max-h-64 w-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
              <p className="text-[11px] text-slate-500">
                Uploading a new image will replace the existing one.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update post"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </Container>
  );
}
