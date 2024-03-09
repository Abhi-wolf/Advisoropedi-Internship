import { Button, Link, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { REACT_APP_BASE_URL } from "../../constants";
import { useState } from "react";
import { toast } from "sonner";

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [axiosError, setAxiosError] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    console.log(data.email);
    const { email } = data;

    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/users/forgotPassword`,
        {
          email,
        }
      );
      console.log(response.data);
      reset();
      toast.success("Email sent successfully");
      navigate("/resetPassword");
    } catch (err) {
      console.log(err);
      setAxiosError(err.response.data.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-xl w-[80%] justify-center items-center"
    >
      <div className="w-full  flex flex-col gap-2">
        <label className="">Email</label>
        <TextField.Root size="3">
          <TextField.Input
            type="email"
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

      <div>
        <Button size="4">Send Email</Button>
      </div>

      {axiosError && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-red-800 capitalize font-semibold">{axiosError}</p>
        </div>
      )}

      <div className="w-full flex justify-between ">
        <Link size="2" color="blue" onClick={() => navigate("/signIn")}>
          {`Already have an account? Sign In`}
        </Link>
        <Link size="2" color="blue" onClick={() => navigate("/signUp")}>
          {`Don't have an account? Sign Up`}
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
