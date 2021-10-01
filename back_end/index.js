const cors = require('cors');
const express = require('express');
const dbObject = require('./schema');
const app = express();
const bodyp = require('body-parser');
app.use(cors());
app.use(bodyp.json());
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;


app.get('/join/test', (req, res) => {
    dbObject.section.aggregate([
        {
            $lookup: {
                from: "privileges",
                localField: "_id",
                foreignField: 'SectionId',
                as: 'privilegesdetail'
            }
        }
    ]).then((data1) => {
        let jdata = genrateJson(data1);
        res.send(jdata);
    }).catch(err => {
        res.send(err);
    })


})

const genrateJson = (data) => {
    var arr = {};
    let obj;
    data.map(sec => {
        obj = new Object();
        sec.privilegesdetail.map(key => {
            obj[key.privilegeskey] = false;
        })
        arr[sec.sectionkey] = obj;
    })
    return arr;
}

app.get('/home', (req, res) => {
    dbObject.Users.find((err, users) => {
        if (users) {

            res.send(users);
        }
        else {
            res.send(err);
        }
    }).limit(3).skip(3)
});

app.get('/record/count', (req, res) => {
    dbObject.Users.count().then((result) => {
        const pages = Math.ceil(result / 3);
        res.send({ result: result, pages: pages });
    }).catch((err) => {
        res.send(err);
    });
});












app.get('/filter/:pageNo', (req, res) => {
    dbObject.Users.find((err, users) => {
        if (users) {
            res.send(users);
        }
        else {
            res.send(err);
        }
    }).limit(3).skip((req.params.pageNo - 1) * 3);
});

app.post("/user/login", (req, res) => {
    const { email, password } = req.body;
    dbObject.Users.findOne({ email: email }, async (err, user) => {
        //let tkn
        if (user) {
            if (password == user.password) {
                try {

                    // tkn = await user.generatAuthToken();
                    // console.log(tkn);
                    // res.cookie("JWT",tkn);
                    res.send({ Message: "Successfully Loged in", status: true, Privileges: user.privilegesvalues })
                }
                catch (err) { console.log(err) }
            }
            else {
                res.send({ Message: "Password did not match", status: false });
            }
        }
        else {
            res.send({ Message: "User not registered", status: false });
        }
    })
})

app.post('/register/user', (req, res) => {
    let roleIdObj = new ObjectID(req.body.roleId);
    var privileges;
    const { fname, lname, mobile, email, password, privilegesvalues, roleId } = req.body;
    dbObject.Roles.findOne({_id: req.body.roleId},(err, data)=>{
        if(data){
            privileges=data.defaultPrivileges;
        }
        else{
            res.send(err);
        }
    })
    dbObject.Users.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send("User already exist use an other email");
        }
        else {
            const newRow = new dbObject.Users({ fname, lname, mobile, email, password, privilegesvalues: privileges, roleId: roleIdObj })
            newRow.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successful Registered");
                }
            });
        }
    })
})

app.delete('/delete/:id', (req, res) => {
    try {
        dbObject.Users.findByIdAndRemove(req.params.id, { useFindAndModify: false }).then(() => {
            res.send("Successfully Deleted");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }




})

app.put('/update/:id', (req, res) => {
    console.log(req.body);
    let roleIdObj = new ObjectID(req.body.roleId);
    console.log(req.params.id);
    try {
        dbObject.Users.findByIdAndUpdate({ _id: req.params.id }, {
            fname: req.body.fname,
            lname: req.body.lname,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            roleId: roleIdObj
        }, { useFindAndModify: true }).then(() => {
            res.send("Successfully Updated");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})


//Manage User Roles 
app.get('/getuserRoles/userRoles', (req, res) => {
    dbObject.Roles.find((err, users) => {
        if (users) {

            res.send(users);
        }
        else {
            res.send(err);
        }
    })
});
app.post('/newrole/Add', (req, res) => {
    var defaultvalues;
    dbObject.section.aggregate([
        {
            $lookup: {
                from: "privileges",
                localField: "_id",
                foreignField: 'SectionId',
                as: 'privilegesdetail'
            }
        }
    ]).then((data) => {
        defaultvalues = genrateJson(data);
    }).catch(err => {
        res.send(err);
    })

    const { roletitle, description, defaultPrivileges } = req.body;
    dbObject.Roles.findOne({ roletitle: roletitle }, (err, role) => {
        if (role) {
            res.send("Role already exist add an other Role");
        }
        else {
            const newRole = new dbObject.Roles({ roletitle, description, defaultPrivileges: JSON.stringify(defaultvalues) })
            newRole.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successful Added New Role");

                }
            });
        }
    })
})
app.get('/roles/count', (req, res) => {
    dbObject.Roles.count().then((result) => {
        const pages = Math.ceil(result / 3);
        res.send({ result: result, pages: pages });
    }).catch((err) => {
        res.send(err);
    });
});
app.get('/filter/roles/:pageNo', (req, res) => {
    dbObject.Roles.find((err, users) => {
        if (users) {

            res.send(users);
        }
        else {
            res.send(err);
        }

    }).limit(3).skip((req.params.pageNo - 1) * 3);
});
app.delete('/role/delete/:id', (req, res) => {
    try {
        dbObject.Roles.findByIdAndRemove(req.params.id, { useFindAndModify: false }).then(() => {
            res.send("Successfully Deleted");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})
app.put('/role/update/:id', (req, res) => {
    try {
        dbObject.Roles.findByIdAndUpdate({ _id: req.params.id }, {
            roletitle: req.body.roletitle,
            description: req.body.description,
            defaultPrivileges: req.body.defaultPrivileges,
        }, { useFindAndModify: false }).then(() => {
            res.send("Successfully Updated");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})



//Manage Section


app.post('/newsec/Add', (req, res) => {
    const { sectitle, seckey } = req.body;
    dbObject.section.findOne({ sectiontitle: sectitle }, (err, sec) => {
        if (sec) {
            res.send("Section already exist add an other Section");
        }
        else {
            const newRole = new dbObject.section({ sectiontitle: sectitle, sectionkey: seckey })
            newRole.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successful Added New Section");

                }
            });
        }
    })
})

app.get('/sections/count', (req, res) => {
    dbObject.section.count().then((result) => {
        const pages = Math.ceil(result / 3);
        res.send({ result: result, pages: pages });
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/filter/sections/:pageNo', (req, res) => {
    dbObject.section.find((err, sec) => {
        if (sec) {

            res.send(sec);
        }
        else {
            res.send(err);
        }

    }).limit(3).skip((req.params.pageNo - 1) * 3);
});

app.delete('/sections/delete/:id', (req, res) => {
    try {
        dbObject.section.findByIdAndRemove(req.params.id, { useFindAndModify: false }).then(() => {
            res.send("Successfully Deleted");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})

app.put('/sections/update/:id', (req, res) => {
    try {
        dbObject.section.findByIdAndUpdate({ _id: req.params.id }, {
            sectiontitle: req.body.roletitle,
            sectionkey: req.body.description,
        }, { useFindAndModify: false }).then(() => {
            res.send("Successfully Updated");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})



// Privileges API

app.post('/newprivileges/Add', (req, res) => {
    let Pri_Id = new ObjectID(req.body.sectionId);
    const { sectionId, privilegestitle, privilegeskey } = req.body;
    let key = privilegestitle.split(" ").join("_");
    dbObject.Privileges.findOne({ SectionId: sectionId }, (err, privilege) => {
        if (privilege) {
            res.send("Privilege already exist add an other Privilege");
        }
        else {
            const newPrivilege = new dbObject.Privileges({ SectionId: Pri_Id, privilegestitle: privilegestitle, privilegeskey: key })
            newPrivilege.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successful Added New Privilege");
                }
            });
        }
    })
})

app.delete('/privileges/delete/:id', (req, res) => {
    try {
        dbObject.Privileges.findByIdAndRemove(req.params.id, { useFindAndModify: false }).then(() => {
            res.send("Successfully Deleted");
        }).catch(err => {
            res.send(err);
        });
    }
    catch (err) {
        res.send(err);
    }
})

app.put('/privileges/update/:id', (req, res) => {
    let key = req.body.privilegestitle.split(" ").join("_");
    try {
        dbObject.Privileges.findByIdAndUpdate({ _id: req.params.id }, {
            SectionId: req.body.sectionId,
            privilegestitle: req.body.privilegestitle,
            privilegeskey: key,
        }, { useFindAndModify: false }).then(() => {
            res.send("Successfully Updated");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})

app.get('/privileges/loadsections', (req, res) => {
    dbObject.section.find((err, users) => {
        if (users) {

            res.send(users);
        }
        else {
            res.send(err);
        }
    })
});

app.get('/privileges/count', (req, res) => {
    dbObject.Privileges.count().then((result) => {
        const pages = Math.ceil(result / 3);
        res.send({ result: result, pages: pages });
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/filter/privileges/:pageNo', (req, res) => {

    const skp = (req.params.pageNo - 1) * 3;
    dbObject.Privileges.aggregate([
        {
            $lookup: {
                from: "sections",
                localField: "SectionId",
                foreignField: '_id',
                as: 'sectiondetail'
            }
        },
        // { "$limit": 3 },
        // { "$skip": 0 }
    ]).then((data) => {
        res.send(data);
    }).catch(err => {
        res.send(err);
    })






    // dbObject.Privileges.find((err, data) => {
    //     if (data) {

    //         res.send(data);
    //     }
    //     else {
    //         res.send(err);
    //     }

    // }).limit(3).skip((req.params.pageNo - 1) * 3);
});

app.get('/userId/:id', (req, res) => {
    dbObject.Users.find({ _id: req.params.id }, (err, users) => {
        if (users) {
            const obj = JSON.parse(users[0].privilegesvalues);
            const secs = Object.keys(obj);
            const priv = Object.keys(obj[secs[0]])
            res.send({ sec: secs, pri: priv, all: obj })
        }
        else {
            res.send(err);
        }
    })
});
app.put('/updatePrivileges/:userid', (req, res) => {
    try {
        dbObject.Users.findByIdAndUpdate({ _id: req.params.userid }, {
            privilegesvalues: JSON.stringify(req.body),
        }, { useFindAndModify: true }).then(() => {
            res.send("Successfully Updated Re-Login for Update Changes");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})



app.get('/roleprivileges/:id', (req, res) => {
    dbObject.Roles.find({ _id: req.params.id }, (err, roles) => {
        if (roles) {
           // res.send(roles)

             const obj = JSON.parse(roles[0].defaultPrivileges);
            // res.send(obj)
            const secs = Object.keys(obj);
            const priv = Object.keys(obj[secs[0]])
            res.send({ sec: secs, pri: priv, all: obj })
        }
        else {
            res.send(err);
        }
    })
});
app.put('/updateRolePrivileges/:roleid', (req, res) => {
    try {
        dbObject.Roles.findByIdAndUpdate({ _id: req.params.roleid }, {
            defaultPrivileges: JSON.stringify(req.body),
        }, { useFindAndModify: true }).then(() => {
            res.send("Successfully Updated Re-Login for Update Changes");
        }).catch(err => {
            res.send(err);
        });

    }
    catch (err) {
        res.send(err);
    }
})


//json privileges

app.get('/json/privileges', (req, res) => {

    dbObject.section.aggregate([
        {
            $lookup: {
                from: "privileges",
                localField: "_id",
                foreignField: 'SectionId',
                as: 'privilegesdetail'
            }
        }
    ]).then((data) => {
        jsonobj1 = { ...data };
        jsonobj2 = jsonobj1[0].privilegesdetail
        res.send(jsonobj2);
    }).catch(err => {
        res.send(err);
    })

})

app.listen(9000, () => {
    console.log("Server Started at Port: 9000")
})