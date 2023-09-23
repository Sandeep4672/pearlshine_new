function ensureAuthenticated(req, res, next) {
    if (!res.locals.isAuth ) {
        console.log("Hi");
        return res.redirect('/401');
    }
    next();
}

module.exports=ensureAuthenticated;