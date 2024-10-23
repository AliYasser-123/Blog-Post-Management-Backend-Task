module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure HttpClient calls use environment variables for URLs.",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        let environmentImported = false;

        return {
            // This checks if the environment file is imported in the service
            ImportDeclaration(node) {
                const filename = context.getFilename();

                if (filename.endsWith('.service.ts')) {
                    if (node.source.value.includes('environments/environment')) {
                        node.specifiers.forEach((specifier) => {
                            if (specifier.imported && specifier.imported.name === 'environment') {
                                environmentImported = true; // Mark environment as imported
                            }
                        });
                    }
                }
            },

            // Check HttpClient calls inside the service methods
            CallExpression(node) {
                const filename = context.getFilename();

                // Only check within service files
                if (filename.endsWith('.service.ts') && environmentImported) {
                    // Check if the call is a HttpClient method (get, post, put, etc.)
                    if (
                        node.callee.type === 'MemberExpression' &&
                        node.callee.object.type === 'MemberExpression' &&
                        node.callee.object.object.type === 'ThisExpression' &&
                        node.callee.object.property.name === 'http' &&
                        ['get', 'post', 'put', 'delete', 'patch'].includes(node.callee.property.name)
                    ) {
                        const urlArg = node.arguments[0];

                        // Check if the URL is a template literal or string
                        if (urlArg && (urlArg.type === 'TemplateLiteral' || urlArg.type === 'Literal')) {
                            // Ensure the URL is not hardcoded or a template literal without environment variable
                            if (
                                urlArg.type === 'Literal' ||
                                (urlArg.type === 'TemplateLiteral' &&
                                    !urlArg.expressions.some(
                                        (expr) =>
                                            expr.type === 'MemberExpression' &&
                                            expr.object.name === 'environment'
                                    ))
                            ) {
                                context.report({
                                    node: urlArg,
                                    message: `Hardcoded URL or non-environment URL found in HttpClient call. Use environment variables instead.`,
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};