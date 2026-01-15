import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useUpdateDefaultVehicles({
  onSuccess,
  onError,
  vehicleId,
}) {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationKey: ["updateDefaultVehicle"],
    mutationFn: async (submittedData) => {
      const res = await axiosSecure.post(
        `/vehicles/${vehicleId}/customize/`,
        submittedData
      );
      return res?.data;
    },
    enabled: !!vehicleId,
    onSuccess,
    onError,
  });
}
