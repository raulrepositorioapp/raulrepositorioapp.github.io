import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "../Axios/useAxiosPublic";

export default function useLogin({ onSuccess, onError }) {
  const axiosPublic = useAxiosPublic();

  return useMutation({
    mutationKey: ["userLogin"],
    mutationFn: async (submissionData) => {
      const res = await axiosPublic.post(`/login/`, submissionData);
      return res?.data;
    },
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res);
    },
    onError: (err) => {
      if (onError) onError(err);
    },
  });
}
