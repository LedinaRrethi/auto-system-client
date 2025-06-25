import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { HiTrash } from "react-icons/hi";

interface DropzoneComponentProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}


const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ files, setFiles }) => {
  const onDrop = useCallback(
  (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  },
  [setFiles]
);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
    },
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
            Only PDF documents are allowed. You can upload multiple files.
          </p>
        </div>
      </div>

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

