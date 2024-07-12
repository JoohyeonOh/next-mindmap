"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Node from "./Node";
import ZoomControls from "./ZoomControls";
import { Node as NodeType } from "../interface/index";
import {
  rootNodeState,
  selectedNodeState,
  editingNodeState,
  animatingNodesState,
  isPanningState,
} from "../atoms";

const MindMap: React.FC = () => {
  const [rootNode, setRootNode] = useRecoilState(rootNodeState);
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState);
  const [editingNode, setEditingNode] = useRecoilState(editingNodeState);
  const animatingNodes = useRecoilValue(animatingNodesState);
  const [isPanning, setIsPanning] = useRecoilState(isPanningState);

  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const transformWrapperRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addChild = (parentId: string) => {
    const newNode: NodeType = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Node",
      children: [],
    };

    const updateNodes = (node: NodeType): NodeType => {
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
    const newNode: NodeType = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Sibling",
      children: [],
    };

    const updateNodes = (node: NodeType): NodeType => {
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
    const updateNodes = (node: NodeType): NodeType => {
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
    const updateNodes = (node: NodeType): NodeType => {
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
                <Node
                  node={rootNode}
                  isRoot={true}
                  onSelect={setSelectedNode}
                  onEdit={setEditingNode}
                  onAddChild={addChild}
                  onAddSibling={addSibling}
                  onUpdateContent={updateNodeContent}
                  onToggleCollapse={toggleCollapse}
                />
              </div>
            </TransformComponent>
            <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MindMap;
