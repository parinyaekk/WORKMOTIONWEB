import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import "react-table/react-table.css";
import "../MainConfig";
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
import GoogleMapReact from 'google-map-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Cookies from "js-cookie";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;
const APIGoogle_Key = global.config.variable.Google_Key;

class ContactDetail extends React.Component {
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
                              <h1>{this.state.txtTopicPopData}&nbsp;Contact Detail</h1>
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
                                <label className="small mb-1">Address</label>
                                <div
                                  style={{
                                    display: "block",
                                    border: "1px solid black",
                                    padding: "2px",
                                  }}
                                >
                                  <Editor
                                    editorState={this.state.input_ContactUs_Address}
                                    onEditorStateChange={this.onEditorStateChangeinput_ContactUs_Address}
                                  />
                                </div>
                              </div>
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">Email</label>
                                <div
                                  style={{
                                    display: "block",
                                    border: "1px solid black",
                                    padding: "2px",
                                  }}
                                >
                                  <Editor
                                    editorState={this.state.input_ContactUs_Email}
                                    onEditorStateChange={this.onEditorStateChangeinput_ContactUs_Email}
                                  />
                                </div>
                              </div>
                              <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">Phone</label>
                                <div
                                  style={{
                                    display: "block",
                                    border: "1px solid black",
                                    padding: "2px",
                                  }}
                                >
                                  <Editor
                                    editorState={this.state.input_ContactUs_Phone}
                                    onEditorStateChange={this.onEditorStateChangeinput_ContactUs_Phone}
                                  />
                                </div>
                              </div>
                              {/* <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">Google Maps</label>
                                <div style={{ height: '50vh', width: '100%' }}>
                                  <LoadScript
                                    googleMapsApiKey={`${APIGoogle_Key}`}
                                  >
                                    <GoogleMap
                                      mapContainerStyle={containerStyle}
                                      center={this.state.googlemap_position}
                                      zoom={15}
                                      onClick={(val) => this.onClickMap(val)}
                                    >
                                      <Marker
                                        // onLoad={onLoad}
                                        // onClick={(val) => this.onClickMark(val)}
                                        position={this.state.googlemap_position}
                                      />
                                    </GoogleMap>
                                  </LoadScript>
                                </div>
                              </div> */}
                            </div>
                            <div className="row">
                              <div className="form-group col-md-12">
                                <div className="float-right">
                                  <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{ marginTop: "24px" }} onClick={() => this.UpdateDataContactUs()} />
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
    await this.GetContactUsTable();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      txtTopicPopData: 'Edit',
      ResData: null,
      input_ContactUs_ID: null,
      input_ContactUs_Address: '',
      input_ContactUs_Email: '',
      input_ContactUs_Phone: '',
      input_ContactUs_Latitude: null,
      input_ContactUs_Longitude: null,
      googlemap_position: null,
      optionsIndustries: [],
      contactUs_table: [],
      ArrFile: [],
      CreateByCookies: Cookies.get('IPAddress')
    };
  }

  async GetContactUsTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}ContactUs/GetContactUsTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data });
          var TempData = [];
          var FindData = response.data.data;

          var txteditorContactUs_Address = null;
          var txteditorContactUs_Email = null;
          var txteditorContactUs_Phone = null;
          if (FindData != null) {
            const contentBlock = htmlToDraft(this.ChangeFormatStringBR(FindData[0].contactUs_Address));
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              txteditorContactUs_Address = EditorState.createWithContent(contentState);
            }
            const contentBlock2 = htmlToDraft(this.ChangeFormatStringBR(FindData[0].contactUs_Email));
            if (contentBlock2) {
              const contentState = ContentState.createFromBlockArray(contentBlock2.contentBlocks);
              txteditorContactUs_Email = EditorState.createWithContent(contentState);
            }
            const contentBlock3 = htmlToDraft(this.ChangeFormatStringBR(FindData[0].contactUs_Phone));
            if (contentBlock3) {
              const contentState = ContentState.createFromBlockArray(contentBlock3.contentBlocks);
              txteditorContactUs_Phone = EditorState.createWithContent(contentState);
            }
          }

          _this.setState({
            input_ContactUs_ID: parseInt(FindData[0].contactUs_ID),
            input_ContactUs_Address: txteditorContactUs_Address,
            input_ContactUs_Email: txteditorContactUs_Email,
            input_ContactUs_Phone: txteditorContactUs_Phone,
            input_ContactUs_Latitude: FindData[0].contactUs_Latitude,
            input_ContactUs_Longitude: FindData[0].contactUs_Longitude,
            googlemap_position: {
              // lat: 13.7525,
              // lng: 100.494167
              lat: FindData[0].contactUs_Latitude,
              lng: FindData[0].contactUs_Longitude
            },
          });
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
      });
  }

  async UpdateDataContactUs() {
    var _this = this;

    _this.setState({ loading: true });

    var lat = 0,lng = 0;
    if(!!_this.state.googlemap_position){
      lat = _this.state.googlemap_position.lat
      lng = _this.state.googlemap_position.lng
    }

    const Tempdata = {
      ContactUs_ID: !_this.state.input_ContactUs_ID ? null : _this.state.input_ContactUs_ID,
      ContactUs_Address: !_this.state.input_ContactUs_Address ? null : draftToHtml(convertToRaw(_this.state.input_ContactUs_Address.getCurrentContent())),
      ContactUs_Email: !_this.state.input_ContactUs_Email ? null : draftToHtml(convertToRaw(_this.state.input_ContactUs_Email.getCurrentContent())),
      ContactUs_Phone: !_this.state.input_ContactUs_Phone ? null : draftToHtml(convertToRaw(_this.state.input_ContactUs_Phone.getCurrentContent())),
      ContactUs_Latitude: lat,
      ContactUs_Longitude: lng,
      CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies
    };
    await axios.put(`${APIUrl}ContactUs/UpdateDataContactUs`, Tempdata)
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
  
  onEditorStateChangeinput_ContactUs_Address = input_ContactUs_Address => {
    this.setState({
      input_ContactUs_Address,
    });
  };
  
  onEditorStateChangeinput_ContactUs_Email = input_ContactUs_Email => {
    this.setState({
      input_ContactUs_Email,
    });
  };
  
  onEditorStateChangeinput_ContactUs_Phone = input_ContactUs_Phone => {
    this.setState({
      input_ContactUs_Phone,
    });
  };
  
  onClickMap(val) {
    if(!!val)
    {
      this.setState({
        googlemap_position: {
          lat: val.latLng.lat(),
          lng: val.latLng.lng()
        }
      });
      // alert('marker: x[' + val.latLng.lat() +'], y['+ val.latLng.lng() +']')
    }
  }
  
  // onClickMark(val) {
  //   if(!!val)
  //   {
  //     alert('marker: x[' + val.latLng.lat() +'], y['+ val.latLng.lng() +']')
  //   }
  // }
}
export default ContactDetail;
