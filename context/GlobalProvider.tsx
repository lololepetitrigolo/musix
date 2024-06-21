import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AVPlaybackSource, AVPlaybackStatus, Audio } from "expo-av";
import { Models } from "react-native-appwrite";
import { getCurrentUser, updateRecentListentMusic } from "@/lib/appwrite";

export interface SoundInfo {
  id: string;
  cover: string;
  author: string;
  title: string;
  music: string;
}
export interface PlaylistInfo {
  id: string;
  cover: string;
  creator: string;
  title: string;
  musics: SoundInfo[];
}

export interface GlobalContextType {
  sound: Audio.Sound | null;
  setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
  soundTrack: React.MutableRefObject<{
    currentSoundindex: number;
    sounds: SoundInfo[];
    currentPlaylistId: string | undefined;
  }>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  shouldUpdatePlayingTime: React.MutableRefObject<number>;
  playingTime: number;
  setPlayingTime: React.Dispatch<React.SetStateAction<number>>;
  unLoadLoadAndPlaySound: (soundfile: AVPlaybackSource) => void;
  toggleSound: () => void;
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: Models.Document | undefined;
  setUser: React.Dispatch<React.SetStateAction<Models.Document | undefined>>;
  nextTrack: () => void;
  previousTrack: () => void;
  downloadUrl: React.MutableRefObject<string>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [globalSound, setGlobalSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTime, setPlayingTime] = useState(0);
  const downloadUrl = useRef("");
  const shouldUpdatePlayingTime = useRef(1);
  const soundTrack = useRef<{
    currentSoundindex: number;
    sounds: SoundInfo[];
    currentPlaylistId: string | undefined;
  }>({ currentSoundindex: -1, sounds: [], currentPlaylistId: undefined });

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      if (playbackStatus.isPlaying) {
        // Update playTime
        if (
          shouldUpdatePlayingTime.current == 1 &&
          playbackStatus.durationMillis
        )
          setPlayingTime(
            playbackStatus.positionMillis / playbackStatus.durationMillis
          );
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        nextTrack();
      }
    }
  };

  const unLoadLoadAndPlaySound = async (soundfile: AVPlaybackSource) => {
    if (globalSound) await globalSound.unloadAsync();

    const { sound } = await Audio.Sound.createAsync(soundfile);
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await sound.playAsync();

    setGlobalSound(sound);
    setIsPlaying(() => true);
    if (
      user &&
      soundTrack.current.sounds[soundTrack.current.currentSoundindex]
    ) {
      await updateRecentListentMusic(
        user,
        soundTrack.current.sounds[soundTrack.current.currentSoundindex].id
      );
    }
  };

  async function toggleSound() {
    if (globalSound) {
      if (isPlaying) {
        await globalSound.pauseAsync();
      } else {
        await globalSound.playAsync();
      }
      setIsPlaying((b) => !b);
    }
  }

  function nextTrack() {
    const newTrackIndex = soundTrack.current.currentSoundindex + 1;
    if (newTrackIndex < soundTrack.current.sounds.length) {
      unLoadLoadAndPlaySound({
        uri: soundTrack.current.sounds[newTrackIndex].music,
      });
      soundTrack.current = {
        currentSoundindex: newTrackIndex,
        sounds: soundTrack.current.sounds,
        currentPlaylistId: soundTrack.current.currentPlaylistId,
      };
    }
  }

  function previousTrack() {
    const newTrackIndex = soundTrack.current.currentSoundindex - 1;
    if (newTrackIndex >= 0) {
      unLoadLoadAndPlaySound({
        uri: soundTrack.current.sounds[newTrackIndex].music,
      });
      soundTrack.current = {
        currentSoundindex: newTrackIndex,
        sounds: soundTrack.current.sounds,
        currentPlaylistId: soundTrack.current.currentPlaylistId,
      };
    } else {
      setPlayingTime(0);
    }
  }

  async function changePlayTime() {
    if (globalSound) {
      const status = await globalSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        if (isPlaying) await globalSound.pauseAsync();
        await globalSound?.setPositionAsync(
          playingTime * status.durationMillis
        );
        if (isPlaying) globalSound.playAsync();
      }
    }
  }

  useEffect(() => {
    const skipTime = async () => {
      if (globalSound) {
        const status = await globalSound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          if (
            shouldUpdatePlayingTime.current == 2 &&
            Math.abs(
              playingTime * status.durationMillis - status.positionMillis
            ) > 1000
          ) {
            changePlayTime();
            shouldUpdatePlayingTime.current = 1;
          }
        }
      }
    };

    skipTime().catch(console.error);
  }, [playingTime]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: 1,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: 1,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
    });
  }, []);

  const [user, setUser] = useState<Models.Document>();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(undefined);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        sound: globalSound,
        setSound: setGlobalSound,
        isPlaying,
        setIsPlaying,
        shouldUpdatePlayingTime,
        playingTime,
        setPlayingTime,
        unLoadLoadAndPlaySound,
        toggleSound,
        soundTrack,
        user,
        isLogged,
        setIsLogged,
        setUser,
        nextTrack,
        previousTrack,
        downloadUrl,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
