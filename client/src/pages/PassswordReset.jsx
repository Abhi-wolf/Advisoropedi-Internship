import { Separator } from "@radix-ui/themes";
import { useTheme } from "../contexts/ThemeContext";
import PasswordResetForm from "../components/PasswordResetForm";

function PasswordReset() {
  const { theme } = useTheme();
  console.log(theme);

  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <div
        className={`border-2 border-slate-200 px-4 py-6 rounded-xl w-full md:w-2/3 lg:w-1/3 flex flex-col justify-center items-center gap-4 mx-6 ${
          theme === "dark" ? "bg-neutral-900" : "bg-slate-100"
        }`}
      >
        <div className="w-3/4 mb-2 ">
          <h3 className="font-medium text-3xl mx-2 mb-2 text-center">
            Password Rest
          </h3>
          <Separator orientation="horizontal" size="4" />
        </div>
        <PasswordResetForm />
      </div>
    </div>
  );
}

export default PasswordReset;
