import CustomLink from "../components/CustomLink";

/**
 * <ErrorPage /> is displayed when a user hits a URL that does not match to a route.
 * @param {*} props 
 * @returns {JSX.Element} <ErrorPage />
 */
export default function ErrorPage(props) {
    return (
        <>
            <main className="centerText">
                <h1>404: Page Not Found</h1>
                <p>
                    Sorry, the page you were looking for does not exist.
                    <br />
                    Check the URL for errors or head back to the <CustomLink type="green" to="/">homepage</CustomLink>.
                </p>
            </main>
        </>
    );
}
