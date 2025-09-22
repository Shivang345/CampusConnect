import React from "react";
import Container from "../components/Container";
import PostForm from "../components/PostForm";

export default function CreatePost() {
  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm />
    </Container>
  );
}
