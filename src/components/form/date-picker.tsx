import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../assets/icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  maxDate?: Date;
  minDate?: Date;
  label?: string;
  placeholder?: string;
  onFocus?: () => void;  
};

export default function DatePicker({
  id,
  mode = "single",         
  onChange,
  label,
  defaultDate,
  maxDate,
  minDate,
  placeholder,
  onFocus,                  
}: PropsType) {
  useEffect(() => {
    const inputElement = document.getElementById(id) as HTMLElement;

    const flatPickrInstance = flatpickr(inputElement, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "d/m/Y",
      maxDate,
      minDate,
      defaultDate,
      defaultHour: 12,
      defaultMinute: 0,
      onChange,
      appendTo: inputElement.parentElement!,
      positionElement: inputElement,
      position: "auto center",
    });

    return () => {
      if (!Array.isArray(flatPickrInstance)) {
        flatPickrInstance.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, maxDate, minDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative z-50 w-full">
        <input
          id={id}
          placeholder={placeholder}
          onFocus={onFocus}   
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
