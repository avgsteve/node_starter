const router = require('express').Router();
const viewController = require('./../routerControllers/viewRouteController')

router.get('/',
  viewController.getPage_home
);


module.exports = router;