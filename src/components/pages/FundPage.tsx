import { FundButton } from "../interface/FundButton";

export interface FundPageProps {
  address: string;
  handleFunded(): void;
}

export function FundPage({ address, handleFunded }: FundPageProps) {
  return (
    <div>
      <h2>
        Seems like you have not funded your wallet. Would you like to fund it
        now?
      </h2>
      <FundButton address={address} handleFunded={handleFunded} />
    </div>
  );
}
