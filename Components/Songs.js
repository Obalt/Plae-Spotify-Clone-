import {useRecoilValue} from "recoil"; 
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song"; 

function Songs() {
  const playlist = useRecoilValue(playlistState); 

  return (
    <div className="px-8 flex flex-col space-y-2 pb-28 text-gray-500">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i}/>
      ))}

    </div>
  )
}

export default Songs