"use client";

import MindMap from "@/components/MindMap";
import { RecoilRoot } from "recoil";

export default function Home() {
  return (
    <RecoilRoot>
      <div>
        <MindMap />
      </div>
    </RecoilRoot>
  );
}
