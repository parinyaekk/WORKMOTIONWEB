import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import { Plus } from 'react-feather';
import moment from 'moment';
import Select from 'react-select';
import Cookies from "js-cookie";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBDataTableV5
} from 'mdbreact';
import LoadingOverlay from "react-loading-overlay";
import Switch from "react-switch";

const APIUrl = global.config.variable.Url;

class HDYH extends React.Component {

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
                              <h1>HDYH Option</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add HDYH Option</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <MDBCardBody>
                          <MDBDataTableV5
                            hover
                            responsive
                            entriesOptions={[5, 20, 25]}
                            entries={5}
                            searchTop
                            searchBottom={false}
                            barReverse
                            data={this.state.HDYH_Option_table}
                          />
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
                <div className="modal" id="PopData" role="dialog" aria-hidden="true">
                  <div className="editmodal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1>{this.state.txtTopicPopData}&nbsp;HDYH Option</h1>
                        <button type="button" className="close" onClick={() => this.ClosePopData()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          <div className="row">
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">HDYH Option Name</label>
                              <input className="form-control py-1" type="text" value={this.state.input_HDYH_Option_Name} onChange={this.setStateinput_HDYH_Option_Name} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateDataHDYH()}/>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
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
        .rdw-editor-main {\
          height: 300px;\
          overflow: auto;\
          box-sizing: border-box;\
        }\
        .rdw-option-wrapper{ \
          border:0px solid #f1f1f1;\
          padding:5px;min-width:25px;height:20px;border-radius:2px;margin:0 4px;display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;cursor:pointer;background:#fff;text-transform:capitalize\
        }\
      "}</style>
        </Container>
       </LoadingOverlay>
    );
  }

  async componentWillMount() {
    await this.GetOptionsHDYH();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      menu_name: 'Manage HDYH_Option',
      txtTopicPopData: 'Add',
      ResData: null,
      input_HDYH_Option_ID: null,
      input_HDYH_Option_Name: '',
      HDYH_Option_table: [],
      ArrFile: [],
      columns: [
        {
          label: 'HDYH Option Name',
          field: 'hdyH_Option_Name',
          width: 150
        },
        {
          label: 'Action',
          field: 'Action',
          sort: 'disabled',
          width: 100
        }
      ],
      CreateByCookies: Cookies.get('IPAddress')
    };
  }

  async UpdateDataHDYH() {
    var _this = this;

    if(!_this.state.input_HDYH_Option_Name)
    {
      alert('Please fill [StartUp Option Name] !');
    }
    else
    {
      _this.setState({ loading: true });
      const Tempdata = {
        HDYH_Option_ID: _this.state.input_HDYH_Option_ID == undefined ? null : _this.state.input_HDYH_Option_ID,
        HDYH_Option_Name: _this.state.input_HDYH_Option_Name == undefined ? null : _this.state.input_HDYH_Option_Name,
        CreateBy: !_this.state.CreateByCookies ? null : _this.state.CreateByCookies
      };
      await axios.post(`${APIUrl}Master/UpdateDataHDYH`, Tempdata)
        .then((response) => {
          if (response.data.status == 0) {
            alert(response.data.message);
            window.location.reload();
            // this.GetOptionsHDYH();
          }
        })
        .catch((err) => {
            alert(err);
        })
        .finally(function () {
            _this.setState({ loading: false });
        });
    }
  }

  OpenEditPopup(value) {
    var _this = this;
    var HDYH_Option_ID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.hdyH_Option_ID == parseInt(HDYH_Option_ID));

    _this.setState({
      input_HDYH_Option_ID: parseInt(HDYH_Option_ID),
      input_HDYH_Option_Name: FindData[0].hdyH_Option_Name,
    });
  }

  ClosePopData() {
    $("#PopData").removeAttr("style").hide();
    var _this = this;
    _this.setState({ txtTopicPopData: 'Add', input_HDYH_Option_ID: null, input_HDYH_Option_Name: '' });
    _this.forceUpdate();
  }
  
  async GetOptionsHDYH() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Master/GetOptionsHDYH`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              hdyH_Option_Name: item.hdyH_Option_Name,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.hdyH_Option_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataHDYH(item.hdyH_Option_ID)}>
                  <img
                    class="img-manage"
                    src={require("../images/DeleteIcon.png")}
                    alt="Delete"
                  />
                </button>
              </div>
            };
            TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ HDYH_Option_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  setStateinput_HDYH_Option_Name = event => {
    this.setState({ input_HDYH_Option_Name: event.target.value });
  }

  DeleteDataHDYH(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
        var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
        axios.delete(`${APIUrl}Master/DeleteDataHDYH?HDYH_Option_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetOptionsHDYH();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }
  }
}
export default HDYH;
