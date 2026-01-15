import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";

export default function usePdfExport({ id }) {
  const axiosSecure = useAxiosSecure();

  const {
    data: pdfExport,
    isLoading: isPdfExportLoading,
    isError: isPdfExportError,
  } = useQuery({
    queryKey: ["pdfExport"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/${id}/download/?type=pdf`);
      return res.data;
    },
    enabled: !!id,
  });

  return { pdfExport, isPdfExportLoading, isPdfExportError };
}
