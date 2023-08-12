import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap";

const TitleBar = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const toggle = () => setIsNavbarOpen(!isNavbarOpen);

    return (
        <Navbar
            className="mb-3"
            color="primary"
            dark
            expand="md"
        >
            <NavbarBrand href="/">
                Monopoly Banking
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isNavbarOpen} navbar>
                <Nav className="me-auto" navbar>
                    <NavItem>
                        <NavLink href="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/about">
                            About
                        </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default TitleBar;
