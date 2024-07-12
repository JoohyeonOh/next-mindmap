// atoms.ts
import { atom, selector } from "recoil";
import { Node } from "../interface/index";

export const rootNodeState = atom<Node>({
  key: "rootNodeState",
  default: {
    id: "1",
    content: "Root Node",
    children: [],
  },
});

export const selectedNodeState = atom<string | null>({
  key: "selectedNodeState",
  default: null,
});

export const editingNodeState = atom<string | null>({
  key: "editingNodeState",
  default: null,
});

export const animatingNodesState = atom<Set<string>>({
  key: "animatingNodesState",
  default: new Set(),
});

export const isPanningState = atom<boolean>({
  key: "isPanningState",
  default: false,
});

// 선택된 노드의 정보를 가져오는 selector
export const selectedNodeInfoSelector = selector({
  key: "selectedNodeInfoSelector",
  get: ({ get }) => {
    const rootNode = get(rootNodeState);
    const selectedNodeId = get(selectedNodeState);

    if (!selectedNodeId) return null;

    const findNode = (node: Node): Node | null => {
      if (node.id === selectedNodeId) return node;
      for (const child of node.children) {
        const found = findNode(child);
        if (found) return found;
      }
      return null;
    };

    return findNode(rootNode);
  },
});
