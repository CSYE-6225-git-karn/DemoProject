
const app=require('./app.js');

const db = require("./app/models/database");
db.sequelize.sync({ force: true }).then(() => {1
    console.log("Database connected.");
  });

require("./app/routes/user.routes")(app);



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on 3000`)
});

