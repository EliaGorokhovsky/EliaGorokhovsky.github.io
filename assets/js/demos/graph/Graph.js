import { Edge } from "./Edge.js";

/**
 * Stores state variables of a single graph
 */
export class Graph {

    /**
     * Initialize the graph
     */
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    /**
     * Add a node with the given name
     * @param {string} nodeName 
     */
    addNode(nodeName) {
        this.nodes.push({name: nodeName});
    }

    /**
     * Add an edge between the nodes at the given indices of this.nodes
     * @param {number} index1 
     * @param {number} index2 
     * @param {boolean} isDirected 
     */
    addEdge(index1, index2, isDirected) {
        let edge = new Edge(this.nodes[index1], this.nodes[index2], isDirected);
        if (!this.edges.some(it => it.equals(edge))) {
            this.edges.push(edge);
        }
    }

}