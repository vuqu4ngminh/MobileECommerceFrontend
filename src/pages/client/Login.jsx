import React, { useState } from 'react'
import CryptoJS from 'crypto-js'
import { Link, useNavigate } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import NavScroll from '../../components/Navbar';
import axios from 'axios';
import { FormatString, checkEmail } from '../../Utils';

const Login = () => {
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('')
        setEmail(FormatString(email))
        if(!email || !password){
            setMessage("Không được để trống")
            return
        }
        if(!checkEmail(email)){
            setMessage("Email không đúng định dạng")
            return
        }
        const { data: user } = await axios.post(process.env.REACT_APP_USER_API + `login`, {
            email: email,
            password: CryptoJS.MD5(password).toString()
        })
        if (user.length === 0) {
            setMessage('Email hoặc Mật khẩu không chính xác')
        } else {
            localStorage.setItem("id", user[0]._id);
            if(user[0].role === "admin"){
                localStorage.setItem('role', "admin")
                navigate('/admin/mobile')
            } else {
                navigate('/profile')
            }
        }
    }
    return (
        <>
            <NavScroll />
            <div className='login'>
                <form className='form-signin w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Đăng Nhập</h1>
                    <div className='text-danger'>{message}</div>
                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required
                        />
                        <label for="Email">Email:</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                        />
                        <label for="Password">Mật Khẩu</label>
                    </div>
                    <button className="btn btn-dark w-100 py-2" type="submit">Đăng Nhập</button>
                    <span>Chưa có tài khoản? <Link to="/register">Đăng Ký</Link>
                    </span>
                </form>
            </div>
        </>
    )
}

export default Login