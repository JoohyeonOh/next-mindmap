"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Node {
  id: string;
  content: string;
  children: Node[];
}

const MindMap: React.FC = () => {
  const [rootNode, setRootNode] = useState<Node>({
    id: "1",
    content: "Root Node",
    children: [],
  });
  const [isPanning, setIsPanning] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addChild = (parentId: string) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Node",
      children: [],
    };

    const updateNodes = (node: Node): Node => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] };
      }
      return {
        ...node,
        children: node.children.map(updateNodes),
      };
    };

    setRootNode(updateNodes(rootNode));
    setEditingNode(newNode.id);
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

  const renderNode = (node: Node, isRoot: boolean = false) => (
    <div key={node.id} className={`node ${isRoot ? "root" : ""}`}>
      <div className="node-content" onClick={() => setEditingNode(node.id)}>
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
          />
        ) : (
          <span>{node.content}</span>
        )}
      </div>
      <button onClick={() => addChild(node.id)}>+</button>
      {node.children.length > 0 && (
        <div className="children">
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      setIsPanning(true);
      console.log("space keydown");
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      setIsPanning(false);
      console.log("space key up");
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
    }
  }, [editingNode]);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={2}
      initialPositionX={0}
      initialPositionY={0}
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
              cursor: isPanning ? "grab" : "default",
            }}
          >
            <div className="mind-map-container">
              <div className="mind-map">{renderNode(rootNode, true)}</div>
            </div>
          </TransformComponent>
          <div className="zoom-controls">
            <button onClick={() => zoomIn()}>Zoom In</button>
            <button onClick={() => zoomOut()}>Zoom Out</button>
          </div>
        </>
      )}
    </TransformWrapper>
  );
};

export default MindMap;
