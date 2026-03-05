import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useUpdateConstants({ onSuccess, onError }) {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationKey: ["updateConstants"],
    mutationFn: async (data) => {
      const res = await axiosSecure.patch("/system/constants/", data);
      return res?.data;
    },
    onSuccess,
    onError,
  });
}
