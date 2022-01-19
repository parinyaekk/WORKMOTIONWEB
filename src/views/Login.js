import React, { useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            IPAddress: '',
            Username: '',
            Password: '',
        };
    } 

    async componentWillMount() {
        // await this.GetOptionsIndustries();
        await this.getData();
    }

    async getData() {
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log(res.data);
        this.setState({ IPAddress: res.data.IPv4 });
        // alert(res.data.IPv4);
    }

    LoginSubmit() {
        if(this.state.Username == "admin" && this.state.Password == "admin")
        {
            Cookies.set('IPAddress', this.state.IPAddress, { expires: 0.5 })
            window.location.href = "/Banner";   
        }
        else
        {
            alert('Invalid Password !');
        }
    }

    setStateUsername = event => {
        this.setState({ Username: event.target.value });
    }
    
    setStatePassword = event => {
        this.setState({ Password: event.target.value });
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
                                            <div class="form-group">
                                                <label className="small mb-1" for="inputIPAddress">User Name </label>
                                                <input className="form-control py-1" type="text" value={this.state.Username} onChange={this.setStateUsername} />
                                                <label className="small mb-1" for="inputIPAddress">Password </label>
                                                <input className="form-control py-4" type="password" value={this.state.Password} onChange={this.setStatePassword}/>
                                            </div>
                                            <div class="form-group d-flex align-items-center justify-content-between mt-4 mb-0 float-right">
                                                <button className="btn btn-primary" type="button" onClick={() => this.LoginSubmit()}>Login</button>
                                            </div>
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