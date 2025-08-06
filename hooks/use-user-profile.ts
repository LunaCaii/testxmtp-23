import { useReadContract } from "wagmi"
import { chatDAppAddress, chatDAppABI } from "@/lib/contract"

export function useUserProfile(address: `0x${string}` | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: chatDAppAddress,
    abi: chatDAppABI,
    functionName: "profiles",
    args: address ? [address] : undefined,
  })

  const profile = data
    ? {
        userAddress: data[0],
        nickname: data[1],
        avatarUrl: data[2],
        isRegistered: data[3],
      }
    : null

  return {
    profile,
    isLoading,
    error,
  }
}
