import React from 'react'
import {  Button, TextField,Select,MenuItem } from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete'
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Home.css'
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from '../../../back_end/node_modules/axios'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './Update'
import { Link } from 'react-router-dom';
export default function Home() {
    const usehistory = useHistory();
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecodrs] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    // const [count,setcount]=useState(0);
    const [temp, settemp] = useState(0);
    const [show, setState] = useState(false);
    const [users, setUser] = useState([]);
    const [roles, setRoles] = useState([]);
    const [edituser, setEditUser] = useState({ _id: null, fname: "", lname: "", mobile: "", email: "", password: "",roleId:null });
    const [privileges,SetPrivileges]=useState([]);

    const getAllDatacount = () => {
        axios.get("http://localhost:9000/record/count").then(res => {
            setTotalRecodrs(res.data.result);
            setTotalPages(res.data.pages);
        }).catch(err => { alert(err) });
    }
    const loadPageNoData = () => {
        axios.get(`http://localhost:9000/filter/${pageNo}`).then(res => {
            setUser(res.data);
        }).catch(err => { alert(err) });
    }
    const nextPage = () => {
        setPageNo(pageNo + 1);

    }
    const previousPage = () => {
        setPageNo(pageNo - 1);
    }

    var obj;
    var sectionskeys;
    var privilegeskeys;

    const token = localStorage.getItem("token");
    if (token === null) {
        usehistory.push("/Login");
    }
    else{
        obj=JSON.parse(token);
        sectionskeys=Object.keys(obj);
        privilegeskeys=Object.keys(obj[sectionskeys[0]]);

    }
    let name, value;
    const handleInputs = (e) => {
       // console.log(e);
        name = e.target.name;
        value = e.target.value;
        setEditUser({ ...edituser, [name]: value });
    }
    function handleModal(usr) {
        if (show) {
            settemp(1);
            setState(!show);

        }
        else {
            setEditUser(usr);
            setState(!show);
        }

    }

    useEffect(() => {
        getAllDatacount();
        loadPageNoData();
    }, [temp]);

    useEffect(() => {
        getAllRoles();
        loadPageNoData();
        if (pageNo === 1) {
            document.getElementById("pre-btn").disabled = true;
        } else if (pageNo === totalPages) {
            document.getElementById("pre-btn").disabled = false;
            document.getElementById("next-btn").disabled = true;
        }
        else {
            document.getElementById("pre-btn").disabled = false;
            document.getElementById("next-btn").disabled = false;
        }
    }, [pageNo, show]);

    const delUser = (usr) => {
        axios.delete(`http://localhost:9000/delete/${usr}`).then(res => {
            alert(res.data);
            settemp(1);
        }).catch(err => { alert(err) });
    }

    const updateUser = () => {
        if (edituser.fname && edituser.lname && edituser.mobile && edituser.email && edituser.password) {
            axios.put(`http://localhost:9000/update/${edituser._id}`, edituser).then(res => {
                setState(false);
            }).catch(err => { alert(err) });

        }

    }
    const loadUser = (usr) => {
        handleModal(usr);
    }

    const PrivilegesPage=()=>{
        usehistory.push("/SetPrivileges");
    }

    const getAllRoles = () => {
        axios.get("http://localhost:9000/getuserRoles/userRoles").then((res) => {
            setRoles(res.data);
           // console.log(res.data);
        }).catch((err) => { alert(err) });
    }

    return (
        <>
            {/* Modal for edit user */}
            <Modal show={show} style={{ width: "350px", marginLeft: "40%" }}>
                <Modal.Header  /*closeButton*/>
                    <Modal.Title>{edituser._id}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form>
                        <TextField required size="small" style={{ marginBottom: "10px", marginTop: "10px" }} color="primary" variant="outlined" fullWidth label="First Name" type="text" name="fname" value={edituser.fname} onChange={handleInputs} />
                        <br />
                        <TextField required size="small" style={{ marginBottom: "10px" }} color="primary" variant="outlined" fullWidth label="Lstst Name" type="text" name="lname" value={edituser.lname} onChange={handleInputs} />
                        <br />
                        <TextField required size="small" style={{ marginBottom: "10px" }} color="primary" variant="outlined" fullWidth label="Mobile" type="number" name="mobile" value={edituser.mobile} onChange={handleInputs} />
                        <br />
                        <TextField required size="small" style={{ marginBottom: "10px" }} color="primary" variant="outlined" fullWidth label="Email" type="email" name="email" value={edituser.email} onChange={handleInputs} />
                        <br />
                        <TextField required size="small" style={{ marginBottom: "10px" }} color="primary" variant="outlined" fullWidth label="Password" type="Password" name="password" value={edituser.password} onChange={handleInputs} />
                        <br />
                        <Select required style={{ marginBottom: "10px" }} fullWidth size="small" variant="outlined" name="roleId" value={edituser.roleId} onChange={handleInputs} label="Role">
                            {
                                roles.map((role) => (
                                    <MenuItem value={role._id}>{role.roletitle}</MenuItem>
                                ))
                            }
                        </Select>

                        <Button style={{ marginRight: "10px" }} variant="contained" color="secondary" onClick={() => handleModal()} >Close</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={() => updateUser()}>Save changes</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>

            </Modal>

            {/* users table */}
            <div className="container-fluid">
                <label className="heading" style={{ backgroundColor: "#0D6EFD", marginTop: "25px" }}>All Registered Users</label>
                <Fab hidden={!obj[sectionskeys[0]][privilegeskeys[0]]} style={{ marginLeft: "95%" }} color="primary" aria-label="add">
                   <Link to="/Login"> <AddIcon /></Link>
                </Fab>
                <table style={{position: "absolute", top: "150px"}}  className="mycss table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.fname}</td>
                                <td>{user.lname}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                <td style={{width: "200px"}} className="tdw">
                                    <IconButton id="deleteBtn" hidden={!obj[sectionskeys[0]][privilegeskeys[1]]} variant="contained" color="secondary">
                                        <DeleteIcon onClick={() => delUser(user._id)} type="submit" />
                                    </IconButton>
                                    <IconButton id="updateBtn" hidden={!obj[sectionskeys[0]][privilegeskeys[3]]} variant="contained" color="primary">
                                        <BorderColorIcon onClick={() => loadUser(user)} type="submit" />
                                    </IconButton>
                                    <IconButton variant="contained" color="primary">
                                    <Link to={`/SetPrivileges/${user._id}`} ><MoreVertIcon type="submit"/> </Link>
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* next && previous button */}
            <div id="btn-div">
                <IconButton id="pre-btn" className="btn btn-primary"  >
                    <FastRewindIcon style={{ color: "black" }} onClick={previousPage} />
                </IconButton>
                <IconButton id="next-btn" className="btn btn-primary"  >
                    <FastForwardIcon style={{ color: "black" }} onClick={nextPage} />
                </IconButton>
            </div>
        </>
    )
}
