"use client";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    window.location.href = "/login";
  });
  return <div>Redirecting...</div>;
}
