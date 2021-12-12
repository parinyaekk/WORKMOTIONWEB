import React, { useContext } from "react";

import Cookies from "js-cookie";

class Login extends React.Component{

  state = {
    Username: 'admin',
    Password: '@dminT0pventure',
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

  LoginSubmit = event => {
    event.preventDefault();
    if(this.state.Username == "sa" && this.state.Password == "sa")
    {
        window.location.href = "/Banner";
    }
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
                                          <form>
                                              <div class="form-group">
                                                  <label className="small mb-1" for="inputUsername">Username</label>
                                                  <input className="form-control py-4" id="inputUsername" type="text" placeholder="Enter username" onChange={this.InputUsername}/>
                                              </div>
                                              <div class="form-group">
                                                  <label className="small mb-1" for="inputPassword">Password</label>
                                                  <input className="form-control py-4" id="inputPassword" type="password" placeholder="Enter password" onChange={this.InputPassword}/>
                                              </div>
                                              <div class="form-group d-flex align-items-center justify-content-between mt-4 mb-0 float-right">
                                                  <button className="btn btn-primary"  onClick={this.LoginSubmit}>Login</button>
                                              </div>
                                          </form>
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
                                    <div class="col-md-6 small">Copyright &copy; Top Venture 2021</div>
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