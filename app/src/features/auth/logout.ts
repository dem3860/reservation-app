import Cookies from "js-cookie";

export const handleLogout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("role"); // ロールも消す場合
  window.location.href = "/login"; // or router.push
};
