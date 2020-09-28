module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create new User
    router.post("/", users.createUser);
  
    router.get("/checkFunc",users.checkFunc);

    router.post("/checkHashFunction",users.checkHashFunction);

    router.post("/testUserCreate",users.testUserCreate);
    
    //Find User
    router.get("/self", users.findUser);
  
    //Update User Data
    router.put("/self",users.updateUser);
    

  
    app.use('/v1/user', router);
  };