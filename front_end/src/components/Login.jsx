import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css'
import { Paper, Button, Container, Box, Typography, TextField } from '@material-ui/core'
export default function Login(props) {
    return (

            <Container maxWidth="sm">
                <Paper elevation={10} mx="auto" >
                    <Typography style={{ marginTop: "30px", marginLeft: "80px", paddingTop: "20px" }} variant="h5">
                    Sign in Form
                    </Typography>
                    <Box component="form" width="70%" mx="auto" mt={2}  >
                        <br />
                        <TextField required style={{ marginBottom: "10px" }} fullWidth size="small" variant="outlined" type="email" label="Email" 
                        name="email" value={props.user.email} onChange={props.handleInputs} />
                        <br />
                        <TextField required style={{ marginBottom: "10px" }} fullWidth size="small" variant="outlined" type="password" label="Password" 
                        name="password" value={props.user.password} onChange={props.handleInputs} />
                        <br />
                        <Button style={{ marginBottom: "10px" }} type="submit" variant="contained" color="primary" onClick={props.PostData} >Sign In</Button>
                    </Box>
                </Paper>
            </Container>



    )
}
