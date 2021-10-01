const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.connect("mongodb://localhost:27017/ABC", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected")).catch((err) => console.log(err));
const dbSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    mobile: String,
    email: String,
    password: String,
    privilegesvalues: String,
    roleId: Object,
    tokens: [
        {
            token: String
        }
    ]
});

const userRoles = new mongoose.Schema({
    roletitle: String,
    description: String,
    defaultPrivileges: String
});

const sections = new mongoose.Schema({
    sectiontitle: String,
    sectionkey: String,
});
const privileges = new mongoose.Schema({
    SectionId: Object,
    privilegestitle: String,
    privilegeskey: String,
});

const setprivileges = new mongoose.Schema(
    {
        privilegesvalues: String
    });


const Users = new mongoose.model("Record", dbSchema);
const Roles = new mongoose.model("userRoles", userRoles);
const section = new mongoose.model("section", sections);
const Privileges = new mongoose.model("privilege", privileges);
const SetPrivileges = new mongoose.model("setprivilege", setprivileges);
module.exports = { Users, Roles, section, Privileges,SetPrivileges };



// dbSchema.methods.generatAuthToken=async function()
// {
//     try{
//         let newtoken=jwt.sign({_id:this._id},"IamsaqlainhaiderandIambeginneratMern");
//         this.tokens=this.tokens.concat({token: newtoken});
//         await this.save();
//        return newtoken;
//     }catch(err)
//     {
//         console.log(err);
//     }
// }