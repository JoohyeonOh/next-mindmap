export interface Node {
  id: string;
  content: string;
  children: Node[];
  isCollapsed?: boolean;
  isNew?: boolean;
}
