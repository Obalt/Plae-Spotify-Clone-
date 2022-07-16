import {HeartIcon, VolumeUpIcon as VolumeDownIcon,} from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { useSession} from "next-auth/react" 
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import {useRecoilState} from "recoil"
import { useState, useEffect, useCallback } from "react";
import useSongInfo from "../hooks/useSongInfo";
import { SwitchHorizontalIcon, 
  RewindIcon,
FastForwardIcon, 
PauseIcon,
PlayIcon,
ReplyIcon,
VolumeOffIcon,
VolumeUpIcon,
 } from "@heroicons/react/solid";
import { data } from "autoprefixer";
import { debounce } from "lodash";


function Player() {
const spotifyApi = useSpotify();
const {data: session, status} = useSession(); 

const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);

const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); 
const [volume, setVolume] = useState(50); 

const songInfo = useSongInfo(currentTrackId);
const fetchCurrentSong = () => {

    if(!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
             setCurrentTrackId(data.body?.item?.id);
             spotifyApi.getMyCurrentPlaybackState().then((data) => {
               setIsPlaying(data.body?.is_playing);
             });
        });
    }
};

const handlePlayPause = () => {
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
if (data.body?.is_playing) {
  spotifyApi.pause(); 
  setIsPlaying(false);
} else {
  spotifyApi.play();
  setIsPlaying(true);
}
  });
};

useEffect(() => {
if (spotifyApi.getAccessToken() && !currentTrackId) {

    //fetch song info
    fetchCurrentSong();
    setVolume(50)


}


}, [currentTrackId, spotifyApi, session]);

useEffect (() => {
  if(volume > 0 && volume < 100) {
    debounceAdjustVolume(volume);
  }

}, [volume])

const debounceAdjustVolume = useCallback (
  debounce((volume) => {
    spotifyApi.setVolume(volume).catch((err) => {

    }); 
  },274 ), [])



  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-600 text-white 
    grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        {/* left */}
<div className="flex items-center space-x-4">
  <img
          className="hidden md:inline h-12 w-12 rounded-lg"
          src={songInfo?.album?.images?.[0].url}
        
          alt="" />

          <div>
            <h1 className="text-sm text-red-500">{songInfo?.name}</h1>
            {songInfo?.artists?.[0]?.name}
          </div>
</div>

{/* center */}
<div className="flex items-center justify-evenly " >
  <SwitchHorizontalIcon className="button "/>
  <RewindIcon 
  // onClick={spotifyApi.skipToPrevious()} : Error on Spotify Api
   className="button" />
   {isPlaying ? (
     <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />

   ): (
<PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
   )}

   <FastForwardIcon
   // onClick={spotifyApi.skipToNext()} : Error on Spotify Api
   className="button" />
   <ReplyIcon className="button" />
</div>
<div className="flex items-center space-x-3 md:space-x-4 justify-end">




  {/* RHS */}
  <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button"  />
  <input className="w-14 md:w-28" 
  type="range" 
  value={volume}
  onChange={e => setVolume(Number(e.target.value))}
   min={0} max={100} />



  <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
</div>
    </div>
  )
}

export default Player