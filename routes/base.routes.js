console.log("Base routes");

const express = require('express');

const router = express.Router();

/*router.get('/', function(req, res) {
  res.redirect('/activity');
});*/

router.get('/',function(req,res){
  if(res.locals.isAuth){
  res.redirect('/activity');
  }else{
      res.redirect('/login');
  }
})


router.get('/401', function(req, res) {
  res.status(401).render('shared/401');
});

router.get('/403', function(req, res) {
  res.status(403).render('shared/403');
});

module.exports = router;