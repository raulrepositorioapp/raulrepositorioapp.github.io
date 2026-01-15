import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useGetHistory() {
  const axiosSecure = useAxiosSecure();

  const {
    data: allHistory,
    isLoading: isAllHistoryLoading,
    isError: isAllHistoryError,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/`);
      return res.data;
    },
  });

  return { allHistory, isAllHistoryLoading, isAllHistoryError };
}
