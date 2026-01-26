import { useSession } from "@/lib/auth";

const useAuth = () => {
  const { data, isPending, error, isRefetching, refetch } = useSession();

  return {
    user: data?.user,
    session: data?.session,
    isPending,
    error,
    isRefetching,
    refetch,
  };
};

export default useAuth;
