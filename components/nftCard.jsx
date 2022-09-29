import Image from 'next/image'
import copyPic from '../styles/images/copy.png'

export const NFTCard = ({ nft }) => {

    return (
        <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
            <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
            <div className="">
                <h2 className="text-xl text-gray-800">{nft.title}</h2>
                <p className="text-gray-600">Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
                <p className="text-gray-600" >
                    {`${nft.contract.address.substr(0, 4)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}
                    &nbsp;
                    <Image className="cursor-pointer" src={copyPic} title="Copy the contract address" width="13" height="13"
                        onClick={() => navigator.clipboard.writeText(`${nft.contract.address}`)} />
                </p>
                
            </div>

            <div className="flex-grow mt-2">
                <p className="text-gray-600">{nft.description.substr(0, 150)}</p>
            </div>
            <div className="flex-grow justify-center mt-2">
                <center>
                    <a target={"_blank"} href={`https://etherscan.io/token/${nft.contract.address}`} 
                        className="text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5 cursor-pointer">
                            View on etherscan
                    </a>
                </center>
            </div>
        </div>
    </div>
    )
}