import * as d3 from "d3";
import { Person } from "./Person";
import { DEFAULT_PROFILE_PIC } from "./utils";
export class Tree {
  constructor(data) {
    this.tree = {};
    this.svg = null;
    this.familyData = data.slice();
  }

  getParent(family) {
    let parent = family
      .filter(function(person) {
        return person.root === true;
      })
      .pop();
    return parent;
  }

  createSvg(width, height) {
    this.svg = d3
      .select("#tree")
      .append("svg")
      .attr("width", width + "px")
      .attr("height", height + "px")
      .attr("viewBox", `0 -50 ${width} ${height}`)
      .style("overflow", "scroll");
  }

  renderTree() {
    let levelWidth = [1];
    const childCount = (level, n) => {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);
        levelWidth[level + 1] += n.children.length;
        if (n.data.partner) {
          levelWidth[level + 1] += 4;
        }
        n.children.forEach(d => {
          childCount(level + 1, d);
        });
      }
    };
    const data = this.getD3Data();
    data.pop();
    const dataStructure = d3
      .stratify()
      .id(function(d) {
        return d.child;
      })
      .parentId(function(d) {
        return d.parent;
      })(data);
    childCount(0, dataStructure);

    let width = d3.max(levelWidth) * 250;
    let height = 800;

    this.createSvg(width, height * 1.25);

    const treeStructure = d3.tree().size([width, height]);
    const information = treeStructure(dataStructure);
    const connections = this.svg
      .append("g")
      .selectAll("path")
      .data(information.links());

    connections
      .enter()
      .append("path")
      .attr("d", function(d) {
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          " C " +
          d.source.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          d.target.y
        );
      });

    const pconnections = this.svg
      .append("g")
      .selectAll("path")
      .data(information.links());

    

    const patterns = this.svg
      .append("g")
      .selectAll("pattern")
      .data(information.descendants());

    patterns
      .enter()
      .append("pattern")
      .attr("id", function(d) {
        return d.id;
      })
      .attr("width", "80px")
      .attr("height", "60px");
    patterns
      .enter()
      .append("svg:image")
      .attr("x", function(d) {
        return d.x - 35;
      })
      .attr("y", function(d) {
        return d.y - 20;
      })
      .attr("width", 80)
      .attr("height", 60)
      .attr("xlink:href", function(d) {
        return d.data.profilePic || DEFAULT_PROFILE_PIC[d.data.gender];
      });

    const partnerPatterns = this.svg
      .append("g")
      .selectAll("pattern")
      .data(information.descendants());

    partnerPatterns
      .enter()
      .append("pattern")
      .attr("id", function(d) {
        return d.id;
      })
      .attr("width", "80px")
      .attr("height", "60px");

    partnerPatterns
      .enter()
      .append("svg:image")
      .attr("x", function(d) {
        return d.x + 90;
      })
      .attr("y", function(d) {
        return d.y - 20;
      })
      .attr("width", 80)
      .attr("height", 60)
      .attr("xlink:href", function(d) {
        return (
          d.data.partnerProfilePic || DEFAULT_PROFILE_PIC[d.data.partnerGender]
        );
      });

    const rectangles = this.svg
      .append("g")
      .selectAll("rect")
      .data(information.descendants());
    rectangles
      .enter()
      .append("rect")
      .attr("x", function(d) {
        // return d.x - 75;
        return d.x - 25;
      })
      .attr("y", function(d) {
        return d.y - 20;
      })
      //.attr("width", "150px")
      .attr("width", "60px")
      .attr("height", "60px")
      .attr("fill", function(d) {
        return `url(#${d.id})`;
      });

    const partnerRectangles = this.svg
      .append("g")
      .selectAll("rect")
      .data(information.descendants());

    partnerRectangles
      .enter()
      .append("rect")
      .attr("x", function(d) {
        // return d.x - 75;
        return d.x + 100;
      })
      .attr("y", function(d) {
        return d.y - 20;
      })
      //.attr("width", "150px")
      .attr("width", "60px")
      .attr("height", "60px")
      .attr("fill", function(d) {
        return `url(#${d.data.partnerProfilePic})`;
      })
      .classed("hide", function(d) {
        return d.data.partner ? false : true;
      });

    const names = this.svg
      .append("g")
      .selectAll("text")
      .data(information.descendants());
    names
      .enter()
      .append("text")
      .text(function(d) {
        return d.data.name;
      })
      .attr("x", function(d) {
        return d.x - 60;
      })
      .attr("y", function(d) {
        return d.y - 30;
      });

    const partnerNames = this.svg
      .append("g")
      .selectAll("text")
      .data(information.descendants());

    partnerNames
      .enter()
      .append("text")
      .text(function(d) {
        return d.data.partner;
      })
      .attr("x", function(d) {
        return d.x + 80;
      })
      .attr("y", function(d) {
        return d.y - 30;
      });

      pconnections
      .enter()
      .append("path")
      .attr("d", function(d) {
        
        return (
          "M" +
          (d.source.x + 100) +
          " " +
          " H " +
          d.source.x +
          " " +
          (d.source.x + 100)
        );
      })
      .classed("hide", function(d) {
        return d.source.data.partner ? false : true;
      });
  }

  createTree() {
    const familyData = this.familyData;
    const parent = this.getParent(familyData);
    this.tree[parent.key] = new Person(parent);
    let treeRef = this.tree;
    familyData.forEach(p => {
      treeRef = this.tree;
      if (!p.root) {
        const keys = p.key.split(".").filter(Boolean);
        keys.forEach(key => {
          if (!treeRef[key]) {
            treeRef[key] = new Person(p);
          } else {
            treeRef = treeRef[key];
          }
        });
      }
    });
  }

  getD3Data() {
    const data = [];
    const helper = tree => {
      let node = {};
      for (const prop in tree) {
        if (tree.hasOwnProperty(prop) && typeof tree[prop] === "object") {
          helper(tree[prop]);
        } else if (
          tree.hasOwnProperty(prop) &&
          typeof tree[prop] !== "object"
        ) {
          node[prop] = tree[prop];
          if (prop === "key") {
            let k = tree.key.split(".").filter(Boolean);
            node.parent = tree.root ? null : k[k.length - 2];
            node.child = k.pop();
          }
        }
      }
      data.push(node);
    };
    helper(this.tree);
    return data;
  }
}
