import React from "react";
import NodeContent from "./NodeContent";
import AddButton from "./AddButton";
import { Node as NodeType } from "../interface/index";
import { useRecoilValue } from "recoil";
import {
  animatingNodesState,
  editingNodeState,
  selectedNodeState,
} from "@/atoms";

interface NodeProps {
  node: NodeType;
  isRoot?: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onAddChild: (id: string) => void;
  onAddSibling: (id: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onToggleCollapse: (id: string) => void;
}

const Node: React.FC<NodeProps> = ({
  node,
  isRoot = false,
  onSelect,
  onEdit,
  onAddChild,
  onAddSibling,
  onUpdateContent,
  onToggleCollapse,
}) => {
  const selectedNode = useRecoilValue(selectedNodeState);
  const editingNode = useRecoilValue(editingNodeState);
  const animatingNodes = useRecoilValue(animatingNodesState);

  return (
    <div
      className={`relative flex flex-col items-start p-2 mx-6 my-2 bg-white border-2 rounded-lg transition-all duration-300 ease-in-out
        ${isRoot ? "root" : ""} 
        ${
          selectedNode === node.id
            ? "border-green-500 shadow-lg shadow-green-200"
            : "border-gray-300"
        }
        ${node.isNew ? "scale-0 opacity-0" : "scale-100 opacity-100"}
        ${animatingNodes.has(node.id) ? "animate-bounce" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <NodeContent
        node={node}
        isEditing={editingNode === node.id}
        onEdit={() => onEdit(node.id)}
        onUpdateContent={(content) => onUpdateContent(node.id, content)}
        onToggleCollapse={() => onToggleCollapse(node.id)}
      />
      {selectedNode === node.id && (
        <AddButton
          onAdd={() => onAddChild(node.id)}
          position="right"
          label="Add Child"
        />
      )}
      {selectedNode === node.id && !isRoot && (
        <AddButton
          onAdd={() => onAddSibling(node.id)}
          position="bottom"
          label="Add Sibling"
        />
      )}
      {!node.isCollapsed && node.children.length > 0 && (
        <div
          className={`flex flex-col ml-2 pb-5 relative overflow-hidden transition-all duration-500 ease-in-out
          ${
            node.isCollapsed
              ? "max-h-0 opacity-0"
              : "max-h-[1000px] opacity-100"
          }`}
        >
          <div className="absolute top-0 left-0 w-px h-full bg-gray-200"></div>
          {node.children.map((child) => (
            <Node
              key={child.id}
              node={child}
              onSelect={onSelect}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onUpdateContent={onUpdateContent}
              onToggleCollapse={onToggleCollapse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Node;
