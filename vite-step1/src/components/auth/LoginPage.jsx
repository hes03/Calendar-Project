import React, { useState } from 'react'
import Header from '../include/Header'
import Footer from '../include/Footer'
import { Link, useNavigate } from 'react-router'

const LoginPage = () => {
  const navigate = useNavigate();
  const [tempUser, setTempUser] = useState({
    email: 'kiwi@hot.com',
    password:'123'
  })
  const onLogin = async() => {
    console.log('onLogin');
    try {
      navigate("/")
    } catch (error) {
      console.error("로그인 에러",error)
    }
  }
  const googleLogin = async() => {
    try {
      
      navigate("/")
    } catch (error) {
      console.error("로그인 실패", error)
    }
  }
  const changeUser = (e) => {
    console.log('changeUser',e.target.value);
    const id = e.currentTarget.id 
    const value = e.target.value 
    console.log(id,value);
    setTempUser({...tempUser, [id]: value})    
  }
  return (
    <>
        <div className="row my-5 justify-content-center">
          <div className="col-8 col-md-6 col-lg-4">
            <h3 className="text-center mb-5">로그인</h3>
            <form id="frm" method="post">
            <div className="input-group my-2">
              <div className="input-group-text">이 메 일</div>
              <input className="form-control" id="email" value="kiwi@hot.com" onChange={(e)=>changeUser(e)}/>
            </div>
            <div className="input-group">
              <div className="input-group-text">비밀번호</div>
              <input onChange={(e)=>changeUser(e)}
              className="form-control"
              id="password"
              type="password"
              value="123"
              />
            </div>
            </form>
            <div className="my-3">
            <button onClick={onLogin} type="button" className="btn btn-success w-100">
              로그인
            </button>
            </div>
            <div className="my-3">
            <button onClick={googleLogin} type="button" className="btn btn-primary w-100">Google</button>
            </div>
            <div className="text-end mt-3">
              <Link to="/join">회원가입</Link>
            </div>
          </div>
        </div>      
      <Footer />
    </>
  )
}

export default LoginPage
