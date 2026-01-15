import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useUpdateExistingVehicle({
  onSuccess,
  onError,
  vehicleId,
}) {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationKey: ["updateVehicle"],
    mutationFn: async (submittedData) => {
      const res = await axiosSecure.put(
        `/vehicles/${vehicleId}/`,
        submittedData
      );
      return res?.data;
    },
    enabled: !!vehicleId,
    onSuccess,
    onError,
  });
}
