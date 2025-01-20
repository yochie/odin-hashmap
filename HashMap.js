import { LinkedList } from "linked-list";
class HashMap {
  count;
  capacity;
  maxLoad;
  #buckets;
  constructor(capacity, maxLoad) {
    this.capacity = capacity;
    this.count = 0;
    this.maxLoad = maxLoad;
    this.#buckets = new Array(this.capacity).fill(null);
  }

  set(key, value) {
    const hashed = HashMap.hash(key, this.capacity);
    this.#setValueInBucket(hashed, { key, value });
  }

  get(key) {
    const hashed = HashMap.hash(key, this.capacity);
    return this.#getValueInBucket(hashed, key);
  }

  has(key) {
    const hashed = HashMap.hash(key, this.capacity);
    return this.#getValueInBucket(hashed, key) !== null;
  }

  remove(key) {
    const hashed = HashMap.hash(key, this.capacity);
    const bucket = this.#getBucket(hashed);
    if (bucket === null) {
      return false;
    }

    const node = bucket.where((n) => n.value.key === key);
    if (node === null) {
      return false;
    } else {
      //could be optimized by iterating on LL manually
      let index = bucket.find(node.value);
      bucket.removeAt(index);
      this.#shrink();
      return true;
    }
  }

  #setValueInBucket(index, pair) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    const bucket = this.#getBucket(index);
    if (bucket === null) {
      this.#buckets[index] = new LinkedList();
      this.#buckets[index].append(pair);
      this.#grow();
    } else {
      const correspondingNode = bucket.where(
        (node) => node.value.key === pair.key,
      );
      if (correspondingNode !== null) {
        //key exists, overwrite value
        correspondingNode.value.value = pair.value;
      } else {
        //collision, add new node to bucket
        bucket.append(pair);
        this.#grow();
      }
    }
  }

  //when max load reached, will double buckets and rehash all keys
  #grow() {
    this.count++;
    if (this.loadFactor() >= this.maxLoad) {
      this.capacity *= 2;
      const extendedBuckets = new Array(this.capacity);
      extendedBuckets.fill(null);

      const oldBuckets = this.#buckets;
      this.#buckets = extendedBuckets;
      this.count = 0;

      for (let oldBucket of oldBuckets) {
        if (oldBucket === null) {
          continue;
        }
        for (let node of oldBucket) {
          this.set(node.value.key, node.value.value);
        }
      }
    }
  }

  //could reallocate when load factor becomes too small but does not seem worth it
  #shrink() {
    this.count--;
  }

  #getValueInBucket(index, key) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    if (this.#buckets[index] === null) {
      return null;
    }
    let node = this.#buckets[index].where((node) => node.value.key === key);
    if (node === null) {
      return null;
    } else {
      return node.value.value;
    }
  }

  #getBucket(index) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    if (this.#buckets[index] === null) {
      return null;
    }
    return this.#buckets[index];
  }

  loadFactor() {
    return this.count / this.capacity;
  }

  static hash(key, max) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % max;
    }

    return hashCode;
  }

  toString() {
    let str = "";
    for (let val of this.#buckets) {
      if (val === null) {
        str += `\n -`;
        continue;
      }
      str += "\n" + val.toString();
    }
    return str;
  }

  length() {
    return this.count;
  }

  clear() {
    this.#buckets = new Array(this.capacity);
    this.#buckets.fill(null);
    this.count = 0;
  }

  values() {
    let arr = [];

    for (let bucket of this.#buckets) {
      if (bucket === null) {
        continue;
      }
      for (let node of bucket) {
        arr.push(node.value.value);
      }
    }
    return arr;
  }

  entries() {
    let arr = [];

    for (let bucket of this.#buckets) {
      if (bucket === null) {
        continue;
      }
      for (let node of bucket) {
        arr.push(node.value);
      }
    }
    return arr;
  }
}

export { HashMap };
