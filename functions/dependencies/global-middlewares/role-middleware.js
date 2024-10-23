const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../config/config');

module.exports = {
    roleMiddleware: async (req, res, next) => {
        const query = `
            SELECT r.name
            FROM admin a
            JOIN brand_admin_role bar ON bar.adminId = a.id
            JOIN role r ON bar.roleId = r.id
            JOIN role_page_action rpa ON r.id = rpa.roleId
            JOIN app_pages ap ON rpa.pageId = ap.id
            JOIN role_action ra ON rpa.roleActionId = ra.id
            WHERE a.id = ? AND bar.brandId = ? AND ra.method = ? AND ap.path = ?;
        `;

        const [rows] = await getPromiseConnection().query(query, [
            req.admin.adminId,
            req.admin.brandId,
            req.method,
            `/${req._parsedUrl.pathname.split('/')[1]}`,
        ]);

        if (rows.length) {
            return next();
        } else {
            await endPromiseConnection(getPromiseConnection());
            return res
                .status(412)
                .send({ message: 'Sorry! You don’t have access', data: null });
        }
    },
};
