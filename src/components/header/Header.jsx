import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiStar, FiMoon, FiSun } from "react-icons/fi";
import './Header.scss';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { searchTerm, setSearchTerm } = useSearch();
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-left">
                    <Link to="/" className="logo">
                        CoinMarkt
                    </Link>
                    <nav className="nav-links">
                        <NavLink to="/" end>
                            Cryptocurrencies
                        </NavLink>
                        <NavLink to="/top-10">
                            Top 10
                        </NavLink>
                        <NavLink to="/favorites">
                            <FiStar /> Favorites
                        </NavLink>
                    </nav>
                </div>

                <div className="header-right">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search cryptocurrency"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;