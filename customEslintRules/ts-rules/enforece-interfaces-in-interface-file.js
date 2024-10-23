module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure interfaces are only declared in files named *.interface.ts.",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        const filename = context.getFilename();

        return {
            // Check for interface declarations
            TSInterfaceDeclaration(node) {
                // Ensure the filename ends with .interface.ts
                if (!filename.endsWith('.interface.ts')) {
                    context.report({
                        node,
                        message: `Interface should only be declared in a file ending with ".interface.ts"`,
                    });
                }
            },
        };
    },
};