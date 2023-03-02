import { Link, useRouteError } from "react-router-dom";
import './error-page.styles.scss';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='error-page-container'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p><Link to='/'>Return home</Link></p>
    </div>
  );
}