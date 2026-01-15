import axios from "axios";
import { toast } from "react-hot-toast";

const useAxiosPublic = () => {
  const baseURL = `${import.meta.env.VITE_BASE_URL}`;
  const axiosPublic = axios.create({
    baseURL: baseURL,
    timeout: 30000,
  });

  axiosPublic.interceptors.response.use(
    (response) => response,
    (error) => {
      let errorMessage;
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Internal server error, try again";
          toast.error(errorMessage);
        }
        console.error("API Error:", error);
      } else if (error.request) {
        errorMessage = "Network issue, try again.";
        toast.error(errorMessage);
        console.error("Network Error:", error?.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosPublic;
};

export default useAxiosPublic;
