import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useUserGuard = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const role = Cookies.get("role");

    if (token && (role === "ADMIN" || role === "USER")) {
      setIsAuthorized(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  return isAuthorized;
};
