import { userData } from "@/Redux/userDataSlice";
import { userToken } from "@/Redux/userTokenSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAxiosSecure = () => {
  // Base URL and Access Token
  const baseURL = `${import.meta.env.VITE_BASE_URL}`;
  const accessToken = useSelector((state) => state?.userToken?.tokens?.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Axios Instance
  const axiosSecure = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      let errorMessage = "Something went wrong!!!";
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Session expired. Please log in again.";
          toast.error(errorMessage);

          // Clear UserStates
          dispatch(userToken(null));
          dispatch(userData(null));

          // Clear localStorage
          localStorage.removeItem("raaul_TokenData");
          localStorage.removeItem("raaul_userData");

          // Navigate to login
          navigate("/auth/login");
        } else if (error.response.status === 500) {
          errorMessage = "Internal server error, try again.";
          toast.error(errorMessage);
        }
      } else if (error.request) {
        errorMessage = "Network issue, try again.";
        toast.error(errorMessage);
      } else {
        errorMessage = "Request failed.";
        toast.error(errorMessage);
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
