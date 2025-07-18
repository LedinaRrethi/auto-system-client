import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInFormData,
  signInSchema,
} from "../../../utils/validations/signInSchema";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { EyeCloseIcon, EyeIcon } from "../../../assets/icons";
import Button from "../../../components/ui/button/Button";
import { login } from "../../../services/authService";
import { useLocation } from "react-router";
import Alert from "../../../components/ui/alert/Alert";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

   const { search } = useLocation();
  const params = new URLSearchParams(search);
  const registered = params.get("registered");


  const [showRegisteredAlert, setShowRegisteredAlert] = useState(
    registered === "true"
  );

  //const navigate = useNavigate();

 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      window.location.href = "/";
      //navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = () => {
    if (loginError) setLoginError("");
  };

  useEffect(() => {
    if (showRegisteredAlert) {
      const timer = setTimeout(() => {
        setShowRegisteredAlert(false);
      }, 5000); // 5 sekonda

      return () => clearTimeout(timer);
    }
  }, [showRegisteredAlert]);

  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="mb-4 sm:mb-4">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {showRegisteredAlert && (
            <Alert
              variant="info"
              title="Registration Successful"
              message="You can sign in once your account is approved by an administrator."
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-6 mt-4">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="name@gmail.com"
                  {...register("email")}
                  autoComplete="off"
                  onChange={handleFieldChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    autoComplete="off"
                    onChange={(e) => {
                      register("password").onChange(e);
                      handleFieldChange();
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginError && (
                <Alert
                  variant="error"
                  title="Login Failed"
                  message={loginError}
                />
              )}

              {/* Remember Me + Forgot */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-sm text-gray-700 dark:text-gray-400">Keep me logged in</span>
                </div>
                <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Forgot password?
                </Link>
              </div> */}

              {/* Submit Button */}
              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={isSubmitting}
              >
                Sign in
              </Button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
