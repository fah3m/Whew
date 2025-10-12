"use client";

import { jaro, space } from "../fonts";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; // adjust path if needed

const Page = () => {
  const [play, setPlay] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  return (
    <>
      {!play ? (
        <Search
          func={(data) => {
            setPlayerData(data);
            setPlay(true);
          }}
        />
      ) : (
        <Player data={playerData} func={() => setPlay(false)} />
      )}
    </>
  );
};

const Search = ({ func }) => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!location) return;
    // if(location) ->
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.weather && data.weather.length > 0) {
        const conditions = data.weather.map((w) => w.main);
        const commonGenres = getCommonGenres(conditions);

        func({
          weather: conditions.join(", "),
          genres: commonGenres,
        });
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
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
        <div className="w-[60vw] max-md:w-full max-md:h-auto max-w-2xl bg-accent neobrutal p-6 flex flex-col gap-4 relative z-10">
          <h2
            className={`text-2xl max-md:text-sm mb-4 text-black ${space.className}`}
          >
            drop where u @ and we got u twin
          </h2>

          {/* Location */}
          <label className="font-bold text-black">
            Location
            <input
              type="text"
              placeholder="Enter ur location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="neobrutal w-full mt-2 p-2 border-4 border-black rounded-md bg-white"
            />
          </label>
        </div>

        {/* Floating Shapes */}
        <img
          src="/shapes/star.svg"
          alt="star"
          className="w-35 max-md:w-20 absolute left-95 max-md:left-10 -top-35 max-md:-top-20"
        />
        <img
          src="/shapes/cone.svg"
          alt="cone"
          className="w-25 max-md:w-15 absolute left-70 max-md:left-5 top-90 max-md:top-110"
        />
        <img
          src="/shapes/cuboid.svg"
          alt="cuboid"
          className="w-30 max-md:w-15 absolute right-110 max-md:right-10 -top-50 max-md:-top-20"
        />
        <img
          src="/shapes/cylinder.svg"
          alt="cylinder"
          className="w-30 max-md:w-20 absolute right-120 max-md:right-30 top-100 max-md:top-130"
        />
        <img
          src="/shapes/ring.svg"
          alt="ring"
          className="w-30 max-md:w-20 absolute right-70 max-md:right-3 top-50 max-md:top-110"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={getWeather}
        disabled={loading}
        className="py-2 px-8 bg-primary rounded-md neobrutal rotate-5"
      >
        <h3 className={`text-5xl ${jaro.className} relative max-md:text-2xl`}>
          {loading ? "LOADING..." : "BET"}
        </h3>
      </button>
    </div>
  );
};

// Player with Convex songs (random start + floating icons)
const Player = ({ data, func }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [playlist, setPlaylist] = useState([]); // shuffled list of indexes
  const [currentPos, setCurrentPos] = useState(0); //position in the array
  const audioRef = useRef(null);

  const songs = useQuery(
    api.songs.getSongsByGenre,
    selectedGenre ? { genre: selectedGenre } : "skip"
  );

  // Fisher-Yates shuffle
  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleNext = () => {
    if (!songs || songs.length === 0) return;

    if (currentPos < playlist.length - 1) {
      setCurrentPos(currentPos + 1);
    } else {
      // reshuffle when exhausted
      const newPlaylist = shuffleArray([...Array(songs.length).keys()]);
      setPlaylist(newPlaylist);
      setCurrentPos(0);
    }

    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  };

  // When songs load or genre changes → make a fresh playlist
  useEffect(() => {
    if (songs && songs.length > 0) {
      const newPlaylist = shuffleArray([...Array(songs.length).keys()]);
      setPlaylist(newPlaylist);
      setCurrentPos(0);
    }
  }, [songs]);

  // Auto-play first song when playlist updates
  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [playlist, currentPos]);

  return (
    <div
      className={`min-h-[calc(100vh-96px)] w-screen flex flex-col items-center justify-center px-4 relative ${space.className} pb-10`}
    >
      <div className="relative w-full flex justify-center mb-6">
        <div className="w-[50vw] max-md:w-full bg-accent neobrutal p-6 flex flex-col gap-6 relative z-10 mb-6">
          <div className="flex justify-between text-lg text-black font-bold">
            <span>{data?.weather}</span>
          </div>

          <h2
            className={`text-4xl max-md:text-2xl text-black ${jaro.className}`}
          >
            Choose a vibe 🎶
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {data?.genres?.map((genre, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGenre(genre)}
                className={`py-2 px-6 rounded-md border-4 border-black neobrutal 
                  ${
                    selectedGenre === genre
                      ? "bg-primary text-white"
                      : "bg-white text-black"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {songs && playlist.length > 0 && songs[playlist[currentPos]] ? (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold text-black">
                {songs[playlist[currentPos]].title}
              </h3>
              <p className="text-black">
                Uploader: {songs[playlist[currentPos]].uploader}
              </p>
              <audio
                ref={audioRef}
                key={songs[playlist[currentPos]]._id}
                controls
                autoPlay
                onEnded={handleNext}
                className="w-full"
              >
                <source
                  src={songs[playlist[currentPos]].url}
                  type="audio/mpeg"
                />
              </audio>
              <button
                onClick={handleNext}
                className="py-2 px-6 bg-primary text-white rounded-md neobrutal rotate-3"
              >
                Next Song
              </button>
            </div>
          ) : (
            <p className="text-lg text-black">Loading song...</p>
          )}
        </div>
      </div>

      <button
        onClick={func}
        className="py-2 px-8 bg-primary rounded-md neobrutal rotate-5 relative z-10"
      >
        <h3 className={`text-5xl ${jaro.className} relative max-md:text-2xl`}>
          RETURN
        </h3>
      </button>
    </div>
  );
};

// Weather → Genres mapping
function getCommonGenres(conditions) {
  const weatherToGenres = {
    Clear: ["Pop", "EDM", "Hip-Hop"],
    Clouds: ["Lo-fi", "Bollywood", "Acoustic"],
    Rain: ["Lo-fi", "Acoustic", "R&B"],
    Thunderstorm: ["Hip-Hop", "Bhojpuri", "EDM"],
    Snow: ["Acoustic", "Bhojpuri", "K-Pop"],
    Mist: ["Lo-fi", "R&B", "Acoustic"],
    Fog: ["Lo-fi", "R&B", "Acoustic"],
    Haze: ["Lo-fi", "R&B", "Acoustic"],
    Drizzle: ["Lo-fi", "Acoustic", "R&B"],
    Extreme: ["Hip-Hop", "Phonk", "EDM"],
  };

  // Collect all possible genres for the conditions
  let matchedGenres = [];
  conditions.forEach((c) => {
    if (weatherToGenres[c]) {
      matchedGenres = [...matchedGenres, ...weatherToGenres[c]];
    }
  });

  // Remove duplicates
  matchedGenres = [...new Set(matchedGenres)];

  // Fallback if nothing matched
  if (matchedGenres.length === 0) {
    matchedGenres = ["Pop", "Hip-Hop", "Bollywood"];
  }

  return matchedGenres;
}

export default Page;
