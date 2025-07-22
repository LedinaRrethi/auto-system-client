import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import Alert from "../../../components/ui/alert/Alert";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import Select from "../../../components/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../assets/icons";
import { useSignUpForm } from "../hooks/useSignUpForm";
import TermsModal from "./TermsModal";
import { useState } from "react";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    alertData,
    showPassword,
    setShowPassword,
    directorateOptions,
    onSubmit,
  } = useSignUpForm();

  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mt-2 mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Please fill in the form below with accurate personal information.
          </p>
        </div>

        {alertData && (
          <div className="mb-4">
            <Alert variant={alertData.variant} title={alertData.title} message={alertData.message} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" spellCheck="false" noValidate>

          {/* fake inputs , trick browser to not autofill input fieldss */}
          <input type="text" name="fake_user" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fake_pass" autoComplete="current-password" style={{ display: "none" }} />

          <div className="space-y-5">
            <div className="pt-2 pb-2 text-lg font-semibold text-gray-700 uppercase tracking-wide dark:text-white">
              PERSONAL INFORMATION
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("firstName")}
                  autoComplete="off"
                  inputMode="none"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label>
                  Father Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("fatherName")}
                  autoComplete="off"
                  inputMode="none"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  placeholder="Enter your father name"
                />
                {errors.fatherName && <p className="text-sm text-red-500">{errors.fatherName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  {...register("lastName")}
                  autoComplete="off"
                  inputMode="none"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>

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
                {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
              </div>
            </div>

            <div>
              <Label> 
                Personal Id<span className="text-error-500">*</span>
              </Label>
              <Input
                {...register("personalId")}
                autoComplete="off"
                inputMode="none"
                readOnly
                onFocus={(e) => e.target.readOnly = false}
                placeholder="Enter your national ID number"
              />
              {errors.personalId && <p className="text-sm text-red-500">{errors.personalId.message}</p>}
            </div>

            <div className="pt-2 pb-2 text-lg font-semibold text-gray-700 uppercase tracking-wide dark:text-white">
              ACCOUNT INFORMATION
            </div>

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
                      { label: "Individual", value: "Individ" },
                      { label: "Police", value: "Police" },
                      { label: "Specialist", value: "Specialist" },
                    ]}
                    placeholder="Select role"
                    onChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  />
                  {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
                </div>
              )}
            />

            {watch("role") === "Specialist" && (
              <>
                <div>
                  <Label> 
                    Specialist Number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    {...register("specialistNumber")}
                    autoComplete="off"
                    inputMode="none"
                    readOnly
                    onFocus={(e) => e.target.readOnly = false}
                    placeholder="Enter specialist number"
                  />
                  {errors.specialistNumber && <p className="text-sm text-red-500">{errors.specialistNumber.message}</p>}
                </div>

                <Controller
                  name="directorate"
                  control={control}
                  rules={{ required: "Directorate is required" }}
                  render={({ field }) => (
                    <div>
                      <Label>
                        Directorate<span className="text-error-500">*</span>
                      </Label>
                      <Select
                        options={directorateOptions}
                        placeholder="Select directorate"
                        onChange={field.onChange}
                        value={field.value}
                      />
                      {errors.directorate && <p className="text-sm text-red-500 mt-1">{errors.directorate.message}</p>}
                    </div>
                  )}
                />
              </>
            )}

            <div>
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                {...register("email")}
                type="email"
                autoComplete="new-password"
                inputMode="none"
                readOnly
                onFocus={(e) => e.target.readOnly = false}
                placeholder="name@domain.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label>
                Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...register("signupPassword")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  inputMode="none"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  placeholder="Enter your password"
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                  )}
                </span>
              </div>
              {errors.signupPassword && <p className="text-sm text-red-500">{errors.signupPassword.message}</p>}
            </div>

            <div>
              <Label>
                Confirm Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  inputMode="none"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  placeholder="Confirm your password"
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                  )}
                </span>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center gap-3 pt-1 ">
              <input type="checkbox" {...register("acceptedTerms")} id="acceptedTerms" className="w-5 h-5" />
              <label htmlFor="acceptedTerms" className="text-sm text-gray-500">
                By creating an account, you agree to the{" "}
                <span 
                  onClick={() => setShowTerms(true)} 
                  className="text-brand-500 font-semibold hover:underline cursor-pointer"
                >
                  Terms and Privacy Policy
                </span>
                .
              </label>
            </div>
            {errors.acceptedTerms && <p className="text-sm text-red-500">{errors.acceptedTerms.message}</p>}

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
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-300 sm:text-start">
            Already have an account?{" "}
            <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
