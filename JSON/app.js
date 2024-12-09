function stringifyPolyfill(value, set = new Set()) {
  if (value == null) return "null";

  // handle basic types
  if (typeof value === "boolean") return value.toString();

  // non finite numbers includ: Infinity, -Infinity, NaN, null
  if (typeof value === "number") {
    return isFinite(value) ? value.toString() : "null";
  }

  if (typeof value == "string") return `\"${value.replace('/"/g', '\\"')}\"`;

  if (typeof value == "object") {
    // check if we've encountered this object before
    if (set.has(value)) throw new TypeError("Circular Object");

    set.add(value);

    // arrays
    if (Array.isArray(value))
      return `[${value
        .map((element) => stringifyPolyfill(element))
        .join(",")}]`;

    // objects
    const entries = Object.entries(value)
      .filter(
        ([_key, val]) => typeof val !== "function" || typeof val !== "undefined"
      )
      .map(([key, val]) => {
        // enclose every key within double quotes and concatenate the values
        return `\"${key}\":${stringifyPolyfill(val)}`;
      });

    // enclose all the values of the object with curly braces
    return `{${entries.join(",")}}`;
  }

  return undefined;
}

const userProfile = {
  id: 12345, 
  name: "Jane Doe", 
  isActive: true, 
  age: 29, 
  roles: ["admin", "editor"], 
  createdAt: new Date(), 
  lastLogin: null, 
  avatar: undefined, 
  metadata: {
    // Object with nested values
    tags: ["premium", "early_adopter"], 
    points: 345.67, 
  },
  recentTransactions: [
    { id: "txn001", amount: 25.5, currency: "USD" },
    { id: "txn002", amount: -5.0, currency: "USD", refunded: true },
  ],
  bio: "Loves technology and coffee", 
  website: "https://janedoe.me", 
  customData: {
    // Nested object for user-defined fields
    favoriteNumber: NaN, 
    specialFlag: Infinity, 
  },
};

console.log(stringifyPolyfill(userProfile));
