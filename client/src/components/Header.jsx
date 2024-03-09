import { Button } from "@radix-ui/themes";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

function Header() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { setToken } = useAuth();

  function handleClick() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  function handleLogout() {
    setToken("");
    navigate("/signIn");
    toast.success("Signed out successfully");
  }

  return (
    <div className="w-[95%] h-16 border-b-2 mx-3 mt-3 md:mx-8 md:px-10 border-slate-700 flex items-center gap-3 justify-between ">
      <div className="text-lg md:text-2xl uppercase font-semibold ">
        <span className="hidden md:block">Posts</span>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <div
          onClick={handleClick}
          className="hover:border-2 border-spacing-1 border-gray-400 p-3 flex justify-center items-center rounded-lg"
        >
          {theme !== "light" ? <SunIcon /> : <MoonIcon />}
        </div>

        <Button size="2" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Header;
