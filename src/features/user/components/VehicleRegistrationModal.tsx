import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { VehicleInput, vehicleSchema } from "../../../utils/validations/vehicleSchema";
import Form from "../../../components/form/Form";
import Alert from "../../../components/ui/alert/Alert";

interface Props {
  isOpen: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: VehicleInput, mode: "add" | "edit") => void;
  initialValues?: VehicleInput;
  mode: "add" | "edit";
  onClearError?: () => void;
}

export default function VehicleRegistrationModal({ isOpen, errorMessage,  onClose, onSubmit, initialValues, mode , onClearError}: Props) {

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<VehicleInput>({
  resolver: zodResolver(vehicleSchema),
  defaultValues: initialValues ?? {
    plateNumber: "",
    color: "",
    seatCount: 0,
    doorCount: 0,
    chassisNumber: "",
  },
});

const isDisabled = mode === "edit" || isSubmitting;

  useEffect(() => {
  if (isOpen) {
    reset(initialValues ?? {
      plateNumber: "",
      color: "",
      seatCount: 0,
      doorCount: 0,
      chassisNumber: "",
    });
  }
}, [initialValues, isOpen, reset]);


  const submitHandler = async (data: VehicleInput) => {
    try {
      onSubmit(data, mode);

      if (mode === "add") {
        reset();
      }
    } catch (error) {
      console.error("Modal - Submit error:", error);
    }
  };

  useEffect(() => {
  if (errorMessage && onClearError) {
    const timeout = setTimeout(() => {
      onClearError();
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [errorMessage, onClearError]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === "edit" ? "Update Vehicle Details" : "Register a New Vehicle"} >
      <div className="p-5 sm:p-6 w-full max-w-md">

        {errorMessage && (
      <div className="mb-4">
        <Alert variant="error" title="Error" message={errorMessage} />
      </div>
    )}

      
        <Form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
          <div>
            <Label>Plate Number *</Label>
            <Input
              {...register("plateNumber")}
              placeholder="e.g. AB123CD"
              error={!!errors.plateNumber}
              hint={errors.plateNumber?.message}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Color *</Label>
            <Input
              {...register("color")}
              placeholder="e.g. Red"
              error={!!errors.color}
              hint={errors.color?.message}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Seat Count *</Label>
            <Input
              type="number"
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              {...register("seatCount", { valueAsNumber: true })}
              error={!!errors.seatCount}
              hint={errors.seatCount?.message}  
            />
          </div>

          <div>
            <Label>Door Count *</Label>
            <Input
              type="number"
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              {...register("doorCount", { valueAsNumber: true })}
              error={!!errors.doorCount}
              hint={errors.doorCount?.message}
            />
          </div>

          <div>
            <Label>Chassis Number *</Label>
            <Input
              disabled={isDisabled}
              className={isDisabled ? "bg-gray-300 text-gray-900" : ""}
              {...register("chassisNumber")}
              placeholder="Enter chassis number"
              error={!!errors.chassisNumber}
              hint={errors.chassisNumber?.message}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : mode === "edit" ? "Submit Update Request" : "Submit Vehicle"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
