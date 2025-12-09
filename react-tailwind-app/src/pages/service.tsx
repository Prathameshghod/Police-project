import { Link, useLocation } from "react-router-dom";

function Login() {
  const location = useLocation();
  const { username, password } = location.state || {};

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white gap-10">
      <h1 className="text-6xl font-bold">Welcome {username}</h1>
      <p className="text-3xl opacity-75">You are authenticated!</p>

     
    </div>
  );
}

export default Login;
