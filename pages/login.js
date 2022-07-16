import {getProviders, signIn} from "next-auth/react"

function Login( {providers} ) {
  return (
    <div>
      <div className='flex flex-col items-center bg-gray-500 min-h-screen w-full justify-center '>
        <img
          className='w-52 mb-1 rounded-2xl animate-bounce'
          src='https://www.sportsmith.co/wp-content/uploads/2022/02/PLAE-Logo.png'
          alt=''
        />
        <h3 className='mb-10 ml-20 text-sm '>Powered by Spotify</h3>

        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className='bg-[#18D860] text-white p-5 rounded-3xl'
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
      </div>
   
    </div>
  );

  
}



export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        }
    }

}




