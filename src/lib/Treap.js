// v1.0.2 | 2026-06-26 | Franco De Escondrillas

// Taylor's approximation for collision probability p ≈ 1 - e^(-n² ÷ 2³¹)
// For the 80 different checks of ../data/checks.json v1.0.3, p ≈ 0.0003%

class Node {
  constructor(key) {
    this.priority = crypto.getRandomValues(new Uint32Array(1))[0] >>> 2;
    this.completed = false;
    this.right = null;
    this.left = null;
    this.key = key;
    this.size = 1;
  }
}

class Treap {
  constructor() {
    this.root = null;
  }

  #update(node) {
    if (node) node.size = 1 + (node.left?.size ?? 0) + (node.right?.size ?? 0);
  }
  
  #split(rootT, key) {
    // Base case
    if (!rootT) return [null, null];
    if(rootT.key === key) return [rootT.left, rootT.right];
    // Recursive calls
    if (rootT.key < key) {
      const [leftT, rightT] = this.#split(rootT.right, key);
      rootT.right = leftT;
      this.#update(rootT);
      return [rootT, rightT];
    } else {
      const [leftT, rightT] = this.#split(rootT.left, key);
      rootT.left = rightT;
      this.#update(rootT);
      return [leftT, rootT];
    }
  }

  #meld(leftT, rightT) {
    // Base case
    if (!leftT) return rightT;
    if (!rightT) return leftT;
    // Recursive calls
    if (leftT.priority > rightT.priority) {
      leftT.right = this.#meld(leftT.right, rightT);
      this.#update(leftT);
      return leftT;
    } else {
      rightT.left = this.#meld(leftT, rightT.left);
      this.#update(rightT);
      return rightT;
    }
  }

  find(key, rootT = this.root) {
    if (!rootT) return null;
    if (key === rootT.key) return rootT;
    return key < rootT.key ? this.find(key, rootT.left) : this.find(key, rootT.right);
  }
  
  insert(key) {
    if (this.find(key)) return;
    const [leftT, rightT] = this.#split(this.root, key);
    this.root = this.#meld(this.#meld(leftT, new Node(key)), rightT);
  }

  delete(key) {
    if (!this.find(key)) return;
    const [leftT, rightT] = this.#split(this.root, key);
    this.root = this.#meld(leftT, rightT);
  }
  
  get(callback, rootT = this.root) {
    if (!rootT) return;
    this.get(callback, rootT.left);
    callback(rootT);
    this.get(callback, rootT.right);
  }
  
  #union(leftT, rightT) {
    if (!leftT) return rightT;
    if (!rightT) return leftT;

    if (leftT.priority < rightT.priority) [leftT, rightT] = [rightT, leftT];
    const [smaller, larger] = this.#split(rightT, leftT.key);
    leftT.right = this.#union(leftT.right, larger);
    leftT.left = this.#union(leftT.left, smaller);
    this.#update(leftT);
    return leftT;
  }

  union(otherTreap) {
    this.root = this.#union(this.root, otherTreap.root);
    otherTreap.root = null;
  }
}

export default Treap;
