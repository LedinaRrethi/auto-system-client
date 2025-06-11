import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "../../validations/signUpSchema";
import { SubmitHandler } from "react-hook-form";
import DatePicker from "../form/date-picker";
import Alert from "../ui/alert/Alert";
import { registerUser } from "../../utils/auth";
import Select from "../form/Select";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      await registerUser({
        firstName: data.fname,
        fatherName: data.fathername,
        lastName: data.lname,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
        role: data.role,
        specialistNumber: data.specialistNumber,
        directorate: data.directorate,
      });

      setAlertData({
        variant: "success",
        title: "Success",
        message: "Registration successful! You can now log in.",
      });

      reset();

      console.log("Submitted, redirecting to Sign In...");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        setAlertData({
          variant: "error",
          title: "Registration Error",
          message: (err as { response: { data: { error: string } } }).response
            .data.error,
        });
      } else {
        setAlertData({
          variant: "error",
          title: "Registration Error",
          message: "Registration failed. Please try again.",
        });
      }
    }
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

        {alertData && (
          <div className="mb-4">
            <Alert
              variant={alertData.variant}
              title={alertData.title}
              message={alertData.message}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <Label>
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("fname")}
                  placeholder="Enter your first name"
                />
                {errors.fname && (
                  <p className="text-sm text-red-500">{errors.fname.message}</p>
                )}
              </div>

              {/* Father Name */}
              <div>
                <Label>
                  Father Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("fathername")}
                  placeholder="Enter your father name"
                />
                {errors.fathername && (
                  <p className="text-sm text-red-500">
                    {errors.fathername.message}
                  </p>
                )}
              </div>
            </div>

            {/* Last Name + Birthdate */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Last Name */}
              <div>
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("lname")}
                  placeholder="Enter your last name"
                />
                {errors.lname && (
                  <p className="text-sm text-red-500">{errors.lname.message}</p>
                )}
              </div>

              {/* Birthdate */}
              <div>
                <Label>
                  Birthdate<span className="text-error-500">*</span>
                </Label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="birthDate"
                      mode="single"
                      placeholder="dd/MM/yyyy"
                      defaultDate={field.value ?? undefined}
                      onChange={([date]) => field.onChange(date)}
                      maxDate={new Date()}
                    />
                  )}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Role Dropdown */}
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <div>
                  <Label>
                    Role<span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={[
                      { label: "Individ", value: "Individ" },
                      { label: "Polic", value: "Polic" },
                      { label: "Specialist", value: "Specialist" },
                    ]}
                    placeholder="Select role"
                    onChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  />
                  {errors.role && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Specialist Number */}
            {watch("role") === "Specialist" && (
              <div>
                <Label>
                  Specialist Number<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("specialistNumber")}
                  placeholder="Enter specialist number"
                />
                {errors.specialistNumber && (
                  <p className="text-sm text-red-500">
                    {errors.specialistNumber.message}
                  </p>
                )}
              </div>
            )}

            {/* Directorate Dropdown */}
            {watch("role") === "Specialist" && (
              <Controller
                name="directorate"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>
                      Directorate<span className="text-error-500">*</span>
                    </Label>
                    <Select
                      options={[
                        { label: "Tirana", value: "Tirana" },
                        { label: "Durres", value: "Durres" },
                        { label: "Shkoder", value: "Shkoder" },
                      ]}
                      placeholder="Select directorate"
                      onChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    />
                    {errors.directorate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.directorate.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {/* Email */}
            <div>
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>
                Password<span className="text-error-500">*</span>
              </Label>
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
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>
                Confirm Password<span className="text-error-500">*</span>
              </Label>
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
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
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
                <span className="font-semibold text-brand-500">
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-500">
                {errors.acceptedTerms.message}
              </p>
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
