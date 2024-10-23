module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure that all functions in component and service files have error handling using try/catch, excluding constructors.",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        const filename = context.getFilename();

        // Only apply to component (*.component.ts) and service (*.service.ts) files
        const isComponentOrService = filename.endsWith('.component.ts') || filename.endsWith('.service.ts');

        if (!isComponentOrService) {
            return {};
        }

        return {
            // Check for method definitions (functions declared as methods on classes)
            MethodDefinition(node) {
                // Ignore constructors
                if (node.kind === 'constructor') {
                    return; // Skip over constructors
                }

                // Check if method is missing a try/catch
                if (!hasTryCatchBlock(node.value.body)) {
                    context.report({
                        node,
                        message: "Method is missing error handling with try/catch.",
                    });
                }
            },

            // Check for function declarations (regular functions outside of class methods)
            FunctionDeclaration(node) {
                if (!hasTryCatchBlock(node.body)) {
                    context.report({
                        node,
                        message: "Function is missing error handling with try/catch.",
                    });
                }
            },

            // Check for arrow functions (const myFunc = () => {})
            ArrowFunctionExpression(node) {
                if (node.body.type === 'BlockStatement' && !hasTryCatchBlock(node.body)) {
                    context.report({
                        node,
                        message: "Arrow function is missing error handling with try/catch.",
                    });
                }
            },

            // Check for function expressions (const myFunc = function() {})
            FunctionExpression(node) {
                if (node.body.type === 'BlockStatement' && !hasTryCatchBlock(node.body) && node.parent.kind != 'constructor') {
                    context.report({
                        node,
                        message: "Function expression is missing error handling with try/catch.",
                    });
                }
            },
        };

        // Helper function to check if a function body has a try/catch block
        function hasTryCatchBlock(body) {
            if (body && body.type === 'BlockStatement') {
                return body.body.some(
                    (statement) => statement.type === 'TryStatement'
                );
            }
            return false;
        }
    },
};