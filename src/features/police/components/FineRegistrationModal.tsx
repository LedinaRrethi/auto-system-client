import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FineCreateFormInput } from "../../../types/Fine/FineCreateFormInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Form from "../../../components/form/Form";
import { fineSchema } from "../../../utils/validations/fineSchema";
import { fetchVehicleDetails } from "../../../services/vehicleService"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FineCreateFormInput) => void;
}

export default function FineRegistrationModal({ isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FineCreateFormInput>({
    resolver: zodResolver(fineSchema),
    mode: "onSubmit",
  });

  const plateNumber = watch("plateNumber");

  useEffect(() => {
    const loadVehicleOwner = async () => {
      if (!plateNumber) return;
      try {
        const vehicle = await fetchVehicleDetails(plateNumber);
        if (vehicle?.owner) {
          setValue("firstName", vehicle.owner.firstName);
          setValue("lastName", vehicle.owner.lastName);
          setValue("fatherName", vehicle.owner.fatherName);
          setValue("personalId", vehicle.owner.personalId);
          setValue("phoneNumber", vehicle.owner.phoneNumber);
        }
      } catch (error) {
        console.warn("Vehicle not found or error fetching data", error);
      }
    };
    loadVehicleOwner();
  }, [plateNumber, setValue]);

  const submitHandler = (data: FineCreateFormInput) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5 sm:p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Register Fine
        </h2>

        <Form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
          <div>
            <Label>Plate Number</Label>
            <Input
              {...register("plateNumber")}
              placeholder="e.g. AB123CD"
              error={!!errors.plateNumber}
              hint={errors.plateNumber?.message}
            />
          </div>

          <div>
            <Label>Fine Amount</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              {...register("fineAmount", { valueAsNumber: true })}
              error={!!errors.fineAmount}
              hint={errors.fineAmount?.message}
            />
          </div>

          <div>
            <Label>Fine Reason</Label>
            <Input
              {...register("fineReason")}
              placeholder="Optional"
              error={!!errors.fineReason}
              hint={errors.fineReason?.message}
            />
          </div>

          <div>
            <Label>First Name</Label>
            <Input
              {...register("firstName")}
              placeholder="Owner's first name"
              error={!!errors.firstName}
              hint={errors.firstName?.message}
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              {...register("lastName")}
              placeholder="Owner's last name"
              error={!!errors.lastName}
              hint={errors.lastName?.message}
            />
          </div>

          <div>
            <Label>Father Name</Label>
            <Input
              {...register("fatherName")}
              placeholder="Optional"
              error={!!errors.fatherName}
              hint={errors.fatherName?.message}
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              {...register("phoneNumber")}
              placeholder="Optional"
              error={!!errors.phoneNumber}
              hint={errors.phoneNumber?.message}
            />
          </div>

          <div>
            <Label>Personal ID</Label>
            <Input
              {...register("personalId")}
              placeholder="Optional"
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
