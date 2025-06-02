import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "../../validations/signUpSchema";
import { SubmitHandler } from "react-hook-form";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      birthDate: undefined,
      acceptedTerms: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    console.log("Submitted data:", data);
    reset();
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please fill in the form below with accurate personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {/* First and Last Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name<span className="text-error-500">*</span></Label>
                <Input {...register("fname")} placeholder="Enter your first name" />
                {errors.fname && <p className="text-sm text-red-500">{errors.fname.message}</p>}
              </div>
              <div>
                <Label>Last Name<span className="text-error-500">*</span></Label>
                <Input {...register("lname")} placeholder="Enter your last name" />
                {errors.lname && <p className="text-sm text-red-500">{errors.lname.message}</p>}
              </div>
            </div>

            {/* Birthdate */}
            <div>
              <Label>Birthdate<span className="text-error-500">*</span></Label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ?? null}
                    onChange={field.onChange}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    placeholderText="dd/MM/yyyy"
                    showPopperArrow={false}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    calendarClassName="!bg-white dark:!bg-gray-800 !shadow-lg !rounded-lg !border !border-gray-200 dark:!border-gray-700"
                    dayClassName={() =>
                      "text-sm px-2 py-1 rounded-md hover:bg-brand-100 dark:hover:bg-gray-700"
                    }
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email<span className="text-error-500">*</span></Label>
              <Input {...register("email")} type="email" placeholder="Enter your email" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label>Password<span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm Password<span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("acceptedTerms")}
                id="acceptedTerms"
                className="w-5 h-5"
              />
              <label htmlFor="acceptedTerms" className="text-sm text-gray-500">
                By creating an account, you agree to the{" "}
                <span className="font-semibold text-brand-500">Terms</span> and{" "}
                <span className="font-semibold text-brand-500">Privacy Policy</span>.
              </label>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-500">{errors.acceptedTerms.message}</p>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
