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

class Banner extends React.Component {

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
                              <h1>Banner</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add Banner</button>
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
                            data={this.state.banner_table}
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
                        <h1>{this.state.txtTopicPopData}&nbsp;Banner</h1>
                        <button type="button" className="close" onClick={() => this.ClosePopData()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          <div className="row">
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Banner Name</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Banner_Name} onChange={this.setStateinput_Banner_Name} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Banner Topic</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Banner_Topic} onChange={this.setStateinput_Banner_Topic} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Banner Description</label>
                              <div
                                style={{
                                  display: "block",
                                  border: "1px solid black",
                                  padding: "2px",
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_Banner_Description}
                                  onEditorStateChange={this.onEditorStateChangeinput_Banner_Description}
                                />
                              </div>
                            </div>
                              <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <label className="small mb-1">Image</label>
                                <br></br>
                                <input id="BannerFile" type="file" class="form-control-file" onChange={this.onFileChange} />
                                {this.state.input_Banner_Image_Path != null ? 
                                  <img class="table-img" src={`${APIImagePath}` + this.state.input_Banner_Image_Path} /> : ""}
                              </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateBanner()}/>
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
    await this.GetBannerTable();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      menu_name: 'Manage Banner',
      txtTopicPopData: 'Add',
      ResData: null,
      input_Banner_ID: null,
      input_Banner_Name: '',
      input_Banner_Topic: '',
      input_Banner_Description: '',
      input_Banner_Image_Path: null,
      input_Banner_Is_Display: true,
      banner_table: [],
      ArrFile: [],
      columns: [
        {
          label: 'Banner_Name',
          field: 'banner_Name',
          width: 150
        },
        {
          label: 'Banner_Topic',
          field: 'banner_Topic',
          width: 270
        },
        {
          label: 'Banner_Description',
          field: 'banner_Description',
          width: 200
        },
        {
          label: 'Banner_Image_Path',
          field: 'banner_Image_Path',
          sort: 'disabled',
          width: 100
        },
        {
          label: 'Show',
          field: 'is_Display',
          sort: 'disabled',
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

  async UpdateBanner() {
    var _this = this;

    if(!_this.state.input_Banner_Name)
    {
      alert('Please fill [Banner Name] !');
    }
    else
    {
      _this.setState({ loading: true });
      const Tempdata = {
        Banner_ID: _this.state.input_Banner_ID == undefined ? null : _this.state.input_Banner_ID,
        Banner_Name: _this.state.input_Banner_Name == undefined ? null : _this.state.input_Banner_Name,
        Banner_Topic: _this.state.input_Banner_Topic == undefined ? null : _this.state.input_Banner_Topic,
        Banner_Image_Path: _this.state.input_Banner_Image_Path == undefined ? null : _this.state.input_Banner_Image_Path,
        Banner_Description: !_this.state.input_Banner_Description ? null : draftToHtml(convertToRaw(_this.state.input_Banner_Description.getCurrentContent())),
        CreateBy: !_this.state.CreateByCookies ? null : _this.state.CreateByCookies
      };
      await axios.post(`${APIUrl}Banner/UpdateDataBanner`, Tempdata)
        .then((response) => {
          if (response.data.status == 0) {
            alert(response.data.message);
            window.location.reload();
            // this.GetBannerTable();
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

  OpenImage(val) {
    var data = val;
    var FindData = this.state.ResData.filter(x => x.id == parseInt(data));
    // console.log(APIImagePath);
    var ArrTemp = [];
    Array.prototype.forEach.call(FindData[0].file, function (index) {
      var FileObj = {
        File: {
          id: index.id,
          name: index.name,
          path: index.path
        },
        Type: "Old"
      };
      ArrTemp.push(FileObj);
    });
    this.setState({ ArrFile: ArrTemp });
    this.renderShowFile();

    // this.setState({ image: `${APIImagePath}` + data});
    // console.log(this.state.image);
    // $("#ShowDataDetail").removeAttr("style").hide();
    $("#ShowPic").removeAttr("style").show();
  }

  OpenEditPopup(value) {
    var _this = this;
    var bannerID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.banner_ID == parseInt(bannerID));

    var txteditorState = null;
    if(FindData != null)
    {        
      const contentBlock = htmlToDraft(this.ChangeFormatStringBR(FindData[0].banner_Description));
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        txteditorState = EditorState.createWithContent(contentState);
      }
    }

    _this.setState({
      input_Banner_ID: parseInt(bannerID),
      input_Banner_Name: FindData[0].banner_Name,
      input_Banner_Topic: FindData[0].banner_Topic,
      input_Banner_Description: txteditorState,
      input_Banner_Image_Path: FindData[0].banner_Image_Path,
    });
  }

  CloseModal() {
    $("#ShowPic").removeAttr("style").hide();
    // $("#ShowDataDetail").removeAttr("style").hide();
  }

  ClosePopData() {
    $("#PopData").removeAttr("style").hide();
    var _this = this;
    _this.setState({ txtTopicPopData: 'Add', input_Banner_ID: null, input_Banner_Topic: '', input_Banner_Name: '', input_Banner_Description: '', input_Banner_Image_Path: null });
    _this.forceUpdate();
  }

  onFileChange = event => {
    this.SaveFile(event.target.files[0]);
  };

  async SaveFile(file) {
    const data = new FormData();
    data.append('input_Banner_Image_Path', file);
    await axios.post(`${APIUrl}Master/UploadImage`, data,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => {
        if (response.data.status === 0) {
            this.setState({ input_Banner_Image_Path: response.data.data });
            $('#BannerFile').val('');
            this.forceUpdate();
        }
    })
    .catch((err) => {
        alert(err);
    });
  };

  onFileDelete(value) {
    this.state.ArrFile.splice(value, 1);
    this.forceUpdate();
  };
  
  ChangeFormatStringBR(value) {
    if (value != "" && value != null) {
      return value.split("<br>").join("\n");
    }
    return "";
  }

  async GetBannerTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Banner/GetBannerTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item, index) => {
            let TempSubData = {
              // no: (Number + (index + 1)),
              banner_Name: item.banner_Name,
              banner_Topic: item.banner_Topic,
              banner_Description: !item.banner_Description ? null : item.banner_Description.length > 20 ? item.banner_Description.substring(0,20) + "..." : item.banner_Description,
              banner_Image_Path: item.banner_Image_Path,
              is_Display: <Switch onChange={() => this.SetDisplayBanner(item.banner_ID)} checked={item.is_Display} />,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.banner_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataBanner(item.banner_ID)}>
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
          this.setState({ banner_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  setStateinput_Banner_Name = event => {
    this.setState({ input_Banner_Name: event.target.value });
  }

  setStateinput_Banner_Topic = event => {
    this.setState({ input_Banner_Topic: event.target.value });
  }

  onEditorStateChangeinput_Banner_Description = input_Banner_Description => {
    this.setState({
      input_Banner_Description,
    });
  };

  DeleteDataBanner(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
        var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
        axios.delete(`${APIUrl}Banner/DeleteDataBanner?Banner_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetBannerTable();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }
  }

  async SetDisplayBanner(val) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      await axios.put(`${APIUrl}Banner/SetDisplayBanner?Banner_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          await this.GetBannerTable();
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  
  renderShowFile() {
    return this.state.ArrFile.map((item, index) => {
      if (index == 0) {
        return (
          <div class="carousel-item active">
            <img class="d-block w-100" src={`${APIImagePath}` + item.File.path} alt="First slide" />
          </div>
        );
      } else {
        return (
          <div class="carousel-item">
            <img class="d-block w-100" src={`${APIImagePath}` + item.File.path} alt="First slide" />
          </div>
        );
      }
    });
  }
  
  renderTableFile() {
    return this.state.ArrFile.map((item, index) => {
      if (item.Type == "New") {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#tblImg' + index).attr('src', e.target.result);
        };
        reader.readAsDataURL(item.File);
      }
      return (
        <tr key={index}>
          {item.Type == "New" && <td> <img id={"tblImg" + index} src={item.File.name} class="table-img"></img></td>}
          {item.Type == "Old" && <td> {item.File.path.match('.pdf') == null ? <img class="table-img"  style={{cursor: 'pointer'}}  src={`${APIImagePath}` + item.File.path} onClick={() => window.open(`${APIImagePath}` + item.File.path)}></img> : <img class="table-img"  style={{cursor: 'pointer'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.File.path)}></img>} </td>}
          <td>{item.File.name}</td>
          <td onClick={() => this.onFileDelete(index)}>
            <input type="button" value="Delete" className="btn btn-danger" />
          </td>
        </tr>
      );
    });
  }
}
export default Banner;
