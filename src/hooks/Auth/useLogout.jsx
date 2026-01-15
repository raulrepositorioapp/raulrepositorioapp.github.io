import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { useDispatch } from "react-redux";
import { userToken } from "@/Redux/userTokenSlice";
import { userData } from "@/Redux/userDataSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function useLogout() {
  // Global States
  const axiosSecure = useAxiosSecure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["userLogout"],
    mutationFn: async (submissionData) => {
      const res = await axiosSecure.post(`/logout/`, submissionData);
      return res?.data;
    },
    onSuccess: (res) => {
      toast.success("Logout Successful!");
      // Clear UserStates
      dispatch(userToken(null));
      dispatch(userData(null));
      localStorage.removeItem("raaul_TokenData");
      localStorage.removeItem("raaul_userData");

      navigate("/auth");
    },
    onError: (err) => {
      toast.success("Something went wrong! But you have been logged out.");

      // Clear UserStates
      dispatch(userToken(null));
      dispatch(userData(null));
      localStorage.removeItem("raaul_TokenData");
      localStorage.removeItem("raaul_userData");

      navigate("/auth");
    },
  });
}
