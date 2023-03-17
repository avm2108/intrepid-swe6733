import CustomLink from './CustomLink';

export default function Header(props) {
    return (
        <header className="App-header">
            <div>
                <img src="/img/Logo.png" alt="Intrepid Logo" width="50px" height="50px" />
                <h1 style={{ display: "inline-block" }} >Intrepid</h1>
            </div>
            <div style={{ display: "flex", flexGrow: 0.1, flexDirection: "row", justifyContent: "space-evenly" }}>
                <CustomLink to="/">Home</CustomLink> 
                <CustomLink to="/login">Login</CustomLink>
                <CustomLink to="/register">Register</CustomLink>
            </div>
        </header>
    );
}
