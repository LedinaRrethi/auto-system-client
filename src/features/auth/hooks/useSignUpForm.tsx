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
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      birthDate: undefined,
      acceptedTerms: false,
    },
  });

  useEffect(() => {
    const subscription = watch(() => {
      if (alertData) setAlertData(null);
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
        firstName: data.firstName.trim(),
        fatherName: data.fatherName.trim(),
        lastName: data.lastName.trim(),
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
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message = axiosErr?.response?.data?.message?.trim() ?? "Registration failed. Please try again.";
      const lowerMessage = message.toLowerCase();

      let fieldMatched = false;

      const fieldMappings: { keyword: string; field: keyof SignUpFormData }[] = [
        { keyword: "email", field: "email" },
        { keyword: "personal id", field: "personalId" },
        { keyword: "specialist number", field: "specialistNumber" },
        { keyword: "first name", field: "firstName" },
        { keyword: "father name", field: "fatherName" },
        { keyword: "last name", field: "lastName" },
      ];

      for (const { keyword, field } of fieldMappings) {
        if (lowerMessage.includes(keyword)) {
          setError(field, { type: "manual", message });
          fieldMatched = true;
          break;
        }
      }

      if (!fieldMatched) {
        setAlertData({
          variant: "error",
          title: "Registration Error",
          message,
        });
      }
    }
  };

  return {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    setError,
    reset,
    alertData,
    setAlertData,
    showPassword,
    setShowPassword,
    directorateOptions,
    onSubmit,
  };
}
