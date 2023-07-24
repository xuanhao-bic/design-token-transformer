function deepen(obj) {
  const result = {};

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split(".");

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = target[part] || {};
    }
    // Set value at end of path
    target[parts[0]] = obj[objectPath];
  }
  return result;
}

function convertToKebabCase(obj) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const nestedObj = convertToKebabCase(obj[key]);
      for (const nestedKey in nestedObj) {
        result[`${key.replace(/_/g, "-")}-${nestedKey}`] = nestedObj[nestedKey];
      }
    } else {
      result[key.replace(/_/g, "-")] = obj[key];
    }
  }
  return result;
}

function convertSomeTypeToKebabCase(obj) {
  const result = {};
  for (const key in obj) {
    // convert same type to kebab case
    if (key === "font") {
      result[key] = convertToKebabCase(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

function createArray({ dictionary, platform }) {
  const arr = dictionary.allTokens;
  return JSON.stringify(arr);
}

function filterTokensByType(types, tokens) {
  const obj = tokens.reduce((acc, cur) => {
    if (types.includes(cur.type)) {
      // box shadow
      if (cur.type === "custom-shadow") {
        acc[cur.path.join(".")] = `var(--${cur.name})`;
      // font size and line height
      } else if (cur.type === "custom-fontStyle") {
        acc[cur.path.join(".")] = [
          `${cur.value.fontSize}px`,
          {
            lineHeight: `${cur.value.lineHeight}px`,
            fontWeight: cur.value.fontWeight,
          },
        ];
      } else {
        acc[cur.path.join(".")] = `var(--${cur.name}, ${cur.value})`;
      }
    }
    return acc;
  }, {});
  const deep = deepen(obj);
  return convertSomeTypeToKebabCase(deep);
}

function createTailwindTokens({ dictionary, platform }) {
  const array = createArray({ dictionary, platform });
  return JSON.stringify(
    filterTokensByType(
      ["color", "custom-shadow", "custom-fontStyle"],
      JSON.parse(array)
    )
  );
}

module.exports = {
  createArray,
  filterTokensByType,
  createTailwindTokens,
};
