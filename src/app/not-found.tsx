"use client";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    window.location.href = "/login";
  });
  return (
    <div>
      <h1>
        Page Not Found!
        <br />
        Redirecting to Login Page or Your Dashboard...
        <br />
        If you are not redirected, click <a href="/login">here</a> to go to the
        login page.
      </h1>
    </div>
  );
}
