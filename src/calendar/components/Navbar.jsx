import { useAuthStore } from "../../hooks"

export const Navbar = () => {

  const { startLogout, user } = useAuthStore();

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <span className="navbar-brand">
            <i className="fa-regular fa-calendar me-2"></i>
            {user.name}
        </span>

        <button 
          className="btn btn-outline-danger"
          onClick={startLogout}
        >
            <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
            Exit
        </button>
    </div>
  )
}