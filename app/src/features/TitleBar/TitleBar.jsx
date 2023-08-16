import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem } from "reactstrap";

const TitleBar = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const toggle = () => setIsNavbarOpen(!isNavbarOpen);

    const isUserLoggedIn = useSelector((state) => state.authData.isUserLoggedIn);

    return (
        <Navbar
            className="mb-3"
            color="primary"
            dark
            expand="md"
        >
            <NavbarBrand>
                Monopoly Banking
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isNavbarOpen} navbar>
                <Nav className="me-auto" navbar>
                    <NavItem>
                        <NavLink activeClassName="active-link" className="nav-link" to="/">Register/Login Page</NavLink>
                    </NavItem>
                    {isUserLoggedIn && (
                        <NavItem>
                            <NavLink activeClassName="active-link" className="nav-link" to="/home">Home</NavLink>
                        </NavItem>
                    )}
                    {isUserLoggedIn && (
                        <NavItem>
                            <NavLink activeClassName="active-link" className="nav-link" to="/userProfile">User Profile</NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink activeClassName="active-link" className="nav-link" to="/about">
                            About
                        </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default TitleBar;
