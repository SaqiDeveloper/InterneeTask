import React from 'react'
import { Button, TextField } from '@material-ui/core';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import BorderColorIcon from '@material-ui/icons/BorderColor';
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import 'bootstrap/dist/css/bootstrap.min.css'
import './ManageSections.css'
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
    if (token === null) {
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
    const [sec, setSec] = useState([]);
    const [temp, settemp] = useState(false);
    const [show, setState] = useState(false);
    const [sts, setSts] = useState(false);
    const [editsec, setEditsec] = useState({ _id: null, sectiontitle: "", sectionkey: "" });
    const [newSec, setnewSec] = useState({ sectitle: "", seckey: "" });
    const getAllDatacount = () => {
        axios.get("http://localhost:9000/sections/count").then(res => {
            setTotalRecodrs(res.data.result);
            setTotalPages(res.data.pages);
        }).catch(err => { alert(err) });
    }
    const loadPageNoData = () => {
        axios.get(`http://localhost:9000/filter/sections/${pageNo}`).then(res => {
            setSec(res.data);
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
        setEditsec({ ...editsec, [name]: value });
    }
    const handleSecInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        newSec.seckey = value.split(" ").join("_");
        setnewSec({ ...newSec, [name]: value });

    }
    function handleModal(secdata) {
        if (show) {
            settemp(1);
            setState(!show);

        }
        else {
            console.log(secdata);
            // console.log(editsec);
            setEditsec(secdata);
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

    const delSection = (id) => {
        axios.delete(`http://localhost:9000/sections/delete/${id}`).then(res => {
            // alert(res.data);
            settemp(!temp);
        }).catch(err => { alert(err) });

    }

    const editSection = () => {
        if (editsec.sectiontitle && editsec.setionckey) {
            axios.put(`http://localhost:9000/sections/update/${editsec._id}`, editsec).then(res => {
                setState(false);
            }).catch(err => { alert(err) });

        }


    }
    const AddNewSec = (e) => {

        // const {sectitle,seckey}=newSec;
        if (newSec.sectitle && newSec.seckey) {
            e.preventDefault();
            axios.post("http://localhost:9000/newsec/Add", newSec).then(res => {
                setSts(false);
                settemp(!temp);
            }).catch(err => { alert(err) });
        }



    }
    const loadSection = (secData) => {
        console.log(secData);
        handleModal(secData);
    }

    return (
        <>
            {/* Add modal*/}
            <Modal show={sts} style={{ width: "350px", marginLeft: "40%" }}>
                <Modal.Header /*closeButton*/>
                    <Modal.Title>Add New Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Section Title" type="text" name="sectitle" value={newSec.sectitle} onChange={handleSecInputs} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Section Key" disabled type="text" name="seckey" value={newSec.seckey} />
                        <br />
                        <Button style={{ marginRight: "10px" }} onClick={() => setSts(!sts)} color="secondary" variant="contained">Close</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={AddNewSec}>Save Section</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            {/*edit modal*/}
            <Modal show={show} style={{ width: "355px", marginLeft: "40%" }}>
                <Modal.Header  /*closeButton*/>
                    <Modal.Title>{editsec._id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Section Title" type="text" name="sectiontitle" value={editsec.sectiontitle} onChange={handleInputs} />
                        <br />
                        <TextField style={{ marginBottom: "10px" }} color="primary" size="small" variant="outlined" fullWidth required label="Section Key" type="text" name="sectionkey" value={editsec.sectionkey} onChange={handleInputs} />
                        <br />
                        <Button style={{ marginRight: "10px" }} onClick={() => handleModal()} variant="contained" color="secondary">Close</Button>
                        <Button type="submit" color="primary" variant="contained" onClick={editSection}>Save changes</Button>
                    </form>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            <div hidden={!obj[sectionskeys[2]][privilegeskeys[2]]} className="container-fluid">
                <label className="heading" style={{ backgroundColor: "#0D6EFD", marginTop: "25px" }}>Manage Section</label>
                <Fab hidden={!obj[sectionskeys[2]][privilegeskeys[0]]} style={{ marginLeft: "95%" }} color="primary" aria-label="add">
                    <AddIcon onClick={() => setSts(!sts)} color="green" />
                </Fab>
                <table style={{ position: "absolute", top: "150px" }} className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Section ID</th>
                            <th>Section Title</th>
                            <th>Section Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sec.map((sec2) => (
                            <tr>
                                <td>{sec2._id}</td>
                                <td>{sec2.sectiontitle}</td>
                                <td>{sec2.sectionkey}</td>
                                <td id="tdw">
                                    <IconButton hidden={!obj[sectionskeys[2]][privilegeskeys[1]]} variant="contained" color="secondary">
                                        <DeleteIcon onClick={() => delSection(sec2._id)} type="submit" />
                                    </IconButton>
                                    <IconButton hidden={!obj[sectionskeys[2]][privilegeskeys[3]]} variant="contained" color="primary">
                                        <BorderColorIcon onClick={() => loadSection(sec2)} type="submit" />
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
            </div>
        </>
    )
}
