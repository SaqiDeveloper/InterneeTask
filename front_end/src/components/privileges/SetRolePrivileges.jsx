import React from 'react'
import { Container, Paper, Typography, FormLabel, Radio, Button, RadioGroup, FormControlLabel } from '@material-ui/core';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router';

export default function SetPrivileges() {
    const usehistory = useHistory();
    const [data, setdata] = useState([]);
    const { userId } = useParams();
    const [sectionkeys, setSectionKeys] = useState([]);
    const [privilegeskeys, setprivilegesKeys] = useState([]);


    const LoadData = () => {
        axios.get(`http://localhost:9000/roleprivileges/${userId}`).then(res => {
            setdata(res.data.all);
            setSectionKeys(res.data.sec);
            setprivilegesKeys(res.data.pri)
        }).catch(err => { alert(err) });
    }
    const handleRadio = (val, r, k) => {
        let v;
        if (val === "true") {
            v = true;
        }
        else {
            v = false
        }
        data[r][k] = v;
    }

    useEffect(() => {
        LoadData();
    }, [])

    const updatePrivileges = () => {
        axios.put(`http://localhost:9000/updateRolePrivileges/${userId}`, data).then(res => {
            alert(res.data);
            usehistory.push("/Manageroles");
        })
            .catch(err => { alert(err) });
    }
    return (
        <>
            <Container maxWidth="sm">
                <Paper elevation={10}>
                    <div style={{ backgroundColor: "#0D6EFD", marginTop: "10px", borderRadius: "25px 25px 0px 0px" }}>
                        <Typography style={{ color: "white", marginLeft: "150px", backgroundColor: "primary", fontWeight: "bold", fontSize: "40px" }} m="auto">
                            Set Role Privileges
                        </Typography>
                    </div>

                    <hr />
                    {
                        sectionkeys.map((row) => (
                            <div key={row}>
                                <div style={{ backgroundColor: "#0D6EFD", borderRadius: "25px 25px 0px 0px", marginTop: "10px" }}>
                                    <Typography style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: "20px" }} >
                                        {row}
                                    </Typography>
                                </div>
                                {
                                    privilegeskeys.map((key) => (
                                        <div key={key}>
                                            <div style={{ display: "flex" }}>
                                                <FormLabel style={{ marginLeft: "10px", marginTop: "15px" }}>{key}</FormLabel>
                                                <div style={{ position: "absolute", left: "550px", paddingBottom: "20px" }}>
                                                    <RadioGroup defaultValue={data[row][key] ? "true" : "false"} style={{ marginLeft: "20px" }} row name="row-radio-buttons-group">
                                                        <FormControlLabel onChange={(e) => handleRadio(e.target.value, row, key)} value="true" control={<Radio />} label="TRUE" />
                                                        <FormControlLabel onChange={(e) => handleRadio(e.target.value, row, key)} value="false" control={<Radio />} label="FALSE" />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                    <Button style={{ marginTop: "10px", marginLeft: "140px", marginRight: "10px", marginBottom: "20px" }} variant="contained" color="primary">Cancel</Button>
                    <Button onClick={updatePrivileges} style={{ marginTop: "10px", marginBottom: "20px" }} variant="contained" color="primary" type="submit">Save Changes</Button>
                    <hr />
                </Paper>
            </Container>
        </>
    )
}
