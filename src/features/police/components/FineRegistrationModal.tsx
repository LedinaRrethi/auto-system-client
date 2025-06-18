import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Form from "../../../components/form/Form";
import { fetchVehicleOwnerDetails } from "../../../services/fineService";
import { FineCreate } from "../../../types/Fine/FineCreate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FineCreate) => void;
}

export default function FineRegistrationModal({ isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<FineCreate>({
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

  const plateNumber = watch("plateNumber");

  useEffect(() => {
    const loadOwner = async () => {
      if (!plateNumber || plateNumber.length < 3) return;

      try {
        const data = await fetchVehicleOwnerDetails(plateNumber);
        if (data.isFrom !== "Manual") {
          setValue("firstName", data.firstName);
          setValue("lastName", data.lastName);
          setValue("fatherName", data.fatherName);
          setValue("phoneNumber", data.phoneNumber);
          setValue("personalId", data.personalId);
        } else {
          setValue("firstName", "");
          setValue("lastName", "");
          setValue("fatherName", "");
          setValue("phoneNumber", "");
          setValue("personalId", "");
        }
      } catch {
        setValue("firstName", "");
        setValue("lastName", "");
        setValue("fatherName", "");
        setValue("phoneNumber", "");
        setValue("personalId", "");
      }
    };

    loadOwner();
  }, [plateNumber, setValue]);

  const submitHandler = (data: FineCreate) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Fine">
       <div className="p-5 sm:p-6 w-full max-w-md">
        
        <Form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
          <div>
            <Label>Plate Number</Label>
            <Input {...register("plateNumber")} placeholder="e.g. AB123CD" />
          </div>

          <div>
            <Label>Fine Amount</Label>
            <Input type="number" step="0.01" min={0} {...register("fineAmount")} />
          </div>

          <div>
            <Label>Fine Reason</Label>
            <Input {...register("fineReason")} placeholder="e.g. Speeding" />
          </div>

          <div>
            <Label>First Name</Label>
            <Input {...register("firstName")} />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input {...register("lastName")} />
          </div>

          <div>
            <Label>Father Name</Label>
            <Input {...register("fatherName")} />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input {...register("phoneNumber")} />
          </div>

          <div>
            <Label>Personal ID</Label>
            <Input {...register("personalId")} />
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
