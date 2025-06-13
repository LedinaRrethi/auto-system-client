import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { VehicleInput, vehicleSchema } from "../../../utils/validations/vehicleSchema";
import Form from "../../../components/form/Form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleInput, mode: "add" | "edit") => void;
  initialValues?: VehicleInput;
  mode: "add" | "edit";
}

export default function VehicleRegistrationModal({ isOpen, onClose, onSubmit, initialValues, mode }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  // 🔁 Reset form fields whenever initialValues change
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset(); // for "add" mode, clear the form
    }
  }, [initialValues, reset]);

  const submitHandler = (data: VehicleInput) => {
    onSubmit(data, mode);
    if (mode === "add") reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5 sm:p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          {mode === "edit" ? "Edit Vehicle" : "Register a New Vehicle"}
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
            <Label>Color</Label>
            <Input {...register("color")} placeholder="e.g. Red" error={!!errors.color} hint={errors.color?.message} />
          </div>

          <div>
            <Label>Seat Count</Label>
            <Input
              type="number"
              min={1}
              {...register("seatCount", { valueAsNumber: true })}
              error={!!errors.seatCount}
              hint={errors.seatCount?.message}
            />
          </div>

          <div>
            <Label>Doors</Label>
            <Input
              type="number"
              min={1}
              {...register("doorCount", { valueAsNumber: true })}
              error={!!errors.doorCount}
              hint={errors.doorCount?.message}
            />
          </div>

          <div>
            <Label>Chassis Number</Label>
            <Input
              {...register("chassisNumber")}
              placeholder="e.g. XYZ123456789"
              error={!!errors.chassisNumber}
              hint={errors.chassisNumber?.message}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              {mode === "edit" ? "Save Changes" : "Submit Vehicle"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
