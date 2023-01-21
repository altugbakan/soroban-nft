import { useState } from "react";
import { useContractValue } from "../hooks/useContractValue";
import { useWalletContext } from "../hooks/useWalletContext";
import { CONTRACT_ID } from "../utils/constants";
import { scValToBigNumber, stringToAccountIdentifier } from "../utils/convert";
import { InitialPage } from "./pages/InitialPage";
import { AfterMintPage } from "./pages/AfterMintPage";
import { BeforeMintPage } from "./pages/BeforeMintPage";
import { FundPage } from "./pages/FundPage";

export function MainPage() {
  const { address, networkDetails, server } = useWalletContext();
  const [minted, setMinted] = useState<boolean>(false);
  const [funded, setFunded] = useState<boolean>(false);

  const handleMinted = () => {
    setMinted(true);
  };

  const handleFunded = () => {
    console.log("funded");
    setFunded(true);
  };

  const balance = useContractValue({
    address: address,
    contractId: CONTRACT_ID,
    server,
    networkPassphrase: networkDetails?.networkPassphrase,
    func: "balance",
    params: address ? [stringToAccountIdentifier(address)] : undefined,
  });

  if (!address || !networkDetails?.network || !server) {
    return <InitialPage />;
  }

  if (balance.loading) return <h1>Loading...</h1>;

  if (!funded && !minted && balance.error) {
    return <FundPage address={address} handleFunded={handleFunded} />;
  }

  if (!minted && balance.data && scValToBigNumber(balance.data).equals(0)) {
    return <BeforeMintPage handleMinted={handleMinted} />;
  }

  if (minted || scValToBigNumber(balance.data).greaterThan(0))
    return <AfterMintPage />;

  return <BeforeMintPage handleMinted={handleMinted} />;
}
