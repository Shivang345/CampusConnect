import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
// import useAuth from "../hooks/useAuth";

export default function EditPost() {
  const { id } = useParams(); // post id from URL
  const navigate = useNavigate();
//   const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Load post data on mount
  useEffect(() => {
    async function loadPost() {
      const res = await API.get(`/posts/${id}`);
      setContent(res.data.content);
    }
    loadPost();
  }, [id]);

  const handleUpdate = async () => {
    let imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await API.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = uploadRes.data.filename;
    }

    await API.put(`/posts/${id}`, { content, imageUrl });
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Post
      </button>
    </div>
  );
}
