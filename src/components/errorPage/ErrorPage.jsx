import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="content-wrapper">
            <div className="error-page">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to="/" className="link-button">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}

export default ErrorPage;