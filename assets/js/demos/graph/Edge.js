/**
 * An edge of a graph is a connection between at most two nodes. 
 * It can be directed or undirected.
 */
export class Edge {

    /**
     * The edge goes from node1 to node2. If it is not directed, it also goes from node2 to node1.
     * Nodes have at least a 'name' field.
     * @param {node} node1 
     * @param {node} node2 
     * @param {boolean} isDirected 
     */
    constructor(node1, node2, isDirected) {
        this.node1 = node1;
        this.node2 = node2;
        this.isDirected = isDirected;
    }

    /**
     * Returns the end node of this edge if source is the start node, and null otherwise.
     * @param {node} source 
     */
    destination(source) {
        if (source === this.node1) {
            return this.node2;
        } else if (source === this.node2 && !this.isDirected) {
            return this.node1;
        } else {
            return null;
        }
    }

    /**
     * Checks if two edges are equivalent
     * @param {*} object 
     */
    equals(object) {
        return (this.node1 === object.node1 && this.node2 === object.node2) || 
            (!this.isDirected && this.node1 === object.node2 && this.node2 === object.node1);
    }

}