module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce Angular components to be standalone.",
            category: "Best Practices",
            recommended: false,
        },
        fixable: "code",
        schema: [],
    },
    create(context) {
        return {
            // This action will be performed on every ClassDeclaration node
            ClassDeclaration(node) {
                // Check if the class has a decorator
                const decorators = node.decorators || [];

                decorators.forEach((decorator) => {
                    // Check if the decorator is an Angular Component
                    if (
                        decorator.expression.callee &&
                        decorator.expression.callee.name === 'Component'
                    ) {
                        const args = decorator.expression.arguments;
                        if (args.length > 0) {
                            const componentMetadata = args[0];

                            // Ensure the component metadata is an object
                            if (componentMetadata.type === "ObjectExpression") {
                                const hasStandalone = componentMetadata.properties.some(
                                    (prop) =>
                                        prop.key.name === "standalone" &&
                                        prop.value.value === true
                                );

                                if (!hasStandalone) {
                                    // Report an error if the standalone property is missing
                                    context.report({
                                        node: componentMetadata,
                                        message:
                                            "This component is not standalone.",
                                        fix(fixer) {
                                            const lastProperty =
                                                componentMetadata.properties[
                                                componentMetadata.properties.length - 1
                                                ];
                                            return fixer.insertTextAfter(
                                                lastProperty,
                                                ", standalone: true"
                                            );
                                        },
                                    });
                                }
                            }
                        }
                    }
                });
            },
        };
    },
};