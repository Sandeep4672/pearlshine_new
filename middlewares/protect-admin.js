function ensureAdmin(req, res, next) {
    if (!res.locals.isAdmin) {
        return res.redirect('/403');
    }
    next();
}

module.exports=ensureAdmin;