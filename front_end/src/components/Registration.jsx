import React from 'react'
import 'react-dom'
import { useEffect,useState } from 'react'
import './Registration.css'
import {Paper, Button, Container, Box, Typography, Link, TextField,Select,MenuItem } from '@material-ui/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'



export default function Registration(props) {
    const [roles,setRoles]=useState([]);
    const getAllRoles=()=>{
        axios.get("http://localhost:9000/getuserRoles/userRoles").then((res)=>{
            setRoles(res.data);
            console.log(res.data);
        }).catch((err)=>{alert(err)});
    }
    useEffect(() => {
        getAllRoles();
    }, [])
    return (
            <Container maxWidth="sm">
            <Paper elevation={10} mx="auto" >
            <Typography style={{marginTop: "10px",marginLeft: "80px",paddingTop: "10px"}} variant="h5">
            Registration Form
                    </Typography>
                <Box component="form" width="70%" mx="auto" mt={2}  >
                    <TextField required style={{marginBottom: "10px"}} fullWidth size="small" variant="outlined" type ="text" label="First Name" name="fname"  value={props.user.fname} onChange={props.handleInputs}/>
                    <br/>
                    <TextField required style={{marginBottom: "10px"}} fullWidth size="small" variant="outlined" type ="text" label="Last Name" name="lname" value={props.user.lanme} onChange={props.handleInputs} />
                    <br/>
                    <TextField required style={{marginBottom: "10px"}} fullWidth size="small" variant="outlined" type ="tel" label="Mobile" name="mobile"  value={props.user.mobile} onChange={props.handleInputs} />
                    <br/>
                    <TextField required style={{marginBottom: "10px"}} fullWidth size="small" variant="outlined" type ="email" label="Email" name="email" value={props.user.email} onChange={props.handleInputs}/>
                    <br/>
                    <TextField required style={{marginBottom: "10px"}} fullWidth size="small" variant="outlined" type ="password" label="Password" name="password" value={props.user.password} onChange={props.handleInputs} />
                    <br/>
                    <Select required style={{marginBottom: "10px"}}  fullWidth size="small" variant="outlined"  name="roleId" value={props.user.roleId} onChange={props.handleInputs} label="Role">
                                {
                                    roles.map((role)=>(
                                        <MenuItem value={role._id}>{role.roletitle}</MenuItem>
                                    ))
                                }
                    </Select>
                    <Button style={{marginBottom: "10px"}} type="submit"  variant="contained" color="primary" onClick={props.PostData} >Sign Up</Button>
                </Box>
            </Paper>
        </Container>




        
    )
}
