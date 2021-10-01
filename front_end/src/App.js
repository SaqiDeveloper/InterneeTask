import React from 'react';
import Home from './components/Home';
import './components/Navbar';
import Navbar from './components/Navbar';
import { Route, Switch } from 'react-router';
import Error from './components/Error';
import LoginRegister from './components/LoginRegister';
import ManageRoles from './components/privileges/ManageRoles';
import ManageSections from './components/privileges/ManageSections';
import PrivilegesSection from './components/privileges/PrivilegesSection';
import SetPrivileges from './components/privileges/SetPrivileges';
import SetRolePrivileges from './components/privileges/SetRolePrivileges';
function App() {
  return (
    
    <>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/Login' component={LoginRegister} />
        <Route exact path='/Manageroles' component={ManageRoles} />
        <Route exact path="/sections" component={ManageSections} />
        <Route exact path="/Privileges" component={PrivilegesSection} />
        <Route exact path="/SetPrivileges/:userId" component={SetPrivileges} />
        <Route exact path="/SetRolePrivileges/:userId" component={SetRolePrivileges} />
        <Route component={Error} />
      </Switch>
    </>
  );
}
export default App;
