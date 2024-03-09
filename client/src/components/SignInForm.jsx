import { Button, Link, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { REACT_APP_BASE_URL } from "../../constants";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { EyeClosedIcon } from "@radix-ui/react-icons";

function SignInForm() {
  const navigate = useNavigate();
  const { setToken, setNewUser } = useAuth();
  const [axiosError, setAxiosError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    console.log(data.email);
    const { email, password } = data;
    setIsLoading(true);
    try {
      const response = await axios.post(`${REACT_APP_BASE_URL}/users/login`, {
        email,
        password,
      });
      setToken(response.data.accessToken);
      setNewUser(response.data.id);
      console.log(response.data);
      reset();
      toast.success("Signed in successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      setAxiosError(err.response.data.message);
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      className="flex flex-col gap-4 text-xl w-[80%] justify-center items-center"
    >
      <div className="w-full  flex flex-col gap-2">
        <label className="">Email</label>
        <TextField.Root size="3">
          <TextField.Input
            type="email"
            disabled={isLoading}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
          />
        </TextField.Root>
        {errors.email && (
          <Text className="text-red-300">Please enter correct email</Text>
        )}
      </div>
      <div className="w-full  flex flex-col gap-2">
        <label>Password</label>
        <TextField.Root size="3">
          <TextField.Input
            type={showPassword === true ? "text" : "password"}
            disabled={isLoading}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />

          <div className=" flex justify-center items-center text-red-600 pr-2">
            <EyeClosedIcon
              width="25"
              height="25"
              color="red"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </TextField.Root>
        {errors.password && (
          <Text className="text-red-300">Please enter correct password</Text>
        )}
      </div>

      <div>
        <Button size="4" disabled={isLoading}>
          Sign in
        </Button>
      </div>

      {axiosError && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-red-800 capitalize font-semibold">{axiosError}</p>
          <Link
            size="2"
            color="green"
            className="font-semibold underline underline-offset-2 uppercase"
            onClick={() => {
              setAxiosError("");
              reset();
            }}
          >
            Try Again
          </Link>
        </div>
      )}

      <div className="w-full flex justify-between ">
        <Link size="2" color="blue" onClick={() => navigate("/forgotPassword")}>
          Forgot Password?
        </Link>
        <Link size="2" color="blue" onClick={() => navigate("/signUp")}>
          {`Don't have an account? Sign Up`}
        </Link>
      </div>
    </form>
  );
}

export default SignInForm;
