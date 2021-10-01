import React from 'react'
import { Button, TextField } from '@material-ui/core';
import Fab from '@material-ui/core/Fab'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add'
import BorderColorIcon from '@material-ui/icons/BorderColor';
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
import './ManageRoles.css'
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios'
import '../Update'
export default function ManagesRoles() {
    const usehistory = useHistory();
    var obj;
    var sectionskeys;
    var privilegeskeys;

    const token = localStorage.getItem("token");
    if (token == null) {
        usehistory.push("/Login");
    }
    else {

        obj = JSON.parse(token);
        sectionskeys = Object.keys(obj);
        privilegeskeys = Object.keys(obj[sectionskeys[0]]);

    }
    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecords, setTotalRecodrs] = useState(0);
    const [roles, setRoles] = useState([]);
    const [temp, settemp] = useState(false);
    const [show, setState] = useState(false);
    const [sts, setSts] = useState(false);
    const [edituser, setEditUser] = useState({ _id: null, roletitle: "", description: "", defaultPrivileges: "" });
    const [newrole, setNewRole] = useState({ roletitle: "", description: "", defaultPrivileges: "" });

    const getAllDatacount = () => {
        axios.get("http://localhost:9000/roles/count").then(res => {
            setTotalRecodrs(res.data.result);
            setTotalPages(res.data.pages);
        }).catch(err => { alert(err) });
    }
    const loadPageNoData = () => {
        axios.get(`http://localhost:9000/filter/roles/${pageNo}`).then(res => {
            setRoles(res.data);
        }).catch(err => { alert(err) });
    }

    useEffect(() => {
        getAllDatacount();
        if (totalPages == 1) {
            document.getElementById("pre-btn").disabled = true;
            document.getElementById("next-btn").disabled = true;
        }
        loadPageNoData();

    }, [])

    const nextPage = () => {
        setPageNo(pageNo + 1);
    }
    const previousPage = () => {
        setPageNo(pageNo - 1);
    }
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        setEditUser({ ...edituser, [name]: value });
    }
    const handleRoleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        setNewRole({ ...newrole, [name]: value });
    }
    function handleModal(usr) {
        if (show) {
            settemp(1);
            setState(!show);

        }
        else {
            console.log(edituser);
            setEditUser(usr);
            setState(!show);
        }

    }

    useEffect(() => {
        getAllDatacount();
        loadPageNoData();
    }, [temp]);

    useEffect(() => {
        if (pageNo === 1) {
            document.getElementById("pre-btn").disabled = true;
            document.getElementById("next-btn").disabled = false;

        } else if (pageNo === totalPages) {
            document.getElementById("pre-btn").disabled = false;
            document.getElementById("next-btn").disabled = true;
        }
        else {
            document.getElementById("pre-btn").disabled = false;
            document.getElementById("next-btn").disabled = false;
        }
        loadPageNoData();
    }, [pageNo, show]);

    const delRole = (id) => {
        axios.delete(`http://localhost:9000/role/delete/${id}`).then(res => {
            // alert(res.data);
            settemp(!temp);
        }).catch(err => { alert(err) });

    }

    const editRole = (e) => {
        axios.put(`http://localhost:9000/role/update/${edituser._id}`, edituser).then(res => {
            setState(false);
        }).catch(err => { alert(err) });

    }
    const AddNewRole = (e) => {
        if (newrole.roletitle && newrole.description) {
            e.preventDefault();
            const { roletitle, description, defaultPrivileges } = newrole;
            axios.post("http://localhost:9000/newrole/Add", newrole).then(res => {
                alert(res.data);
                setSts(false);
                settemp(!temp);
            }).catch(err => { alert(err) });
        }



    }
    const loadUser = (usr) => {
        handleModal(usr);
    }

    return (
        <>
            {/* Add modal*/}
            <Modal show={sts} style={{ width: "350px", marginLeft: "40%" }}>
                <Modal.Header /*closeButton*/>
                    <Modal.Title>Add New Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <TextField style={{ marginBottom: "10px" }} size="small" color="primary" variant="outlined" fullWidth required label="Role Title" type="text" name="roletitle" value={newrole.roletitle} onChange={handleRoleInputs} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} size="small" color="primary" variant="outlined" fullWidth required label="Description" type="text" name="description" value={newrole.description} onChange={handleRoleInputs} />
                        <br />
                        <Button style={{ marginRight: "10px" }} onClick={() => setSts(!sts)} variant="contained" color="secondary">Close</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={AddNewRole}>Save changes</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            {/*edit modal*/}
            <Modal show={show} style={{ width: "350px", marginLeft: "40%" }}>
                <Modal.Header  /*closeButton*/>
                    <Modal.Title>{edituser._id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Role Title" type="text" name="roletitle" value={edituser.roletitle} onChange={handleInputs} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Description" type="text" name="description" value={edituser.description} onChange={handleInputs} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Default Privileges" type="text" name="defaultPrivileges" value={edituser.defaultPrivileges} onChange={handleInputs} />
                        <br />
                        <Button style={{ marginRight: "10px" }} onClick={() => handleModal()} variant="contained" color="secondary">Close</Button>
                        <Button variant="contained" color="primary" onClick={editRole}>Save changes</Button>
                    </form>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <div hidden={!obj[sectionskeys[1]][privilegeskeys[2]]} className="container-fluid">
                <label className="heading" style={{ backgroundColor: "#0D6EFD", marginTop: "25px" }}>Manage User Roles</label>
                <Fab hidden={!obj[sectionskeys[1]][privilegeskeys[0]]} style={{ marginLeft: "95%" }} color="primary" aria-label="add">
                    <AddIcon onClick={() => setSts(!sts)} color="green" />
                </Fab>
                <table style={{ position: "absolute", top: "150px" }} className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr>
                                <td>{role.roletitle}</td>
                                <td>{role.description}</td>
                                <td style={{ width: "200px" }} className="tdw">
                                    <IconButton id="deleteBtn" hidden={!obj[sectionskeys[1]][privilegeskeys[1]]} variant="contained" color="secondary">
                                        <DeleteIcon onClick={() => delRole(role._id)} type="submit" />
                                    </IconButton>
                                    <IconButton id="updateBtn" hidden={!obj[sectionskeys[1]][privilegeskeys[3]]} variant="contained" color="primary">
                                        <BorderColorIcon onClick={() => loadUser(role)} type="submit" />
                                    </IconButton>
                                    <IconButton variant="contained" color="primary">
                                        <Link to={`/SetRolePrivileges/${role._id}`} ><MoreVertIcon type="submit" /> </Link>
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div id="btn-div">
                <IconButton id="pre-btn" className="btn btn-primary"  >
                    <FastRewindIcon style={{ color: "black" }} onClick={previousPage} />
                </IconButton>

                <IconButton id="next-btn" className="btn btn-primary"  >
                    <FastForwardIcon style={{ color: "black" }} onClick={nextPage} />
                </IconButton>
                {/* <button id="pre-btn" onClick={previousPage} className="btn btn-primary m m-2">Previous</button> */}
                {/* <button id="next-btn" onClick={nextPage} className="btn btn-primary m-2">Next</button> */}
            </div>
        </>
    )
}
