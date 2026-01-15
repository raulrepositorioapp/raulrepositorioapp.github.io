import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useCalculateRoute({ onSuccess, onError }) {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationKey: ["calculateRoute"],
    mutationFn: async (submittedData) => {
      const res = await axiosSecure.post(`/plan-trip/`, submittedData);
      return res?.data;
    },
    onSuccess,
    onError,
  });
}
