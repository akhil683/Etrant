import { useNetworkState } from "expo-network";

export function useNetworkStatus() {
  const network = useNetworkState();
  return {
    isOffline: network.isConnected === false,
  };
}
