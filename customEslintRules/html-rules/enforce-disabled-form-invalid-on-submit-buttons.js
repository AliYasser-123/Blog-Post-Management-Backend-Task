module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure buttons with type submit inside forms have [disabled]=\"form.invalid\"",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        return {
            // Track when entering a form element
            "Element$1[name='form']"(node) {
                // Check for button elements inside this form
                node.children.forEach((childNode) => {
                    if (childNode.name === 'button') {
                        const hasSubmitType = childNode.attributes.some(
                            (attr) => attr.name === 'type' && attr.value === 'submit'
                        );

                        // Only check submit buttons
                        if (hasSubmitType) {
                            // Check if the disabled attribute exists with form.invalid in its value
                            const hasFormInvalidCheck =
                                childNode.attributes.some(
                                    (attr) =>
                                        attr.name === 'disabled' &&
                                        typeof attr.value === 'string' &&
                                        attr.value.includes('.invalid')
                                ) ||
                                childNode.inputs.some((input) => {
                                    // Check if input is BoundAttribute and its value is an ASTWithSource
                                    if (input.name === 'disabled' && input.type === 'BoundAttribute') {
                                        const ast = input.value;
                                        if (ast && ast.source) {
                                            return ast.source.includes('.invalid');
                                        }
                                    }
                                    return false;
                                });

                            if (!hasFormInvalidCheck) {
                                context.report({
                                    node: childNode,
                                    message: `<button type="submit"> inside a form is missing [disabled]="form.invalid". Ensure it is disabled when the form is invalid.`,
                                });
                            }
                        }
                    }
                });
            },
        };
    },
};