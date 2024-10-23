module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow certain HTTP methods like PATCH, OPTIONS, HEAD, etc.",
      category: "Best Practices",
      recommended: false,
    },
    schema: [], // No options for this rule
  },
  create(context) {
    let expressAppName = null;
    const disallowedMethods = [
      "patch", "options", "head", "connect", "trace", "link", "unlink",
      "propfind", "proppatch", "mkcol", "copy", "move", "lock", "unlock",
      "search", "report", "merge", "notify", "subscribe", "unsubscribe"
    ];

    return {
      // Detect assignment of the Express app (e.g., `const firebaseFunction = express()`)
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === "CallExpression" &&
          node.init.callee.name === "express" &&
          node.id.type === "Identifier"
        ) {
          expressAppName = node.id.name;
        }
      },

      // Detect method calls on the Express app (e.g., `firebaseFunction.get()`, `firebaseFunction.patch()`)
      CallExpression(node) {
        if (
          expressAppName &&
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === expressAppName &&
          node.callee.property.type === "Identifier"
        ) {
          const method = node.callee.property.name.toLowerCase();

          // If the method is one of the disallowed methods, report it
          if (disallowedMethods.includes(method)) {
            context.report({
              node: node.callee.property,
              message: `"${method.toUpperCase()}" method is not allowed. Only use POST,PUT,GET OR DELETE`,
            });
          }
        }
      },
    };
  },
};