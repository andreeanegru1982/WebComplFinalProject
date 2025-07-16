import { useLocation, useNavigate } from "react-router";
import { useAuthContext } from "./AuthContext";
import { useEffect } from "react";

export function useRedirectWhenLoggedIn(where: string = "/") {
  let destination = where;
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const { state }= useLocation();

  if(state?.from && typeof state?.from === 'string') {
    destination = state.from;
  }
 
  useEffect(() => {
    if (user) {
      navigate(destination);
    }
  }, [user, navigate, destination]);

  return Boolean(user);
}
