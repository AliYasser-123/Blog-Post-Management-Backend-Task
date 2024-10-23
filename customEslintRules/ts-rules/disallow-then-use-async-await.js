module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce the use of async/await instead of .then()",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        return {
            // This checks for any CallExpression (i.e., function calls)
            CallExpression(node) {
                // Check if the call expression is using .then()
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.property.name === 'then'
                ) {
                    context.report({
                        node,
                        message: "Avoid using .then(). Use async/await instead.",
                    });
                }
            },
        };
    },
};