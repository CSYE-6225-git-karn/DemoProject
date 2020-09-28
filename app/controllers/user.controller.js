const db = require("../models/database");
const User = db.users;
const authorization=require("../validation/authorization");
const { v4: uuidv4 } = require('uuid');
const _ = require("underscore");
const bcrypt = require('bcrypt');
const email_validator = require("email-validator");
const pass_validator=require("../validation/password_validation");
const auth = require('basic-auth');
// const Op = db.Sequelize.Op;

exports.createUser = async (req, res) => {
    if (!req.body.email_address || !req.body.password || !req.body.first_name || !req.body.last_name) {
      res.status(400).send({
        Error: "Email, Password, First_Name and Last_Name cannot be empty !"
      });
      return;
    }
    
    if(!email_validator.validate(req.body.email_address)){
        res.status(400).send({
            Error: "Invalid Email"
          });
          return;
    }

    User.findOne({where: {
        email_address:req.body.email_address
    }}).then(user=>{
        if(user)
        {
            res.status(400).send({
                Error: "User already exist"
            });
            return;
        }
    });
    pass_validator.isValid(req.body.password,res);
  
    const user=_.pick(req.body,['first_name','password','email_address','last_name']);
    user.id=uuidv4();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    
    User.create(user)
      .then(data => {     
        res.status(201).send(_.pick(data,['id','first_name','last_name','email_address','account_created','account_updated']));
        // res.status(201).send({
        //     Message:"User Created"
        // });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  };



exports.findUser = async (req, res) => {
    let user=await authorization.GetAuthorizedUser(req,res, User);
    let answer=_.pick(user,['email_address','first_name','last_name','account_created','account_updated']);
    res.status(200).send(answer);
};


exports.updateUser = async (req, res) => {
    let user=await authorization.GetAuthorizedUser(req,res, User);
    if(req.body.email_address || req.body.account_created  || req.body.account_updated)
    {
        res.status(400).send({
            Error: "You cannot update email_address, account_created and account_updated"
        });
        return;
    }
    else if(!req.body.password && !req.body.first_name && !req.body.last_name) 
    {
            res.status(400).send({
              Error: "Atleast one field required to be updated !"
            });
            return;
    }
    else
    {
            if (req.body.first_name) {
                user.first_name = req.body.first_name;
            }
            if (req.body.last_name) {
                user.last_name = req.body.last_name;
            }
          if (req.body.password) {
                if(pass_validator.isValid(req.body.password,res))
                {
                    const hash = await bcrypt.hash(req.body.password, 10);
                    user.password = hash;
                }
            }
        }
        await user.save();
        res.status(204).send();
};



exports.checkHashFunction =  async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  let user = {}
  user.password = await bcrypt.hash(req.body.password,salt);
  res.status(201).send(user);
}



exports.testUserCreate =  (req, res) => {
  if (!req.body.email_address || !req.body.password || !req.body.first_name || !req.body.last_name ) {
    res.status(400).send({
      Error: "Email, Password, First_Name andLast_Name cannot be empty !"
    });
    return;
  }
  else if(!email_validator.validate(req.body.email_address))
  {
    res.status(400).send({
      Error: "Invalid Email"
    });
    return;
  }
  else
  {
    res.status(201).send({
      Message:"User Created"
    })
  }
}

exports.checkFunc = (req, res) => {
  const credentials = auth(req);
  if (!credentials || !credentials.pass || !credentials.name || !email_validator.validate(credentials.name)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.status(401).send('Access denied');
  }
  else
      res.status(200).send('Access granted');
}

