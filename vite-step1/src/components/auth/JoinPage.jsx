import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Header from '../include/Header'
import Footer from '../include/Footer'
const JoinPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER') // 기본값 USER
  const handleUsername = (value) => {
    setUsername(value)
  }
  const handleEmail = (value) => {
    setEmail(value)
  }
  const handlePassword = (value) => {
    setPassword(value)
  }
  const handleJoin = async() => {
    const member = {//@RequestBody - 401 - Member.java
      username: username,
      email: email,
      password: password,
      role: role,
    }
    try {
      console.log('handleJoin',member);
      navigate("/")
    } catch (error) {
      console.error("회원가입 실패", error)
    }
  }    
  return (
    <>
        <div className="row my-5 justify-content-center">
        <div className="col-8 col-md-6 col-lg-4">
          <h3 className="text-center mb-5">회원가입</h3>
          <form id="join" method="post">
            <div className="input-group my-2">
              <div className="input-group-text">이&nbsp;&nbsp;&nbsp;&nbsp;름</div>
              <input onChange={(e)=>{handleUsername(e.target.value)}} className="form-control" id="name"/>
            </div>
            <div className="input-group my-2">
              <div className="input-group-text">이 메 일</div>
              <input onChange={(e)=>{handleEmail(e.target.value)}} className="form-control" 
              id="email" autoComplete='new-email'/>
            </div>
            <div className="input-group">
              <div className="input-group-text">비밀번호</div>
              <input className="form-control"  onChange={(e)=>{handlePassword(e.target.value)}} 
                id="password" type="password" autoComplete='new-password'
              />
            </div>
            {/* 역할 선택 */}
            <div className="input-group my-2">
              <div className="input-group-text">역&nbsp;&nbsp;&nbsp;&nbsp;할</div>
              <select
                className="form-select"
                value={role}
                onChange={(e)=>setRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>              
            <div className="mt-5">
              <button onClick={handleJoin} type="button" className="btn btn-success w-100">회원가입</button>
            </div>
            <div className="text-end mt-3 my-5">
              <Link to="/login">로그인</Link>
            </div>
          </form>
        </div>
        </div>         
      <Footer />
    </>
  )
}

export default JoinPage