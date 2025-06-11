import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from './redux/slices/authSlice';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Login" onChange={handleChange} />
      <input name="password" type="password" placeholder="Pass" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
