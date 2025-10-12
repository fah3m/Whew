"use client";

import { useState } from "react";
import { jaro, space } from "../fonts.js";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const addSong = useMutation(api.songs.addSong);

  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0); // <--- new

  const genres = [
    "Pop",
    "K-Pop",
    "Hip-Hop",
    "R&B",
    "Lo-fi",
    "EDM",
    "Acoustic",
    "Bollywood",
    "Phonk",
    "Bhojpuri",
  ];

  const handleUpload = async () => {
    if (!title || !uploader || !genre || !file) {
      alert("Please fill all fields and upload a file!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "whew-music");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dr8j7r365/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.secure_url)
        throw new Error(
          "Upload failed - Secure link could'nt be generated twin"
        );

      await addSong({
        title,
        uploader,
        genre,
        url: data.secure_url,
      });

      alert("Song uploaded successfully 🎵");
      setTitle("");
      setUploader("");
      setGenre("");
      setFile(null);
      setFileKey((prev) => prev + 1); // <--- reset file input
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-96px)] w-screen flex items-center justify-center flex-col px-4 ${space.className}`}
    >
      <div className="relative w-full flex justify-center mb-6">
        {/* Upload Form Container */}
        <div className="w-[50vw] max-md:w-full max-md:h-auto max-w-2xl bg-accent neobrutal p-6 flex flex-col gap-4">
          <h2
            className={`text-4xl max-md:text-2xl mb-4 text-black text-center ${jaro.className}`}
          >
            Upload Your Song 🎵
          </h2>

          {/* Song Name */}
          <label className="font-bold text-black">
            Song Name
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song name"
              className="neobrutal w-full mt-2 p-2 border-4 border-black rounded-md bg-white"
            />
          </label>

          {/* Your Name */}
          <label className="font-bold text-black">
            Your Name
            <input
              type="text"
              value={uploader}
              onChange={(e) => setUploader(e.target.value)}
              placeholder="Enter your name"
              className="neobrutal w-full mt-2 p-2 border-4 border-black rounded-md bg-white"
            />
          </label>

          {/* Genre Dropdown */}
          <label className="font-bold text-black">
            Select Genre
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="neobrutal w-full mt-2 p-2 border-4 border-black rounded-md bg-white"
            >
              <option value="">-- Select a Genre --</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          {/* MP3 Upload */}
          <label className="font-bold text-black">
            Upload MP3
            <input
              key={fileKey}
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (!selectedFile) return;

                if (selectedFile.type !== "audio/mpeg") {
                  alert("Only MP3 files are allowed!");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                if (selectedFile.size > 10 * 1024 * 1024) {
                  alert("File size must be less than 10MB!");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                setFile(selectedFile);
              }}
              className="neobrutal w-full mt-2 p-2 border-4 border-black rounded-md bg-white 
                file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md 
                file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </label>
        </div>

        {/*Floating Shapes */}
        <img
          src="/shapes/star.svg"
          alt="star"
          className="w-35 max-md:w-20 absolute left-95 max-md:left-10 -top-35 max-md:-top-20"
        />
        <img
          src="/shapes/cone.svg"
          alt="cone"
          className="w-25 max-md:w-15 absolute left-70 max-md:left-5 top-110 max-md:top-160"
        />
        <img
          src="/shapes/cuboid.svg"
          alt="cuboid"
          className="w-30 max-md:w-15 absolute right-110 max-md:right-10 -top-30 max-md:-top-20"
        />
        <img
          src="/shapes/cylinder.svg"
          alt="cylinder"
          className="w-30 max-md:w-20 absolute right-120 max-md:right-30 top-130 max-md:top-155"
        />
        <img
          src="/shapes/ring.svg"
          alt="ring"
          className="w-30 max-md:w-20 absolute right-70 max-md:right-3 top-50 max-md:top-160"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="py-2 px-8 bg-primary rounded-md neobrutal rotate-5 disabled:opacity-50"
      >
        <h3 className={`text-5xl ${jaro.className} relative max-md:text-2xl`}>
          {loading ? "UPLOADING..." : "UPLOAD"}
        </h3>
      </button>

      <a
        href="https://mp3juice.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
      >
        Need an MP3? Download here
      </a>
    </div>
  );
}
