import React from "react";
import Container from "../components/Container";
import PostForm from "../components/PostForm";
import Card from "../components/Card";

export default function CreatePost() {
  return (
    <Container className="py-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          New post
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
          Share something with your campus
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Announcements, events, opportunities, achievements, or just
          something cool.
        </p>
      </div>

      <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
        <PostForm />
      </Card>
    </Container>
  );
}
