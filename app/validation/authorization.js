const bcrypt = require('bcrypt');
const auth = require('basic-auth');


const GetAuthorizedUser= async (req,res, User)=>{
    const credentials=auth(req);
    if (!credentials ){
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).send({
            Message:"No Username and Password"
        });
        // return;
    }
    if(!credentials.name)
    {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).send({
            Message:"No Username Provided"
        });
        // return;
    }
    if(!credentials.pass)
    {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).send({
            Message:"No Password Provided"
        });
        // return;
    }
    
    
    let user = await User.findOne({where:{email_address:credentials.name}});
    if(!user)
    {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).send({
            Message:"Invalid Credentials"
        });
        // return;
    } else {

        if(! await bcrypt.compare(credentials.pass,user.password))
        {
            res.setHeader('WWW-Authenticate', 'Basic realm="example"');
            res.status(401).send({
                Message:"Invalid Credentials"
            });
            // return;
        }  

    }
   
    return user;
}

module.exports = {GetAuthorizedUser};


