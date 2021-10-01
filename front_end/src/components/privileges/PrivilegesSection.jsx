import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PrivilegesSection.css';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, TextField, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import '../Update';
export default function ManagesPrivileges() {
    const usehistory = useHistory();

    var obj;
    var sectionskeys;
    var privilegeskeys;

    const token = localStorage.getItem("token");
    if (token == null) {
        usehistory.push("/Login");
    }
    else {

        //console.log(token);
        obj = JSON.parse(token);
        sectionskeys = Object.keys(obj);
        privilegeskeys = Object.keys(obj[sectionskeys[0]]);

    }




    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecords, setTotalRecodrs] = useState(0);
    const [pri, setpri] = useState([]);
    const [temp, settemp] = useState(false);
    const [show, setState] = useState(false);
    const [sts, setSts] = useState(false);
    const [editprivileges, seteditprivileges] = useState({ _id: null, sectionId: null, privilegestitle: "", privilegeskey: "" });
    const [newprivileges, setnewprivileges] = useState({ sectionId: "", privilegestitle: "", privilegeskey: "" });
    const [sections, setSection] = useState([]);
    const getAllDatacount = () => {
        axios.get("http://localhost:9000/privileges/count").then(res => {
            setTotalRecodrs(res.data.result);
            setTotalPages(res.data.pages);
        }).catch(err => { alert(err) });
    }
    const loadPageNoData = () => {
        axios.get(`http://localhost:9000/filter/privileges/${pageNo}`).then(res => {
            setpri(res.data);
        }).catch(err => { alert(err) });
    }
    useEffect(() => {
        loadSections();
        getAllDatacount();
        if (totalPages == 1) {
            document.getElementById("pre-btn").disabled = true;
            document.getElementById("next-btn").disabled = true;
        }
        loadPageNoData();
    }, [])
    // const nextPage = () => {
    //     setPageNo(pageNo + 1);
    // }
    // const previousPage = () => {
    //     setPageNo(pageNo - 1);
    // }
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        seteditprivileges({ ...editprivileges, [name]: value });
    }
    const handleInputs2 = (e) => {
        name = e.target.name;
        value = e.target.value;
        editprivileges.privilegeskey = value.split(" ").join("_");
        seteditprivileges({ ...editprivileges, [name]: value });
    }
    const handlePrivilegesInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        setnewprivileges({ ...newprivileges, [name]: value });
    }
    const handlePrivilegesInputs2 = (e) => {
        name = e.target.name;
        value = e.target.value;
        newprivileges.privilegeskey = value.split(" ").join("_");
        setnewprivileges({ ...newprivileges, [name]: value });
    }
    function handleModal(Data) {
        if (show) {
            settemp(1);
            setState(!show);

        }
        else {
            seteditprivileges(Data);
            setState(!show);
        }

    }
    useEffect(() => {
        getAllDatacount();
        loadPageNoData();
    }, [temp]);
    useEffect(() => {
        // if (pageNo === 1) {
        //     document.getElementById("pre-btn").disabled = true;
        //     document.getElementById("next-btn").disabled = false;

        // } else if (pageNo === totalPages) {
        //     document.getElementById("pre-btn").disabled = false;
        //     document.getElementById("next-btn").disabled = true;
        // }
        // else {
        //     document.getElementById("pre-btn").disabled = false;
        //     document.getElementById("next-btn").disabled = false;
        // }
        loadPageNoData();
    }, [pageNo, show]);
    const delPrivilege = (id) => {
        axios.delete(`http://localhost:9000/privileges/delete/${id}`).then(res => {
            settemp(!temp);
        }).catch(err => { alert(err) });

    }
    const editPrivilege = () => {
        if (editprivileges.privilegestitle && editprivileges.privilegeskey) {
            axios.put(`http://localhost:9000/privileges/update/${editprivileges._id}`, editprivileges).then(res => {
                setState(false);
            }).catch(err => { alert(err) });
        }

    }
    const AddNewPrivilege = (e) => {
        if (newprivileges.sectionId && newprivileges.privilegestitle && newprivileges.privilegeskey) {
            e.preventDefault();
            const { sectionId, privilegestitle, privilegeskey } = newprivileges;
            axios.post("http://localhost:9000/newprivileges/Add", newprivileges).then(res => {
                setSts(false);
                settemp(!temp);
            }).catch(err => { alert(err) });
        }

    }
    const loadSections = () => {
        axios.get("http://localhost:9000/privileges/loadsections").then((res) => {
            setSection(res.data);
            // console.log(res.data);
        }).catch((err) => { alert(err) });
    }
    const loadPrivileges = (Data) => {
        handleModal(Data);
    }

    return (
        <>
            {/* Add new modal*/}
            <Modal show={sts} style={{ width: "350px", marginLeft: "40%" }}>
                <Modal.Header>
                    <Modal.Title>Add New Privilege</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Select style={{ marginBottom: "10px" }} variant="outlined" size="small" name="sectionId" value={newprivileges.sectionId} onChange={handlePrivilegesInputs} fullWidth label="Role">
                            {
                                sections.map((sec) => (
                                    <MenuItem value={sec._id}>{sec.sectiontitle}</MenuItem>
                                ))
                            }
                        </Select>
                        <br />
                        <TextField style={{ marginBottom: "10px" }} variant="outlined" size="small" color="primary" fullWidth required label="Privileges Title" type="text" name="privilegestitle" value={newprivileges.privilegestitle} onChange={handlePrivilegesInputs2} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} variant="outlined" size="small" color="primary" fullWidth required label="Privileges Key" type="text" name="privilegeskey" disabled value={newprivileges.privilegeskey} />
                        <br />
                        <Button style={{ marginRight: "10px" }} variant="contained" onClick={() => setSts(!sts)} color="secondary">Close</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={AddNewPrivilege}>Save Privilege</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            {/*edit/update modal*/}
            <Modal show={show} style={{ width: "355px", marginLeft: "40%" }}>
                <Modal.Header >
                    <Modal.Title>{editprivileges._id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Select style={{ marginBottom: "10px" }} variant="outlined" size="small" name="sectionId" value={editprivileges.sectionId} onChange={handleInputs} fullWidth label="Role">
                            {
                                sections.map((sec) => (
                                    <MenuItem value={sec._id}>{sec.sectiontitle}</MenuItem>
                                ))
                            }
                        </Select>
                        <TextField style={{ marginBottom: "10px" }} variant="outlined" size="small" color="primary" fullWidth required label="Privilege Title" type="text" name="privilegestitle" value={editprivileges.privilegestitle} onChange={handleInputs2} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} variant="outlined" size="small" color="primary" fullWidth required label="Privilege Key" type="text" name="seckey" disabled value={editprivileges.privilegeskey} />
                        <br />
                        <Button style={{ marginRight: "10px" }} variant="contained" onClick={() => handleModal()} color="secondary">Close</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={editPrivilege}>Save changes</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            {/* Table to view the data */}
            <div hidden={!obj[sectionskeys[3]][privilegeskeys[2]]} className="container-fluid">
                <label className="heading" style={{ backgroundColor: "#0D6EFD", marginTop: "25px" }}>Manages Privileges Types</label>
                <Fab hidden={!obj[sectionskeys[3]][privilegeskeys[0]]} style={{ marginLeft: "95%" }} color="primary" aria-label="add">
                    <AddIcon onClick={() => setSts(!sts)} color="green" />
                </Fab>
                <table style={{ position: "absolute", top: "150px" }} className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Section Title</th>
                            <th>Privileges Title</th>
                            <th>Privileges Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pri.map((row) => (
                            <tr>
                                <td>{row.sectiondetail[0].sectiontitle}</td>
                                <td>{row.privilegestitle}</td>
                                <td>{row.privilegeskey}</td>
                                <td id="tdw">
                                    <IconButton hidden={!obj[sectionskeys[3]][privilegeskeys[1]]} variant="contained" color="secondary">
                                        <DeleteIcon onClick={() => delPrivilege(row._id)} type="submit" />
                                    </IconButton>
                                    <IconButton hidden={!obj[sectionskeys[3]][privilegeskeys[3]]} variant="contained" color="primary">
                                        <BorderColorIcon onClick={() => loadPrivileges(row)} type="submit" />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <div id="btn-div">
                <IconButton id="pre-btn" className="btn btn-primary"  >
                    <FastRewindIcon style={{ color: "black" }} onClick={previousPage} />
                </IconButton>

                <IconButton id="next-btn" className="btn btn-primary"  >
                    <FastForwardIcon style={{ color: "black" }} onClick={nextPage} />
                </IconButton>
            </div> */}
        </>
    )
}
