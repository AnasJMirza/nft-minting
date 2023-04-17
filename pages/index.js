import { Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";
import { useContractRead } from 'wagmi'
import { useEffect } from "react";
import wagmigotchiABI from '../contract-abi.json'




export default function Home() {
  const { isConnected } = useAccount();

  const { data, isError, isLoading , error } = useContractRead({
    address: '0x6B52Bd5FCeC30576Da8D2dd2a6D5c8eda111DB11',
    abi: wagmigotchiABI,
    functionName: 'getHunger',
  })

  console.log({data , isLoading , isError  ,error });

 

  return (
    <main>
      <div className="flex justify-center items-center h-screen border">
        <div className="h-auto w-9/12 flex justify-center items-start gap-x-60">
          <div className="mt-5">
            <h1 className="text-2xl font-bold	font-[poppins]">NFT Mint Demo</h1>
            <div className="mt-2">
              <Web3Button />
            </div>
            
              <div className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white p-2 w-20 cursor-pointer mt-7">
                <p>Mint</p>
              </div>
            
          </div>

          <div className="h-80 w-80 bg-red-300 rounded-lg">Card</div>
        </div>
      </div>
    </main>
  );
}
