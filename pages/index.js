import Center from "../Components/Center"
import Sidebar from "../Components/Sidebar"
import { getSession } from "next-auth/react"
import Player from "../Components/Player"

export default function Home () {
  return (
    <div className="bg-white h-screen overflow-hidden"> 
     

      <main className="flex">
       <Sidebar />
       <Center />
        {/* Centre */}
      </main>

      <div className="sticky bottom-0">
        <Player/>
      </div>

      
    </div>
  );
}


