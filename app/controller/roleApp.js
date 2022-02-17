const Roles = require('../../model/Roles');
const redis = require("redis");
const redisPort = 6379

const client = redis.createClient(redisPort);

client.on("error", (err) => {
    console.log(err);
});

exports.store = async(req,res)=>{
     //check users
     const nameExist = await Roles.findOne({name: req.body.name});
     if(nameExist) return res.status(400).send('name already exist');
     //create role
     const role = new Roles({
         name : req.body.name,
     })

     try{
         const savedRoles = await role.save()
         const roles = await Roles.find({});
         client.setex('user_roles', 600, JSON.stringify(roles));
         res.send(savedRoles)

     }catch(err){
         res.status(400).send(err);
     }
}

exports.index = async(req,res)=>{
    client.get('user_roles', async(err, user_roles) => {
        if (err) throw err;

        if (user_roles) {
            res.status(200).send(JSON.parse(user_roles));
        } else {
            const roles = await Roles.find({});
            client.setex('user_roles', 600, JSON.stringify(roles));
            res.status(200).send(roles);
        }
      });
}