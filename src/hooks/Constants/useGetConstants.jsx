import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useGetConstants() {
  const axiosSecure = useAxiosSecure();

  const {
    data: constants,
    isLoading: isConstantsLoading,
    isError: isConstantsError,
  } = useQuery({
    queryKey: ["constants"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/system/constants/`);
      return res.data;
    },
  });

  return { constants, isConstantsLoading, isConstantsError };
}
