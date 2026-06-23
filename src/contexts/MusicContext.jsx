import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

const songs = [
   {
    id: 1,
    title: "Confident",
    artist: "justin",
    url: "/songs/Confident.mp3",
    duration: "2.53",
  },
  {
    id: 2,
    title: "Dracula",
    artist: "kim jenni",
    url: "/songs/Dracula.mp3",
    duration: "3.25",
  },
  {
    id: 3,
    title: "Espresso",
    artist: "Sabrina Carbanent",
    url: "/songs/Espresso.mp3",
    duration: "2.55",
  },
  {
    id: 4,
    title: "Gabriela",
    artist: "KATSHY",
    url: "/songs/Gabriela.mp3",
    duration: "3.17",
  },
  {
    id: 5,
    title: "Killin it Girl",
    artist: "J-hope",
    url: "/songs/Killin it Girl.mp3",
    duration: "2.28",
  },
  {
    id: 6,
    title: "Lolita",
    artist: "Harish jayraj",
    url: "/songs/Loita.mp3",
    duration: "5.09",
  },
  {
    id: 7,
    title: "Position",
    artist: "Ariane Grandae",
    url: "/songs/Positiom.mp3",
    duration: "2.42",
  },
  {
    id: 8,
    title: "Seoul",
    artist: "kim jenni",
    url: "/songs/Seoul.mp3",
    duration: "2.44",
  },
  {
    id: 9,
    title: "We Don't Talk Anymore",
    artist: "Charli puthi",
    url: "/songs/We Don't Talk Anymmore.mp3",
    duration: "3.37",
  },
  {
    id: 10,
    title: "Women",
    artist: "Doja cat",
    url: "/songs/Women.mp3",
    duration: "2.22",
  },
];
export const MusicProvider = ({ children }) => {
  const allSongs = songs;
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      })
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        handlePlaySong,
        currentTrackIndex,
        currentTrack,
        setCurrentTime,
        currentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
        setCurrentTrack,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }

  return contextValue;
};
export default MusicContext;