import React from "react";
import './Header.scss'
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <Link to={"./"}><h1>CoinMarkt</h1></Link>
            <Link to={"/top-10"}>Top-10</Link>
        </header>
    );
}

export default Header