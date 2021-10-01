import React from 'react'
import './Login';
import Login from './Login';
import './Registration';
import Registration from './Registration';
import './LoginRegister.css'
import {Tabs,Tab} from 'react-bootstrap'
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useHistory } from 'react-router';

export default function LoginRegister() {
    const [tbtn,settbtn]=useState("Sigin");
    const usehistory=useHistory();
    const [login,setLogin]=useState({email: "",password: ""});
    const [user,setUser]=useState({fname: "",lname: "",mobile: "",email: "",password: "",privilegesvalues: "",roleId:null});

    const [json,setjson]=useState({});

    const GetPrivilegeJson=()=>{
        axios.get(`http://localhost:9000/join/test`).then(res => {
            setjson(res.data);
        }).catch(err => { alert(err) });
    }
    useEffect(()=>{
        GetPrivilegeJson();
    },[])
    let name , value;
    const LoginhandleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value= e.target.value;
        setLogin({...login,[name]:value});
    }

    const RegisterhandleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value= e.target.value;
        setUser({...user,[name]:value});
    } 

    const RegPostData=async(e)=>
    {
        e.preventDefault();
        const {fname,lname,mobile,email,password}=user; 
        if(fname&& lname && mobile && email && password)
        {
            user.privilegesvalues=JSON.stringify(json);
            if(validate(email)===true)
            {
                axios.post("http://localhost:9000/register/user",user).then(res=>{
                    window.location.href="http://localhost:3000/Login";
                })
                .catch(err=>{alert(err)});
            }
            else
            {
                document.getElementById("message").innerText="Please Enter valid email with domain @donesol.co.uk";
            }
            
        }
        else
        {
            alert("invalid values");
        }
    };

    const LogPostData=async(e)=>{
        e.preventDefault();
        const {email,password}=login;
        console.log(login);
        if( email && password)
        {
            axios.post("http://localhost:9000/user/login",login).then(res=>{
                alert(res.data.Message);
                if(res.data.status)
                {
                    localStorage.setItem("token",res.data.Privileges);
                    window.location.href="http://localhost:3000/";
                    //usehistory.push("/");
                }
                
            })
            .catch(err=>alert(err));
        }
        else
        {
            alert("invalid values");
        }
        
    };

    const validate=(t)=>{
        const text=/^[A-Za-z0-9]{3,}@donesol.co.uk$/;
        if(text.test(t))
        {

            return true;
        }else
        {
            return false;
        }

    }

    return (
        <>

        <div className="main">
            <Tabs defaultActiveKey={tbtn} id="uncontrolled-tab-example" className="clr mb-3">
                <Tab  eventKey="Sigin" title="SigIn">
                <Login PostData={LogPostData} user={login} handleInputs={LoginhandleInputs}/>
                </Tab>
                <Tab eventKey="SignUp" title="SignUp">
                <Registration  PostData={RegPostData} user={user} handleInputs={RegisterhandleInputs} /> 
                </Tab>
            </Tabs>
        </div>


            
            
 
        </>
    )
}
