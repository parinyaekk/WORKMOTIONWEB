import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import { Download,Plus } from 'react-feather';
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

class Information extends React.Component {

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
                              <h1>Information</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }} onClick={() => this.ExportExcel()}><Download />&nbsp; Export Excel</button>
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
                            data={this.state.information_table}
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
        .modal-diainformation{\
          width: 500px;\
        }\
        .modal{\
          z-index: 9999\
        }\
        .editmodal-diainformation{\
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
    await this.GetDataInformation();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      menu_name: 'Manage Information',
      txtTopicPopData: 'Add',
      ResData: null,
      information_table: [],
      ArrFile: [],
      columns: [
        {
          label: 'Startup Option',
          field: 'information_Startup_Option_Text',
          width: 150
        },
        {
          label: 'Industries',
          field: 'information_Industries_Text',
          width: 150
        },
        {
          label: 'Categories',
          field: 'information_Categories_Text',
          width: 150
        },
        {
          label: 'HDYH',
          field: 'information_HDYH_Text',
          width: 150
        },
        {
          label: 'HDYH Other',
          field: 'information_HDYH_Other',
          width: 150
        },
        {
          label: 'Company Name',
          field: 'information_Company_Name',
          width: 150
        },
        {
          label: 'Email',
          field: 'information_Email',
          width: 150
        },
        {
          label: 'Country Name',
          field: 'information_Country_Name',
          width: 150
        },
        {
          label: 'Profile',
          field: 'information_Profile',
          width: 150
        },
        {
          label: 'Detail',
          field: 'information_Detail',
          width: 150
        },
        {
          label: 'Looking For',
          field: 'information_Looking_For',
          width: 150
        },
        {
          label: 'Looking For Other',
          field: 'information_Looking_For_Other',
          width: 150
        },
      ],
      CreateByCookies: Cookies.get('IPAddress')
    };
  }

  async GetDataInformation() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Master/GetDataInformation`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              information_Startup_Option_Text: item.information_Startup_Option_Text,
              information_Industries_Text: item.information_Industries_Text,
              information_Categories_Text: item.information_Categories_Text,
              information_HDYH_Text: item.information_HDYH_Text,
              information_HDYH_Other: item.information_HDYH_Other,
              information_Company_Name: item.information_Company_Name,
              information_Email: item.information_Email,
              information_Country_Name: item.information_Country_Name,
              information_Profile: item.information_Profile,
              information_Detail: item.information_Detail,
              information_Looking_For: item.information_Looking_For,
              information_Looking_For_Other: item.information_Looking_For_Other,
            };

            TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ information_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  async ExportExcel() {
    var _this = this;
    _this.setState({ loading: true });
    let temp = {
      test: null
    };
    await axios.post(`${APIUrl}Master/ExportExcelDataInformation`,temp,
      {
        responseType: 'blob',
      }).then(response => {
        if (response.data != null) {
          const url = URL.createObjectURL(new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          }))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataTellUsMore.xlsx")
          document.body.appendChild(link)
          link.click()
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(function () {
        _this.setState({ loading: false })
      });
  }
}
export default Information;
