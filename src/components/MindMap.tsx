"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  ChevronRight,
  ChevronDown,
  PlusCircle,
  PlusSquare,
} from "lucide-react";
import { init } from "next/dist/compiled/webpack/webpack";

interface Node {
  id: string;
  content: string;
  children: Node[];
  isCollapsed?: boolean;
}

const MindMap: React.FC = () => {
  const [rootNode, setRootNode] = useState<Node>({
    id: "1",
    content: "Root Node",
    children: [],
  });
  const [isPanning, setIsPanning] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transformWrapperRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addChild = (parentId: string) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Node",
      children: [],
    };

    const updateNodes = (node: Node): Node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
          isCollapsed: false,
        };
      }
      return {
        ...node,
        children: node.children.map(updateNodes),
      };
    };

    setRootNode(updateNodes(rootNode));
    setEditingNode(newNode.id);
    setSelectedNode(newNode.id);
  };

  const addSibling = (siblingId: string) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Sibling",
      children: [],
    };

    const updateNodes = (node: Node): Node => {
      if (node.children.some((child) => child.id === siblingId)) {
        return { ...node, children: [...node.children, newNode] };
      }
      return {
        ...node,
        children: node.children.map(updateNodes),
      };
    };

    setRootNode(updateNodes(rootNode));
    setEditingNode(newNode.id);
    setSelectedNode(newNode.id);
  };

  const updateNodeContent = (nodeId: string, newContent: string) => {
    const updateNodes = (node: Node): Node => {
      if (node.id === nodeId) {
        return { ...node, content: newContent };
      }
      return {
        ...node,
        children: node.children.map(updateNodes),
      };
    };

    setRootNode(updateNodes(rootNode));
  };

  const toggleCollapse = (nodeId: string) => {
    const updateNodes = (node: Node): Node => {
      if (node.id === nodeId) {
        return { ...node, isCollapsed: !node.isCollapsed };
      }
      return {
        ...node,
        children: node.children.map(updateNodes),
      };
    };

    setRootNode(updateNodes(rootNode));
  };

  const renderNode = (node: Node, isRoot: boolean = false) => (
    <div
      key={node.id}
      className={`relative flex flex-col items-start p-2 mx-6 my-2 bg-white border-2 rounded-lg transition-all duration-300 ease-in-out
        ${isRoot ? "root" : ""} 
        ${
          selectedNode === node.id
            ? "border-green-500 shadow-lg shadow-green-200"
            : "border-gray-300"
        }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNode(node.id);
      }}
    >
      <div className="flex items-center min-w-[150px] min-h-[30px]">
        {/* 콜랩스 버튼 */}
        {node.children.length > 0 && (
          <button
            className="flex items-center justify-center text-gray-500 hover:text-green-500 transition-colors duration-300 z-100"
            onClick={() => toggleCollapse(node.id)}
          >
            {node.isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}
        <div
          className="mx-2 cursor-text"
          onClick={() => setEditingNode(node.id)}
        >
          {editingNode === node.id ? (
            <input
              ref={inputRef}
              type="text"
              value={node.content}
              onChange={(e) => updateNodeContent(node.id, e.target.value)}
              onBlur={() => setEditingNode(null)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setEditingNode(null);
                }
              }}
              className="w-full text-base outline-none"
            />
          ) : (
            <span>{node.content}</span>
          )}
        </div>
        {selectedNode === node.id && (
          // 자식 노드 생성 버튼
          <button
            className="absolute right-2 top-[22px] transform -translate-y-1/2 text-gray-500 hover:text-green-500 transition-colors duration-300 z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              addChild(node.id);
            }}
          >
            <PlusSquare size={24} />
          </button>
        )}
      </div>
      {selectedNode === node.id && !isRoot && (
        // 형제 노드 생성 버튼
        <button
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-green-500 transition-colors duration-300 z-[100]"
          onClick={(e) => {
            e.stopPropagation();
            addSibling(node.id);
          }}
        >
          <PlusSquare size={24} />
        </button>
      )}
      {!node.isCollapsed && node.children.length > 0 && (
        // 자식 노드 리스트
        <div
          className={`flex flex-col ml-2 pb-5 relative overflow-hidden transition-all duration-500 ease-in-out
          ${node.isCollapsed ? "max-h-0" : "max-h-[1000px]"}`}
        >
          <div className="absolute top-0 left-0 w-px h-full bg-gray-200"></div>
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      setIsPanning(true);
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      setIsPanning(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (editingNode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    } else if (inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
    }
  }, [editingNode]);

  useEffect(() => {
    const calculateInitialPosition = () => {
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const contentWidth = 3000; // 콘텐츠의 너비
        const contentHeight = 3000; // 콘텐츠의 높이

        const initialX = (container.width - contentWidth) / 2;
        const initialY = (container.height - contentHeight) / 2;

        console.log(container.width, container.height);
        console.log(initialX, initialY);
        setInitialPosition({ x: initialX, y: initialY });
      }
    };

    calculateInitialPosition();
    console.log(initialPosition);
  }, [containerRef.current]);

  if (initialPosition === null)
    return <div ref={containerRef} className="w-full h-screen"></div>;
  return (
    <div ref={containerRef}>
      <TransformWrapper
        ref={transformWrapperRef}
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        initialPositionX={initialPosition.x}
        initialPositionY={initialPosition.y}
        panning={{ disabled: !isPanning }}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100vh",
              }}
            >
              <div
                className="w-[3000px] h-[3000px] flex justify-center items-center bg-gray-100"
                onClick={() => {
                  setEditingNode(null);
                  setSelectedNode(null);
                }}
              >
                <div className="mind-map">{renderNode(rootNode, true)}</div>
              </div>
            </TransformComponent>
            <div className="flex items-center fixed bottom-5 right-5 z-10">
              <button
                className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => zoomIn()}
              >
                +
              </button>
              <div className="px-3">zoom</div>
              <button
                className="px-3 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => zoomOut()}
              >
                -
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MindMap;
