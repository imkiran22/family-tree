import React, { useEffect } from "react";
import "./styles.css";
import { Tree } from "./Tree";
import { familyArr } from "./data";
import jsPDF from 'jspdf';

export default function App() {
  useEffect(() => {
    const familyTree = new Tree(familyArr);
    familyTree.createTree();
    familyTree.renderTree();
    // setTimeout(() => {
    //   const doc = new jsPDF({
    //     orientation: 'landscape',
    //     unit: 'in',
    //     format: [4000, 2000]
    //   });
    //   //doc.save('Tree.pdf');
    // })
  });
  return <div id="tree" />;
}
