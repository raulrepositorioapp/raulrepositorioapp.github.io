import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function useGetAllVehicles() {
  const axiosSecure = useAxiosSecure();

  const {
    data: vehicles,
    isLoading: isAllVehiclesLoading,
    isError: isAllVehiclesError,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/vehicles/`);
      return res.data;
    },
  });

  return { vehicles, isAllVehiclesLoading, isAllVehiclesError };
}
