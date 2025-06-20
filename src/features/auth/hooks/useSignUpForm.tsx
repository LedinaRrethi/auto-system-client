import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "../../../utils/validations/signUpSchema";
import { Directorate } from "../../../types/Directorate";
import { getDirectorates } from "../../../services/directoryService";
import { registerUser } from "../../../services/authService";
import { AxiosError } from "axios";

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
    formState: { errors  },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      birthDate: undefined,
      acceptedTerms: false,
    },
  });

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name === "email" && alertData?.message?.toLowerCase().includes("email")) {
        setAlertData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, alertData, setAlertData]);

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
        firstName: data.fname,
        fatherName: data.fathername,
        lastName: data.lname,
        birthDate: data.birthDate,
        email: data.email,
        personalId: data.personalId,
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
      setTimeout(() => {
        window.location.href = "/signin?registered=true";
      }, 4000);
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