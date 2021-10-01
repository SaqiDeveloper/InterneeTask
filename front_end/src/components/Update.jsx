import React from 'react'
import 'react-dom'
import './Update.css'
import axios from '../../../back_end/node_modules/axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router'
export default function Registration() {
    const {id}=useParams();
    const [user, setUser] = useState(
        { fname: "", lname: "", mobile: "", email: "", password: "" });
    let name, value;
    const handleInputs = (e) => {
        //console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({ ...user, [name]: value });

    }
    useEffect(() =>{
        loadUser();
    },[]);

    const loadUser=async()=>{
        alert(id);
        const result=await axios.get(`http://localhost:9000/${id}`);
        console.log(result);
        setUser(result);

    }
    const PostData = async (e) => {
        e.preventDefault();
        const { fname, lname, mobile, email, password } = user;
        if (fname && lname && mobile && email && password) {
            if (validate(email) === true) {
                axios.post("http://localhost:9000/update", user).then(res => alert(res.data))
                    .catch(err => { alert(err) });
                //usehistory.push("/");
            }
            else {
                document.getElementById("message").innerText = "Please Enter valid email with domain @donesol.co.uk";
            }

        }
        else {
            alert("invalid values");
        }

    };
    const validate = (t) => {
        const text = /^[A-Za-z0-9]{3,}@donesol.co.uk$/;
        if (text.test(t)) {

            return true;
        } else {
            return false;
        }

    }



    return (
        <>
            <div id="regform" className="container">
                <h2 className="py-1 text-center">Update User</h2>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input placeholder="First Name" name="fname" type="text" className="form-control"
                                value={user.fname}
                                onChange={handleInputs} />
                        </div>

                        <div className="form-group">
                            <input placeholder="Last Name" name="lname" type="text" className="form-control"
                                value={user.lname}
                                onChange={handleInputs} />
                        </div>

                        <div className="form-group">
                            <input placeholder="Mobile" type="tel" name="mobile" className="form-control"
                                value={user.mobile}
                                onChange={handleInputs} />
                        </div>

                        <div className="form-group">
                            <input placeholder="exmaple@donesol.co.uk" name="email" type="email" className="form-control"
                                value={user.email}
                                onChange={handleInputs} />
                            <span id="message"></span>
                        </div>

                        <div className="form-group">
                            <input placeholder="Password" name="password" type="password" className="form-control"
                                value={user.password}
                                onChange={handleInputs} />
                        </div>
                        <div className="form-group">
                            <input onClick={PostData} type="submit" id="btn" to="/" className="form-control btn btn-primary" value="Update" />

                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}
