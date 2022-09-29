import { NFTCard } from "./components/nftCard"
import { useState } from 'react'
import PaginationBar from "./components/paginationBar";

const Home = () => {
 const [wallet, setWalletAddress] = useState("");
 const [collection, setCollectionAddress] = useState("");
 const [NFTs, setNFTs] = useState([])
 const [fetchForCollection, setFetchForCollection]=useState(false)
 const [currentPage, setCurrentPage] = useState(0);
 const [pageKeys, setPageKeys] = useState([""]);

 const fetchNFTs = async(e, pageKey = "", pageIndex = 0) => {
  let nfts; 
  console.log("fetching nfts");
  const api_key = "Bj8JPDxgbV5QfpZuJ2_aAYHtw5kleF4B"
  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs`;
  var requestOptions = {
      method: 'GET'
    };
   
  if (!collection.length) {
  
    const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=51`;

    nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
  } else {
    console.log("fetching nfts for collection owned by address")
    const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageKey=${pageKey}&pageSize=51`;
    nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
  }

  if (nfts) {
    console.log("nfts:", nfts);

    if (nfts.pageKey) {

      setPageKeys((prevKeys) => {
        const newKeys = [...prevKeys];
        newKeys[pageIndex + 1] = nfts.pageKey;

        return newKeys;
      });
    }

    setNFTs(nfts.ownedNfts);
  }
}

const fetchNFTsForCollection = async(e, pageKey = "", pageIndex = 0) => {
  if (collection.length) {
    var requestOptions = {
      method: 'GET'
    };
    const api_key = "Bj8JPDxgbV5QfpZuJ2_aAYHtw5kleF4B"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${pageKey}&limit=51`;
    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    if (nfts) {
      console.log("NFTs in collection:", nfts);


      setPageKeys((prevKeys) => {
        const newKeys = [...prevKeys];
        newKeys[pageIndex + 1] = nfts.nextToken;

        return newKeys;
      });

      setNFTs(nfts.nfts);
    }
  }
}

const onClickPage = async (e, pageIndex) => {
  if (currentPage === pageIndex) return;

  try {
    if (fetchForCollection) {
      fetchNFTsForCollection(e, pageKeys[pageIndex], pageIndex);
    } else {
      fetchNFTs(e, pageKeys[pageIndex], pageIndex);
    }
    setCurrentPage(pageIndex);
  } catch (error) {
    console.log(error);
  }
};

 return (
   <div className="flex flex-col items-center justify-center py-8 gap-y-3">
     <div className="flex flex-col w-full justify-center items-center gap-y-2">
       <input className="w-1/2 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" 
          disabled={fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
       <input className="w-1/2 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300"
          onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
       <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
       <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
           setPageKeys([""]);
           setCurrentPage(0);
           if (fetchForCollection) {
             fetchNFTsForCollection();
           } else {
             fetchNFTs();
           }
         }
       }>Let's go! </button>
     </div>
     {pageKeys.length > 1 && (
        <PaginationBar
          currentPage={currentPage}
          pageKeys={pageKeys}
          onClickPage={onClickPage}
          className="border-t"
        />
      )}
     <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
       {
         !!NFTs.length && NFTs.map(nft => {
           return (
             <NFTCard nft={nft}></NFTCard>
           )
         })
       }
     </div>
   </div>
 )
}

export default Home