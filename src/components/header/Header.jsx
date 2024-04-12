import React from "react";
import './Header.scss'
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <div className="headerspace">
                <Link to={"./"}><h1>CoinMarkt</h1></Link>
                <Link to={"/top-10"}><h2>Top-10</h2></Link>
            </div>
        </header>
    );
}

export default Header