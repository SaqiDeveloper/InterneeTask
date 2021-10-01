import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { Link } from 'react-router-dom';
export default function Navbar() {
    const token = localStorage.getItem("token");
    const Logout = () => {
        localStorage.removeItem("token");
        window.location.href = "http://localhost:3000/Login";
        //usehistory.push("/Login");

    }
    return (
        <>
            <div id="header1">
                <div >
                    <div className="row">
                        <div className="col">
                            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                                <Link id="CN" to="/" className="navbar-brand">DONESOL</Link>
                                <ul className="navbar-nav ml-5">
                                    <li className="nav-item"><Link to="/" className="nav-link">ManageUsers</Link></li>
                                    <li className="nav-item"><Link to="/Manageroles" className="nav-link">ManageRoles</Link></li>
                                    <li className="nav-item"><Link to="/sections" className="nav-link">ManageSections</Link></li>
                                    <li className="nav-item"><Link to="/Privileges" className="nav-link">ManagePrivilegesTypes</Link></li>
                                    {
                                        token ? <li id="log" className="nav-link nav-item" onClick={Logout}>LOGOUT</li>
                                            : token === null ? <li className="nav-item"><Link to="/Login" className="nav-link">Login</Link></li> : ""
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
