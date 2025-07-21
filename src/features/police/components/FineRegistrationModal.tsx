import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import {
  fineSchema,
  FineCreateFormInput,
} from "../../../utils/validations/fineSchema";
import { fetchVehicleOwnerDetails } from "../../../services/fineService";
import { useEffect, useRef, useCallback } from "react";
import Alert from "../../../components/ui/alert/Alert";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FineCreateFormInput) => Promise<boolean>;
  formErrorMessage?: string | null;
  onClearFormError?: () => void;
}

export default function FineRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  formErrorMessage,
  onClearFormError,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FineCreateFormInput>({
    resolver: zodResolver(fineSchema),
    defaultValues: {
      plateNumber: "",
      fineAmount: 0,
      fineReason: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      phoneNumber: "",
      personalId: "",
    },
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const plateNumber = watch("plateNumber");

  const debounceTimeout = useRef<number | null>(null);

  const handlePlateCheck = useCallback(async () => {
    if (!plateNumber.trim()) return;

    const data = await fetchVehicleOwnerDetails(plateNumber.trim());

    if (data.isFrom !== "Manual") {
      setIsDisabled(true);
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("fatherName", data.fatherName);
      setValue("phoneNumber", data.phoneNumber);
      setValue("personalId", data.personalId);
    } else {
      setIsDisabled(false);
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("fatherName", "");
      setValue("phoneNumber", "");
      setValue("personalId", "");
    }
  }, [plateNumber, setValue]);

  const handlePlateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePlateCheck();
    }
  };

  const submitHandler = handleSubmit(async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
      setIsDisabled(false);
      onClose();
    }
  });

  useEffect(() => {
    const trimmed = plateNumber.trim();
    const isValid =
      trimmed.length === 7 && /^[A-Z]{2}\d{3}[A-Z]{2}$/i.test(trimmed);

    if (isValid) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      debounceTimeout.current = window.setTimeout(() => {
        handlePlateCheck();
      }, 100);
    } else {
      setIsDisabled(false);
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("fatherName", "");
      setValue("phoneNumber", "");
      setValue("personalId", "");
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [plateNumber, handlePlateCheck, setValue]);

  useEffect(() => {
    if (formErrorMessage && onClearFormError) {
      const timeout = setTimeout(() => onClearFormError(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [formErrorMessage, onClearFormError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Fine">
      <div className="w-full max-w-md mx-auto">
        {formErrorMessage && (
          <div className="mb-4">
            <Alert variant="error" title="Error" message={formErrorMessage} />
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <Label>Plate Number</Label>
            <Input
              {...register("plateNumber")}
              placeholder="e.g. AB123CD"
              autoComplete="off"
              onKeyDown={handlePlateKeyDown}
              error={!!errors.plateNumber}
              hint={errors.plateNumber?.message}
            />
          </div>

          <div>
            <Label>Personal ID</Label>
            <Input
              {...register("personalId")}
              readOnly={isDisabled}
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              error={!!errors.personalId}
              hint={errors.personalId?.message}
              autoComplete="off"
            />
          </div>

          <div>
            <Label>Fine Amount</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              {...register("fineAmount", { valueAsNumber: true })}
              error={!!errors.fineAmount}
              hint={errors.fineAmount?.message}
              autoComplete="off"
            />
          </div>

          <div>
            <Label>Fine Reason</Label>
            <Input
              {...register("fineReason")}
              error={!!errors.fineReason}
              hint={errors.fineReason?.message}
              autoComplete="off"
            />
          </div>

          <div>
            <Label>First Name</Label>
            <Input
              {...register("firstName")}
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              error={!!errors.firstName}
              hint={errors.firstName?.message}
              autoComplete="off"
            />
          </div>

          <div>
            <Label>Father Name</Label>
            <Input
              {...register("fatherName")}
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              error={!!errors.fatherName}
              hint={errors.fatherName?.message}
              autoComplete="off"
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              {...register("lastName")}
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              error={!!errors.lastName}
              hint={errors.lastName?.message}
              autoComplete="off"
            />
          </div>

          <div className="pt-3 pb-3">
            <Button type="submit" className="w-full">
              Submit Fine
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
