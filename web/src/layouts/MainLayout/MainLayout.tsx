import { Link, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logOut } = useAuth()
  console.log(JSON.stringify(currentUser))
  return (
    <>
      <header>
        <div>
          <h1>
            <Link to={routes.home()}>Tap Tap</Link>
          </h1>
          <div>
            <span>Logged in as {currentUser.id}</span>{' '}
            <button type="button" onClick={logOut}>
              Logout
            </button>
          </div>
        </div>
        <hr />
        <nav>
          <ul>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.tasks()}>Tasks</Link>
            </li>
            <li>
              <Link to={routes.categories()}>Category</Link>
            </li>
            <li>
              <Link to={routes.records()}>Record</Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
      <footer></footer>
    </>
  )
}

export default MainLayout
