import React, { useContext } from "react";
import axios from 'axios';
//import "../assets/Login.css";

import "../MainConfig"; // APIUrl
import Cookies from "js-cookie";

const APIUrl = global.config.variable.Url; // APIUrl
class Login extends React.Component{

  state = {
    Username: '',
    Password: '',
    usernames: Cookies.get('username')
  }

  data = {
    id: null,
    name: ""
  }

  InputUsername = event => {
    this.setState({ Username: event.target.value });
  }
  InputPassword = event => {
    this.setState({ Password: event.target.value });
  }

  TestDeleteCookie() {
    Cookies.remove('username')
    alert(Cookies.get('username'));
  };

  SaveDataCounter() {
    var Data = 1;
    axios.post(`${APIUrl}Counter/SaveDataCounter?Counter=` + Data)
        .then(response => {
            if (response.data.status == 0) {
              localStorage.setItem('CountNumber', response.data.data);
              Cookies.set('username', this.state.Username, { expires: 0.5 })
              // alert(Cookies.get('username'));
              window.location.href="warranty";
            }
        })
        .catch(err => {
            console.log(err);
        });
  }

  LoginSubmit = event => {
    event.preventDefault();

    if(this.state.Username == "" || this.state.Password == "")
    {
      alert('please check your username and password and try again')
      return;
    }
    const Tempdata = {     
      Username: this.state.Username,
      Password: this.state.Password     
    };


    //axios.post(`http://www.mostactive.info/API/api/Login/AdminLogin`, Tempdata)
    axios.post(`${APIUrl}Login/AdminLogin`, Tempdata)
      .then((response) => {
        //console.log(res.data.data);
        if(response.data.status === 0){
          // console.log(response.data.data);
          localStorage.setItem('id', response.data.data.id);
          localStorage.setItem('full_name', response.data.data.name);
          localStorage.setItem('User_Group', response.data.data.userGroup);

          this.SaveDataCounter();
          // localStorage.setItem('Permission', response.data.data);
          //this.id = res.data.data.id;
          //this.name = res.data.data.name;
          //window.location.href="warranty";
        }
        else
        {
          alert('please check your username and password and try again')
          return;
        }
      })
      .catch((err) => console.log(err));
  }

    render(){
        return(
              <div id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                  <main>
                      <div class="container">
                          <div class="row justify-content-center">
                              <div class="col-lg-5">
                                  <div class="card shadow-lg border-0 rounded-lg mt-5">
                                      <div class="card-header justify-content-center"><h3 class="font-weight-light my-4">Login</h3></div>
                                      <div class="card-body">
                                          {/* <form onSubmit={this.LoginSubmit}> */}
                                          <form>
                                              <div class="form-group">
                                                  <label className="small mb-1" for="inputUsername">Username</label>
                                                  <input className="form-control py-4" id="inputUsername" type="text" placeholder="Enter username" onChange={this.InputUsername}/>
                                              </div>
                                              <div class="form-group">
                                                  <label className="small mb-1" for="inputPassword">Password</label>
                                                  <input className="form-control py-4" id="inputPassword" type="password" placeholder="Enter password" onChange={this.InputPassword}/>
                                              </div>
                                              <div class="form-group">
                                                  <div class="custom-control custom-checkbox">
                                                      <input class="custom-control-input" id="rememberPasswordCheck" type="checkbox" />
                                                      <label class="custom-control-label" for="rememberPasswordCheck">Remember password</label>
                                                  </div>
                                              </div>
                                              <div class="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                                                  <a class="small" href="auth-password-basic.html">Forgot Password?</a>
                                                  {/* <input type="submit" value="Login" className="btn btn-primary"/> */}
                                                  <button className="btn btn-primary"  onClick={this.LoginSubmit}>Login</button>
                                                  {/* <button className="btn btn-primary"  onClick={this.TestDeleteCookie}>del cookie</button> */}
                                              </div>
                                          </form>
                                      </div>
                                      <div class="card-footer text-center">
                                          <div class="small"><a href="auth-register-basic.html">Need an account? Sign up!</a></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </main>
              </div>
              <div id="layoutAuthentication_footer">
                        <footer class="footer mt-auto footer-dark">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-6 small">Copyright &copy; CCC_WebAdmin 2021</div>
                                    <div class="col-md-6 text-md-right small">
                                        <a href="#!">Privacy Policy</a>
                                        &middot;
                                        <a href="#!">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
            </div>
        );
    }
}

export default Login;