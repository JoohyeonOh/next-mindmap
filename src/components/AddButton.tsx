import React from "react";
import { PlusSquare } from "lucide-react";

interface AddButtonProps {
  onAdd: () => void;
  position: "right" | "bottom";
  label: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onAdd, position, label }) => {
  const positionClass =
    position === "right"
      ? "right-2 top-[22px] transform -translate-y-1/2"
      : "-bottom-8 left-1/2 transform -translate-x-1/2";

  return (
    <button
      className={`absolute ${positionClass} text-gray-500 hover:text-green-500 transition-colors duration-300 z-[100]`}
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
      title={label}
    >
      <PlusSquare size={24} />
    </button>
  );
};

export default AddButton;
