import { Link } from "react-router-dom";


function Login() {

  const credentials = {
    username: "shreynik",
    password: "12345",
  };

    return (
      <div className="text-white text-6xl flex justify-center items-center h-screen bg-black">
      Login Page

    
      
      <Link to="/service" state={credentials}>
      <button>Go to service </button>
    </Link>
     
      </div>
    );
  }
  
  export default Login;
  
