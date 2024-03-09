import { Avatar, Button, Flex, Link, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useForm } from "react-hook-form";
import { REACT_APP_BASE_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { EyeClosedIcon, Pencil2Icon } from "@radix-ui/react-icons";

function SignUpForm() {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    const { userName, email, password } = data;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/users/register`,
        {
          userName,
          email,
          password,
          image: avatarFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      reset();
      toast.success("Registration success full");
      navigate("/signIn");
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      className="flex flex-col gap-6  w-[80%] justify-center items-center"
    >
      {/* avatar */}
      <Flex gap="2" style={{ position: "relative", bottom: "2px solid red" }}>
        <Avatar
          src={avatarFile ? URL.createObjectURL(avatarFile) : ""}
          fallback="A"
          radius="full"
          size="7"
        />

        <div>
          <label
            htmlFor="avatarInput"
            className="icon-button absolute right-2 bottom-2 "
          >
            <Pencil2Icon width="30" height="30" />
          </label>
          <input
            id="avatarInput"
            type="file"
            className="hidden"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>
      </Flex>

      {/* userName */}
      <div className="w-full  flex flex-col gap-1">
        <label className="">Full Name</label>
        <TextField.Root size="3">
          <TextField.Input
            type="name"
            disabled={isLoading}
            placeholder="Full name *"
            {...register("userName", {
              required: "Name is required",
            })}
          />
        </TextField.Root>
      </div>
      <div className="w-full  flex flex-col gap-1">
        <label className="">Email</label>
        <TextField.Root size="3">
          <TextField.Input
            type="email"
            disabled={isLoading}
            placeholder="Email address *"
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
      <div className="w-full  flex flex-col gap-1">
        <label>Password</label>
        <TextField.Root size="3">
          <TextField.Input
            type={showPassword === true ? "text" : "password"}
            disabled={isLoading}
            placeholder="Password *"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value:
                  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])/,
                message:
                  "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character",
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
          <p className="text-red-300">{errors.password.message}</p>
        )}
      </div>

      <div className="  w-full text-blue-400 text-sm flex flex-col items-center px-2">
        <div className=" w-full  flex gap-3">
          <input
            type="checkbox"
            id="dog"
            value="dog"
            {...register("terms", {
              required: true,
            })}
          />
          <label htmlFor="dog">Accept terms and conditions</label>
        </div>
        {errors.terms && (
          <Text className="text-red-300">
            Please accept terms and conditions
          </Text>
        )}
      </div>

      <div>
        <Button size="4" disabled={isLoading}>
          Sign up
        </Button>
      </div>

      <div className="w-full flex justify-between ">
        <Link size="2" color="blue" onClick={() => navigate("/forgotPassword")}>
          Forgot Password?
        </Link>
        <Link size="2" color="blue" onClick={() => navigate("/signIn")}>
          {`Already have an account? Sign In`}
        </Link>
      </div>
    </form>
  );
}

export default SignUpForm;
