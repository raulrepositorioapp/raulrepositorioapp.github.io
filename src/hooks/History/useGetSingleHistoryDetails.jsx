import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useGetSingleHistoryDetails({ id }) {
  const axiosSecure = useAxiosSecure();

  const {
    data: singleHistoryDetails,
    isLoading: isSingleHistoryDetailsLoading,
    isError: isSingleHistoryDetailsError,
  } = useQuery({
    queryKey: ["singleHistoryDetails"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });

  return {
    singleHistoryDetails,
    isSingleHistoryDetailsLoading,
    isSingleHistoryDetailsError,
  };
}
