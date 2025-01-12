"use client"
import React, { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    window.location.href = "/login";
  });
  return (
    <div>Redirecting...</div>
  );
}
