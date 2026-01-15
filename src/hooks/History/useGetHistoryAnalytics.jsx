import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useGetHistoryAnalytics() {
  const axiosSecure = useAxiosSecure();

  const {
    data: historyAnalytics,
    isLoading: isHistoryAnalyticsLoading,
    isError: isHistoryAnalyticsError,
  } = useQuery({
    queryKey: ["historyAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/analytics/`);
      return res.data;
    },
  });

  return {
    historyAnalytics,
    isHistoryAnalyticsLoading,
    isHistoryAnalyticsError,
  };
}
