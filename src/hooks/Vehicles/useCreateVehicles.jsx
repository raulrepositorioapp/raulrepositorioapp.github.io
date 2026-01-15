import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useCreateVehicles({ onSuccess, onError }) {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationKey: ["createVehicle"],
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/vehicles/", data);
      return res?.data;
    },
    onSuccess,
    onError,
  });
}
