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
const APIImagePath = global.config.variable.ImagePath;

class LogException extends React.Component {

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
                              <h1>Log Exception</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
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
                            data={this.state.log_table}
                          />
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
    await this.GetDataLogException();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      menu_name: 'Manage Log',
      txtTopicPopData: 'Add',
      ResData: null,
      log_table: [],
      ArrFile: [],
      columns: [
        {
          label: 'Log Date',
          field: 'log_Date',
          width: 150
        },
        {
          label: 'IP Address',
          field: 'iP_Address',
          width: 270
        },
        {
          label: 'Function Name',
          field: 'function_Name',
          width: 200
        },
        {
          label: 'Function Detail',
          field: 'function_Detail',
          sort: 'disabled',
          width: 100
        },
        {
          label: 'Error Detail',
          field: 'error_Detail',
          sort: 'disabled',
          width: 100
        }
      ],
      CreateByCookies: Cookies.get('IPAddress')
    };
  }

  async GetDataLogException() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Master/GetDataLogException`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              log_Date: item.log_Date,
              iP_Address: item.iP_Address,
              function_Name: item.function_Name,
              function_Detail: item.function_Detail,
              error_Detail: item.error_Detail,
            };

            TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ log_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }
}
export default LogException;
