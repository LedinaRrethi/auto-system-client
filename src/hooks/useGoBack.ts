import { useNavigate } from "react-router";

const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      const token = sessionStorage.getItem("authToken");
      navigate(token ? "/" : "/signin");
    }
  };

  return goBack;
};

export default useGoBack;
