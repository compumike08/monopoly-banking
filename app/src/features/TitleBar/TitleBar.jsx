import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";

const TitleBar = () => {
    return (
        <Navbar
            className="mb-3"
            color="primary"
            dark
        >
            <NavbarBrand href="/">
                Monopoly Banking
            </NavbarBrand>
        </Navbar>
    );
}

export default TitleBar;
