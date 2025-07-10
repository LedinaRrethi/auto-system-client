import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { HiTrash } from "react-icons/hi";

interface DropzoneComponentProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const MAX_TOTAL_SIZE_MB = 5;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ files, setFiles }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      let errorMsg = "";
      const validFiles: File[] = [];

      const existingFileNames = files.map(f => f.name.toLowerCase());
      const existingTotalSize = files.reduce((acc, file) => acc + file.size, 0);

      let newTotalSize = existingTotalSize;

      for (const file of acceptedFiles) {
        const fileNameLower = file.name.toLowerCase();
        const isPdfMimeType = file.type === "application/pdf";
        const isPdfExtension = fileNameLower.endsWith(".pdf");

        if (!isPdfMimeType || !isPdfExtension) {
          errorMsg = "Only PDF files are allowed.";
          break;
        }

        if (existingFileNames.includes(fileNameLower) || validFiles.some(f => f.name.toLowerCase() === fileNameLower)) {
          errorMsg = `A file named "${file.name}" already exists.`;
          break;
        }

        newTotalSize += file.size;

        if (newTotalSize > MAX_TOTAL_SIZE_BYTES) {
          errorMsg = `Total file size exceeds ${MAX_TOTAL_SIZE_MB} MB.`;
          break;
        }

        validFiles.push(file);
      }

      if (errorMsg) {
        setErrorMessage(errorMsg);
        return;
      }

      setFiles(prev => [...prev, ...validFiles]);
      setErrorMessage(null);
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: true,
  });

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setErrorMessage(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`transition border border-dashed cursor-pointer rounded-xl p-6 ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-2 font-semibold">
            {isDragActive ? "Drop PDF files here..." : "Drag & drop PDF files or click to browse"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only PDF documents. Total maximum size: {MAX_TOTAL_SIZE_MB} MB.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">{errorMessage}</div>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between border rounded px-3 py-2 bg-white dark:bg-gray-800"
            >
              <button
                onClick={() => handlePreview(file)}
                className="text-left truncate hover:underline"
              >
                {file.name}
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropzoneComponent;
