import { Web3Button } from "@web3modal/react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import contractInterface from "../contract-abi.json";
import { ethers } from "ethers";

// Configuration for the contract
const configuration = {
  address: "0xAa3906F986E0cd86e64C1e30cE500C1de1EF46Ad",
  abi: contractInterface,
};

export default function Home() {
  const { address, isConnected } = useAccount();

  const [imageURL, setImageURL] = useState("");

  // Read the tokenURI from the contract
  const { data: tokenURI } = useContractRead({
    ...configuration,
    functionName: "commonTokenURI",
  });

  // Read the mint cost from the contract
  const { data: mintCost } = useContractRead({
    ...configuration,
    functionName: "mintCost",
  });

  // Prepare the contract write
  const { config } = usePrepareContractWrite({
    ...configuration,
    functionName: "mint",
    args: [address, { value: mintCost?.toString() }],
  });

  // Write to the contract
  const { writeAsync, isLoading } = useContractWrite(config);

  // Mint the NFT
  const mint = async () => {
    try {
      await writeAsync?.();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(tokenURI);
      const json = await response.json();
      setImageURL(json.image);
    };
    fetchData();
  }, [tokenURI]);

  return (
    <>
      <div className="flex justify-center items-center h-screen border">
        <div className="h-auto w-9/12 flex justify-center items-start gap-x-60">
          <div className="mt-5">
            <h1 className="text-2xl font-bold	font-[poppins]">NFT Minting</h1>
            <div className="mt-2">
              <Web3Button />
            </div>

            <button
              disabled={isLoading}
              style={{ display: isConnected ? "block" : "none" }}
              onClick={mint}
              className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white p-2 px-5 w-fit cursor-pointer mt-7 disabled:opacity-50"
            >
              {isLoading ? "Waiting for approval" : "Mint"}
            </button>
            <p
              className="text-sm mt-3"
              style={{ display: isConnected ? "Block" : "none" }}
            >
              You will have to pay{" "}
              {isConnected && ethers.utils.formatEther(mintCost?.toString())}{" "}
              <span className="font-bold">ETH</span>
            </p>
          </div>

          <div className="h-80 w-80 rounded-lg">
            <img
              src={ isConnected ? imageURL : "https://openseauserdata.com/files/9d9d3a33707ffffe68cff661fe4a85c7.png"}
              alt="nft"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
