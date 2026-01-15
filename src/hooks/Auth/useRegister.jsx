import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "../Axios/useAxiosPublic";

export default function useRegister({ onSuccess, onError }) {
  const axiosPublic = useAxiosPublic();

  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (submissionData) => {
      const res = await axiosPublic.post(`/signup/`, submissionData);
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
