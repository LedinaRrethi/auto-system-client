import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Form from "../../../components/form/Form";
import { fineSchema, FineCreateFormInput } from "../../../utils/validations/fineSchema";
import { fetchVehicleOwnerDetails } from "../../../services/fineService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FineCreateFormInput) => Promise<boolean>;
}

export default function FineRegistrationModal({ isOpen, onClose, onSubmit }: Props) {
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

  const handlePlateCheck = async () => {
    if (!plateNumber.trim()) return;
    try {
      const data = await fetchVehicleOwnerDetails(plateNumber.trim());

      if (data.isFrom !== "Manual") {
        setIsDisabled(true);
        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("fatherName", data.fatherName);
        setValue("phoneNumber", data.phoneNumber);
        setValue("personalId", data.personalId ?? "");
      } else {
        setIsDisabled(false);
        setValue("firstName", "");
        setValue("lastName", "");
        setValue("fatherName", "");
        setValue("phoneNumber", "");
        setValue("personalId", "");
      }
    } catch {
      alert("Error fetching vehicle owner data.");
    }
  };

  const handlePlateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePlateCheck();
    }
  };

  const submitHandler = async (data: FineCreateFormInput) => {
    const success = await onSubmit(data);
    if (success) {
      alert("Fine successfully submitted.");
      reset();
      setIsDisabled(false);
      onClose();
    } else {
      alert("Error submitting fine.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Fine">
      <div className="p-5 sm:p-6 w-full max-w-md">
        <Form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
          <div>
            <Label>Plate Number</Label>
            <Input
              {...register("plateNumber")}
              placeholder="e.g. AB123CD"
              onKeyDown={handlePlateKeyDown}
              error={!!errors.plateNumber}
              hint={errors.plateNumber?.message}
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
            />
          </div>

          <div>
            <Label>Fine Reason</Label>
            <Input {...register("fineReason")} />
          </div>

          <div>
            <Label>First Name</Label>
            <Input {...register("firstName")} disabled={isDisabled} />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input {...register("lastName")} disabled={isDisabled} />
          </div>

          <div>
            <Label>Father Name</Label>
            <Input {...register("fatherName")} disabled={isDisabled} />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input {...register("phoneNumber")} disabled={isDisabled} />
          </div>

          <div>
            <Label>Personal ID</Label>
            <Input
              {...register("personalId")}
              disabled={isDisabled}
              error={!!errors.personalId}
              hint={errors.personalId?.message}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Submit Fine
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
