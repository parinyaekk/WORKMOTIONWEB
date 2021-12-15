import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import "react-table/react-table.css";
import "../MainConfig";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdbreact';
import LoadingOverlay from "react-loading-overlay";
import ChipInput from 'material-ui-chip-input'
import Cookies from "js-cookie";

const APIUrl = global.config.variable.Url;

class SEO_News extends React.Component {
   render() {
    return (
      <LoadingOverlay
        styles={{
          overlay: base => ({
            ...base,
            position: "fixed",
            zIndex: "9999"
          })
        }}
        active={this.state.loading}
        spinner
        text=""
      >
        <Container fluid className="main-content-container container-boom px-0">
          <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
            <div class="container">
            </div>
          </header>
          <Row>
            <Col>
              <div>
                <MDBContainer className='mt-3' fluid responsive>
                  <MDBRow className='py-3'>
                    <MDBCol md='12'>
                      <MDBCard>
                        <div className="card-header">
                          <div className="row">
                            <div className="col-md-6">
                              <h1>{this.state.txtTopicPopData}&nbsp;SEO News</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                {/* <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add Contact Detail</button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <MDBCardBody>
                          <div className="modal-body">
                            <div className="row">
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">News Meta Name</label>
                                <input className="form-control py-1" type="text" value={this.state.input_Menu_Name} readOnly />
                              </div>
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">News Meta Title</label>
                                <input className="form-control py-1" type="text" value={this.state.input_Meta_Title} onChange={this.setStateinput_Meta_Title} />
                              </div>
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <ChipInput
                                  fullWidth
                                  label='News Meta Keyword'
                                  placeholder='Type and press enter to add News Meta Keyword'
                                  defaultValue={this.state.input_Meta_Keyword}
                                  onChange={this.setStateinput_Meta_Keyword}
                                  onDelete={this.deleteStateinput_Meta_Keyword}
                                />                              </div>
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">News Meta Description</label>
                                <textarea rows="3" className="form-control py-1" type="text" value={this.state.input_Meta_Description} onChange={this.setStateinput_Meta_Description} />
                              </div>
                            </div>
                            <div className="row">
                              <div className="form-group col-md-12">
                                <div className="float-right">
                                  <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{ marginTop: "24px" }} onClick={() => this.UpdateDataSEOMenu()} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </div>
            </Col>
          </Row>
          <style>{"\
        .svg-inline--fa.fa-w-14 {\
          display: none;\
        }\
        .table-img {\
          max-width: 100px;\
          max-height: 100px;\
        }\
        .popimg{\
          max-width:100%;\
        }\
        .modal-dialog{\
          width: 500px;\
        }\
        .modal{\
          z-index: 9999\
        }\
        .editmodal-dialog{\
          padding-top: 50px;\
          width: 900px;\
          margin: auto;\
        }\
        .responsefrm {\
          max-width: 1250px;\
          min-width: 720px;\
        }\
        img {\
          border: 1px solid #ddd;\
          border-radius: 4px;\
          padding: 5px;\
        }\
        img:hover {\
            box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);\
        }\
        .img-manage {\
            Width: 30px !important;\
            margin-top: -7px !important;\
            margin-left: -15px !important;\
        }\
      "}</style>
        </Container>
      </LoadingOverlay>
    );
  }

  async componentWillMount() {
    await this.GetDataSEONews();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      txtTopicPopData: 'Edit',
      input_Menu_ID: null,
      input_Menu_Name: '',
      input_Meta_Title: '',
      input_Meta_Keyword: null,
      input_Meta_Description: '',
      CreateByCookies: Cookies.get('IPAddress')
    };
  }

  async GetDataSEONews() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}News/GetDataSEONews`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false });

          var FindData = response.data.data;

          var Arr_Meta_Keyword = [];
          if(!!FindData[0].meta_Keyword)
          {
            FindData[0].meta_Keyword.split(',').forEach(element => {
              Arr_Meta_Keyword.push(element)
            });
          }

          _this.setState({
            input_Menu_ID: parseInt(FindData[0].menu_ID),
            input_Menu_Name: FindData[0].menu_Name,
            input_Meta_Title: FindData[0].meta_Title,
            input_Meta_Keyword: Arr_Meta_Keyword,
            input_Meta_Description: FindData[0].meta_Description,
          });
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
      });
  }

  async UpdateDataSEOMenu() {
    var _this = this;
    _this.setState({ loading: true });
    
    var txtinput_Meta_Keyword = '';
    if(!!_this.state.input_Meta_Keyword)
    {
      _this.state.input_Meta_Keyword.forEach(element => {
        txtinput_Meta_Keyword += element + ','
      });

      txtinput_Meta_Keyword = txtinput_Meta_Keyword.substring(0,txtinput_Meta_Keyword.length - 1)
    }
    
    const Tempdata = {
      Menu_ID: !_this.state.input_Menu_ID ? null : parseInt(_this.state.input_Menu_ID),
      // Menu_Name: !_this.state.input_Menu_Name ? null : _this.state.input_Menu_Name,
      Meta_Title: !_this.state.input_Meta_Title ? null : _this.state.input_Meta_Title,
      Meta_Keyword: txtinput_Meta_Keyword,
      Meta_Description: !_this.state.input_Meta_Description ? null : _this.state.input_Meta_Description,
      CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies
    };
    await axios.put(`${APIUrl}Master/UpdateDataSEOMenu`, Tempdata)
      .then((response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          window.location.reload();
        }
      })
      .catch((err) => {
        alert(err);
      })
      .finally(function () {
        _this.setState({ loading: false });
      });
  }

  ChangeFormatStringBR(value) {
    if (value != "" && value != null) {
      return value.split("<br>").join("\n");
    }
    return "";
  }
  
  setStateinput_Menu_Name = event => {
    this.setState({ input_Menu_Name: event.target.value });
  }
  
  setStateinput_Meta_Title = event => {
    this.setState({ input_Meta_Title: event.target.value });
  }
  
  setStateinput_Meta_Keyword = input_Meta_Keyword => {
    this.setState({ input_Meta_Keyword });
  }

  deleteStateinput_Meta_Keyword = event => {
    var _this = this;
    var t = _this.input_Meta_Keyword.filter(x => x != event)
    alert(t)
    // this.setState({ input_Portfolio_Technology: event });
  }

  setStateinput_Meta_Description = event => {
    this.setState({ input_Meta_Description: event.target.value });
  }
}
export default SEO_News;
