import React, { useRef, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Node } from "../interface/index";

interface NodeContentProps {
  node: Node;
  isEditing: boolean;
  onEdit: () => void;
  onUpdateContent: (content: string) => void;
  onToggleCollapse: () => void;
}

const NodeContent: React.FC<NodeContentProps> = ({
  node,
  isEditing,
  onEdit,
  onUpdateContent,
  onToggleCollapse,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="flex items-center min-w-[150px] min-h-[30px]">
      {node.children.length > 0 && (
        <button
          className="flex items-center justify-center text-gray-500 hover:text-green-500 transition-colors duration-300 z-100"
          onClick={onToggleCollapse}
        >
          {node.isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      )}
      <div className="mx-2 cursor-text" onClick={onEdit}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={node.content}
            onChange={(e) => onUpdateContent(e.target.value)}
            onBlur={() => onEdit()}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onEdit();
              }
            }}
            className="w-full text-base outline-none"
          />
        ) : (
          <span>{node.content}</span>
        )}
      </div>
    </div>
  );
};

export default NodeContent;
