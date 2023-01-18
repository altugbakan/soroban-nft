import { useSorobanReact } from "@soroban-react/core";

export function useAccount() {
  const { address } = useSorobanReact();
  return address;
}
