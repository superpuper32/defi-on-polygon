import * as wagmi from "wagmi";
import { useProvider } from "wagmi";
import type { BigNumber } from "ethers";
// Import our contract ABI (a json representation of our contract's public interface).
// The hardhat compiler writes this file to artifacts every time we run `npx hardhat`.
import ForumContract from '../../../Hardhat/artifacts/contracts/Forum.sol/Forum.json';

export interface Question {
  questionId: BigNumber;
  message: string;
  creatorAddress: string;
  timestamp: BigNumber;
}

const useForumContract = () => {
  // An ethers.Provider instance. This will help us read from the contract
  // even if we don't have a logged in wallet. We set this up in _app.tsx.
  const provider = useProvider();

  // This returns a new ethers.Contract ready to interact with our API.
  // We need to pass in the address of our deployed contract as well as its abi.
  const contract = wagmi.useContract({
    addressOrName: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    contractInterface: ForumContract.abi,
    signerOrProvider: provider,
  });

  // Wrapper to fetch a question from the contract
  const getQuestion = async (questionId: BigNumber): Promise<Question> => {
    return { ...await contract.questions(questionId) };
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getQuestion,
  };
}

export default useForumContract;
