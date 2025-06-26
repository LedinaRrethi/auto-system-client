import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "../../../utils/validations/signUpSchema";
import { Directorate } from "../../../types/Directorate";
import { getDirectorates } from "../../../services/directoryService";
import { registerUser } from "../../../services/authService";
import { AxiosError } from "axios";
import { UserRole } from "../../../types/RegisterDTO";

export function useSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [directorateOptions, setDirectorateOptions] = useState<{ label: string; value: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      birthDate: undefined,
      acceptedTerms: false,
    },
  });

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name && alertData?.message?.toLowerCase().includes(name)) {
        setAlertData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, alertData]);

  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const data: Directorate[] = await getDirectorates();
        const options = data.map((d) => ({
          label: d.directoryName,
          value: d.id,
        }));
        setDirectorateOptions(options);
      } catch (error) {
        console.error("Error fetching directorates:", error);
      }
    };

    fetchDirectorates();
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerUser({
        firstName: data.fname.trim(),
        fatherName: data.fathername.trim(),
        lastName: data.lname.trim(),
        birthDate: data.birthDate?.toISOString() ?? "",
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: UserRole[data.role],
        specialistNumber: data.specialistNumber?.trim() || undefined,
        directorateId: data.directorate || undefined,
        personalId: data.personalId,
      });

      setAlertData({
        variant: "success",
        title: "Success",
        message: "Registration successful! Redirecting to login...",
      });

      reset();
      setTimeout(() => {
        window.location.href = "/signin?registered=true";
      }, 2000);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      const message = axiosErr?.response?.data?.error ?? "Registration failed. Please try again.";

      setAlertData({
        variant: "error",
        title: "Registration Error",
        message,
      });
    }
  };

  return {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    reset,
    alertData,
    setAlertData,
    showPassword,
    setShowPassword,
    directorateOptions,
    onSubmit,
  };
}