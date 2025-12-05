const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login");
    }
    next();
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            req.flash("error", "You do not have permission to access this page.");
            return res.redirect("back");
        }
        next();
    };
};

module.exports = { isAuthenticated, requireRole };