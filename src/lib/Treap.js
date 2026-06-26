// v1.0.1 | 2026-06-25 | Franco De Escondrillas

// Taylor's approximation for collision probability p ≈ 1 - e^(-n² ÷ 2³¹)
// For the 80 checks of v1.0.3, p ≈ 0.0003%

class Node {
  constructor(key) {
    this.priority = crypto.getRandomValues(new Uint8Array(1))[0] >>> 2;
    this.right = null;
    this.left = null;
    this.size = 1;
    
    this.key = key;
    this.min = key;
    this.max = key;
  }
}

class Treap {
  constructor() {
    this.root = null;
  }

  #update(node) {
    if (!node) return;
    node.size = 1 + (node.left?.size ?? 0) + (node.right?.size ?? 0);
    node.max = node.right ? node.right.max : node.key;
    node.min = node.left ? node.left.min : node.key;
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

  find(key) {
    let current = this.root;
    while (current) {
      if (current.key === key) return current;
      current = key < current.key ? current.left : current.right;
    }
    return null;
  }
  
  insert(key) {
    const [leftT, rightT] = this.#split(this.root, key);
    this.root = this.#meld(this.#meld(leftT, new Node(key)), rightT);
  }

  delete(key) {
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
