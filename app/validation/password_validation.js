const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(64)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                    //Must have one digit
.has().symbols()                                    // Must have one symbol
.is().not().oneOf(['Passw0rd', 'Password123','12345678']); // Blacklist these values


const isValid=(password,res)=>
{
    if(!schema.validate(password))
    {
        var errorsList=schema.validate(password, { list: true });
        var answer=[];
        for(i=0;i<errorsList.length;i++)
        {
            if(errorsList[i]=="min")
            {
                answer.push("Password must contain minimum 8 characters")
            }
            else if(errorsList[i]=="max")
            {
                answer.push("Password must contain maximum 64 characters")
            }
            else
            {
                answer.push("Password must contain atleast one "+errorsList[i]);
            }
        }
        res.status(400).send({
            Error: answer
          });
          return false;
    }
    return true;
};
module.exports={isValid};