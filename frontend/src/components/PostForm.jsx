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

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
  });

  async function submit(e) {
    e.preventDefault();
    if (!content && !image) return alert("Post cannot be empty");
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const data = await uploadFile(image);
        imageUrl = data.filename;
      }
      await API.post("/posts", { content, imageUrl });
      navigate("/"); // go back to feed
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border p-2 rounded resize-none"
        rows={4}
      />
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer rounded"
      >
        <input {...getInputProps()} />
        {image ? (
          <p>{image.name}</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
