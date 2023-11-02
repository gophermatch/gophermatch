import { useRouteError } from "react-router-dom";

// TODO: ability to go back without reloading the page
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    // From the react router tutorial. we probably want to beautify this
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}