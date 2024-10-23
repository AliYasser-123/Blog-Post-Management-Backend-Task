module.exports = {
    meta: {
      type: "problem",
      docs: {
        description: "Ensure that all route handler functions have error handling using try/catch.",
        category: "Best Practices",
        recommended: false,
      },
      schema: [],
    },
    create(context) {
      const filename = context.getFilename();
  
      // Only apply to .js files (assuming you have JS files for routes)
      const isJavaScriptFile = filename.endsWith('.js');
  
      // Skip files in the customEslintRules folder or Jest test files
      const isJestFile = filename.endsWith('.test.js') || filename.endsWith('.spec.js');
      const isInCustomEslintRulesFolder = filename.includes('customEslintRules');
  
      if (!isJavaScriptFile || isJestFile || isInCustomEslintRulesFolder) {
        return {}; // Skip if it's a test file or in the customEslintRules folder
      }
  
      return {
        // Detect the use of Express route methods like .get(), .post(), .put(), etc.
        CallExpression(node) {
          const callee = node.callee;
  
          // Check if it's an Express route (e.g., app.get, firebaseFunction.get)
          if (
            callee.type === 'MemberExpression' &&
            callee.property &&
            ['get', 'post', 'put', 'delete'].includes(callee.property.name)
          ) {
            const routeHandler = node.arguments[node.arguments.length - 1]; // Last argument is the route handler function
  
            // Ensure the route handler is an async function or function expression
            if (routeHandler && (routeHandler.type === 'FunctionExpression' || routeHandler.type === 'ArrowFunctionExpression')) {
              if (!hasTryCatchBlock(routeHandler.body)) {
                context.report({
                  node: routeHandler,
                  message: "Route handler is missing error handling with try/catch.",
                });
              }
            }
          }
        },
      };
  
      // Helper function to check if a function body has a try/catch block
      function hasTryCatchBlock(body) {
        if (body && body.type === 'BlockStatement') {
          return body.body.some((statement) => statement.type === 'TryStatement');
        }
        return false;
      }
    },
  };