import { IconButton } from "@radix-ui/themes";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { useTheme } from "../contexts/ThemeContext";
import SignUpForm from "../components/SignUpForm";

function SignUp() {
  const { theme } = useTheme();

  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <div
        className={`border-2 border-slate-200 px-4 py-6 rounded-xl w-full md:w-2/3 lg:w-1/3 flex flex-col justify-center items-center gap-4 mx-6 ${
          theme === "dark" ? "bg-neutral-900" : "bg-slate-100"
        }`}
      >
        <div className="w-3/4 mb-2 flex flex-col justify-center items-center gap-2">
          <IconButton radius="full" size="4">
            <LockClosedIcon />
          </IconButton>
          <h3 className="font-medium text-3xl mx-2 mb-2 text-center">
            Sign up
          </h3>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUp;
