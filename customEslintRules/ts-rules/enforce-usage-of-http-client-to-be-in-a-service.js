module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure HttpClient calls in Angular services use environment variables instead of hardcoded URLs.",
            category: "Best Practices",
            recommended: false,
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return {
            // This function is triggered whenever an import declaration is encountered
            ImportDeclaration(node) {
                // Check if the import source is '@angular/common/http'
                if (node.source.value === '@angular/common/http') {
                    // Iterate over the imported specifiers
                    node.specifiers.forEach((specifier) => {
                        // Check if the specifier is importing HttpClient
                        if (specifier.imported && specifier.imported.name === 'HttpClient') {
                            // Determine the file type based on the filename
                            const filename = context.getFilename();
                            if (!filename.endsWith('.service.ts')) {
                                context.report({
                                    node: specifier,
                                    message: `HttpClient import detected in a non-serive file. Please call the backend from services only`,
                                });
                            }

                        }
                    });
                }
            },
        };
    },
};