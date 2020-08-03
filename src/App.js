import React, { useEffect } from "react";
import "./styles.css";
import { Tree } from "./Tree";
import { familyArr } from "./data";

export default function App() {
  useEffect(() => {
    const familyTree = new Tree(familyArr);
    familyTree.createTree();
    familyTree.renderTree();
  });
  return <div id="tree" />;
}
