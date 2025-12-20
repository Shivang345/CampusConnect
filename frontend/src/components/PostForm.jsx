import React, { useState } from "react";
import API, { uploadFile } from "../utils/api";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
  });

  async function submit(e) {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      let imageUrl;

      if (image) {
        const uploaded = await uploadFile(image);
        imageUrl = uploaded.url;
      }

      await API.post("/posts", {
        content: content.trim(),
        imageUrl,
      });

      setContent("");
      setImage(null);
      navigate("/");
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">
          What's happening on campus?
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Share an update, event or opportunity..."
          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
      </div>

      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed px-4 py-4 text-xs sm:text-sm transition ${
          isDragActive
            ? "border-accent bg-accent/5 text-accent"
            : "border-slate-300/80 bg-white/60 text-slate-500 hover:border-accent/70 hover:bg-accent/5"
        }`}
      >
        <input {...getInputProps()} />
        <span className="font-medium">
          {image ? "Change image" : "Attach an image (optional)"}
        </span>
        <span className="text-[11px] sm:text-xs">
          Drag & drop or click to browse
        </span>
        {image && (
          <span className="mt-1 truncate text-[11px] text-slate-500">
            {image.name}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post update"}
        </Button>
      </div>
    </form>
  );
}
