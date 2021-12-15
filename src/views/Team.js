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

class Team extends React.Component {

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
                              <h1>Team</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add Team</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <MDBCardBody>
                          <MDBDataTableV5
                            hover
                            responsive
                            entriesOptions={[5, 20, 25]}
                            entries={25}
                            data={this.state.team_table}
                            pagingTop
                            searchTop
                            searchBottom={false}
                            barReverse
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
                        <h1>{this.state.txtTopicPopData}&nbsp;Team</h1>
                        <button type="button" className="close" onClick={() => this.ClosePopData()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          <div className="row">
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Sequence</label>
                              <input className="form-control py-1" type="number" value={this.state.input_Team_Sequence} onChange={this.setStateinput_Team_Sequence} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Name</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Team_Name} onChange={this.setStateinput_Team_Name} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Position</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Team_Position} onChange={this.setStateinput_Team_Position} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Personal Story</label>
                              <div
                                style={{
                                  display: "block",
                                  border: "1px solid black",
                                  padding: "2px",
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_Team_Personal_Story}
                                  onEditorStateChange={this.onEditorStateChangeinput_Team_Personal_Story}
                                />
                              </div>
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Education</label>
                              <div
                                style={{
                                  display: "block",
                                  border: "1px solid black",
                                  padding: "2px",
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_Team_Education}
                                  onEditorStateChange={this.onEditorStateChangeinput_Team_Education}
                                />
                              </div>
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Interest</label>
                              <div
                                style={{
                                  display: "block",
                                  border: "1px solid black",
                                  padding: "2px",
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_Team_Interest}
                                  onEditorStateChange={this.onEditorStateChangeinput_Team_Interest}
                                />
                              </div>
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Team Contact Channels</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Team_Contact_Channels} onChange={this.setStateinput_Team_Contact_Channels} />
                            </div>
                            <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Image</label>
                              <br></br>
                              <input id="TeamFile" type="file" class="form-control-file" onChange={this.onFileChange} />
                              {this.state.input_Team_Image_Path != null ? 
                                <img class="table-img" src={`${APIImagePath}` + this.state.input_Team_Image_Path} /> : ""}
                            </div>
                            <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Hover Image</label>
                              <br></br>
                              <input id="TeamHoverFile" type="file" class="form-control-file" onChange={this.onFileHoverChange} />
                              {this.state.input_Team_Image_Hover_Path != null ? 
                                <img class="table-img" src={`${APIImagePath}` + this.state.input_Team_Image_Hover_Path} /> : ""}
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateTeam()}/>
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
    await this.GetTeamTable();
    // await this.GetAllDataTeam();
    // await this.GetDataCareCenter();
    // await this.GetAllDataTeamPerpage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    // await this.GetDataProvince();
    // await this.GetDistrict();
    // await this.GetSubDistrict();
    // await this.GetStore();
    // await this.GetProductType();
    // await this.GetProduct();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      menu_name: 'Manage Team',
      txtTopicPopData: 'Add',
      ResData: null,
      input_Team_ID: null,
      input_Team_Sequence: null,
      input_Team_Name: '',
      input_Team_Position: '',
      input_Team_Personal_Story: '',
      input_Team_Education: '',
      input_Team_Interest: '',
      input_Team_Contact_Channels: '',
      input_Team_Image_Path: null,
      input_Team_Image_Hover_Path: null,
      team_table: [],
      ArrFile: [],
      columns: [
        // team_Education
        // team_Interest
        // team_Contact_Channels
        {
          label: 'Team Image',
          field: 'team_Image_Path',
          width: 150
        },
        {
          label: 'Team Hover Image',
          field: 'team_Image_Hover_Path',
          width: 150
        },
        {
          label: 'Team Name',
          field: 'team_Name',
          width: 270
        },
        {
          label: 'Team Position',
          field: 'team_Position',
          width: 200
        },
        {
          label: 'Team Personal Story',
          field: 'team_Personal_Story',
          width: 100
        },
        {
          label: 'Team Education',
          field: 'team_Education',
          width: 100
        },
        {
          label: 'Team Interest',
          field: 'team_Interest',
          width: 100
        },
        {
          label: 'Team Contact Channels',
          field: 'team_Contact_Channels',
          width: 100
        },
        {
          label: 'Team Sequence',
          field: 'team_Sequence',
          width: 100
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

  async UpdateTeam() {
    var _this = this;

    if(!_this.state.input_Team_Name)
    {
      alert('Please fill [Team Name] !');
    }
    else
    {
      _this.setState({ loading: true });
      const Tempdata = {
        Team_ID: !_this.state.input_Team_ID ? null : _this.state.input_Team_ID,
        Team_Sequence: !_this.state.input_Team_Sequence ? null : parseInt(_this.state.input_Team_Sequence),
        Team_Name: !_this.state.input_Team_Name ? null : _this.state.input_Team_Name,
        Team_Position: !_this.state.input_Team_Position ? null : _this.state.input_Team_Position,
        Team_Personal_Story: !_this.state.input_Team_Personal_Story ? null : draftToHtml(convertToRaw(_this.state.input_Team_Personal_Story.getCurrentContent())),
        Team_Education: !_this.state.input_Team_Education ? null : draftToHtml(convertToRaw(_this.state.input_Team_Education.getCurrentContent())),
        Team_Interest: !_this.state.input_Team_Interest ? null : draftToHtml(convertToRaw(_this.state.input_Team_Interest.getCurrentContent())),
        Team_Contact_Channels: !_this.state.input_Team_Contact_Channels ? null : _this.state.input_Team_Contact_Channels,
        Team_Image_Path: !_this.state.input_Team_Image_Path ? null : _this.state.input_Team_Image_Path,
        Team_Image_Hover_Path: !_this.state.input_Team_Image_Hover_Path ? null : _this.state.input_Team_Image_Hover_Path,
        CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies
    };
      await axios.post(`${APIUrl}Team/UpdateDataTeam`, Tempdata)
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
    var teamID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.team_ID == parseInt(teamID));

    var txteditorteam_Personal_Story = null;
    var txteditorteam_Education = null;
    var txteditorteam_Interest = null;
    if(FindData != null)
    {        
      const contentBlock = htmlToDraft(this.ChangeFormatStringBR(FindData[0].team_Personal_Story));
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        txteditorteam_Personal_Story = EditorState.createWithContent(contentState);
      }
      const contentBlock2 = htmlToDraft(this.ChangeFormatStringBR(FindData[0].team_Education));
      if (contentBlock2) {
        const contentState = ContentState.createFromBlockArray(contentBlock2.contentBlocks);
        txteditorteam_Education = EditorState.createWithContent(contentState);
      }
      const contentBlock3 = htmlToDraft(this.ChangeFormatStringBR(FindData[0].team_Interest));
      if (contentBlock3) {
        const contentState = ContentState.createFromBlockArray(contentBlock3.contentBlocks);
        txteditorteam_Interest = EditorState.createWithContent(contentState);
      }
    }

    _this.setState({
      // txteditorteam_Personal_Story
      input_Team_ID: parseInt(teamID),
      input_Team_Sequence: FindData[0].team_Sequence,
      input_Team_Name: FindData[0].team_Name,
      input_Team_Position: FindData[0].team_Position,
      input_Team_Personal_Story: txteditorteam_Personal_Story,
      input_Team_Education: txteditorteam_Education,
      input_Team_Interest: txteditorteam_Interest,
      input_Team_Contact_Channels: FindData[0].team_Contact_Channels,
      input_Team_Image_Path: FindData[0].team_Image_Path,
      input_Team_Image_Hover_Path: FindData[0].team_Image_Hover_Path,
    });
  }

  CloseModal() {
    $("#ShowPic").removeAttr("style").hide();
    // $("#ShowDataDetail").removeAttr("style").hide();
  }

  ClosePopData() {
    $("#PopData").removeAttr("style").hide();
    var _this = this;
    _this.setState({ txtTopicPopData: 'Add', input_Team_ID: null, input_Team_Topic: '', input_Team_Name: '', input_Team_Description: '', input_Team_Image_Path: null , input_Team_Image_Hover_Path: null});
    _this.forceUpdate();
  }

  onFileChange = event => {
    this.SaveFile(event.target.files[0]);
  };

  onFileHoverChange = event => {
    this.SaveHoverFile(event.target.files[0]);
  };

  async SaveFile(file) {
    const data = new FormData();
    data.append('input_Team_Image_Path', file);
    await axios.post(`${APIUrl}Master/UploadImage`, data,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => {
        if (response.data.status === 0) {
            this.setState({ input_Team_Image_Path: response.data.data });
            $('#TeamFile').val('');
            this.forceUpdate();
        }
    })
    .catch((err) => {
        alert(err);
    });
  };

  async SaveHoverFile(file) {
    const data = new FormData();
    data.append('input_Team_Image_Hover_Path', file);
    await axios.post(`${APIUrl}Master/UploadImage`, data,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => {
        if (response.data.status === 0) {
            this.setState({ input_Team_Image_Hover_Path: response.data.data });
            $('#TeamHoverFile').val('');
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

  async GetTeamTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Team/GetTeamTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item, index) => {
            let TempSubData = {
              // no: (Number + (index + 1)),
              team_Image_Path: item.team_Image_Path,
              team_Image_Hover_Path: item.team_Image_Hover_Path,
              team_Name: item.team_Name,
              team_Position: item.team_Position,
              team_Personal_Story: item.team_Personal_Story.length > 20 ? item.team_Personal_Story.substring(0,20) + "..." : item.team_Personal_Story,
              team_Education: item.team_Education.length > 20 ? item.team_Education.substring(0,20) + "..." : item.team_Education,
              team_Interest: item.team_Interest.length > 20 ? item.team_Interest.substring(0,20) + "..." : item.team_Interest,
              team_Contact_Channels: item.team_Contact_Channels,
              team_Sequence: item.team_Sequence,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.team_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataTeam(item.team_ID)}>
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
          this.setState({ team_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  setStateinput_Team_Sequence = event => {
    this.setState({ input_Team_Sequence: event.target.value });
  }

  setStateinput_Team_Name = event => {
    this.setState({ input_Team_Name: event.target.value });
  }

  setStateinput_Team_Position = event => {
    this.setState({ input_Team_Position: event.target.value });
  }

  setStateinput_Team_Contact_Channels = event => {
    this.setState({ input_Team_Contact_Channels: event.target.value });
  }

  setStateinput_Team_Topic = event => {
    this.setState({ input_Team_Topic: event.target.value });
  }

  onEditorStateChangeinput_Team_Personal_Story = input_Team_Personal_Story => {
    this.setState({
      input_Team_Personal_Story,
    });
  };

  onEditorStateChangeinput_Team_Education = input_Team_Education => {
    this.setState({
      input_Team_Education,
    });
  };

  onEditorStateChangeinput_Team_Interest = input_Team_Interest => {
    this.setState({
      input_Team_Interest,
    });
  };

  DeleteDataTeam(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      axios.delete(`${APIUrl}Team/DeleteDataTeam?Team_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetTeamTable();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }
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
const customStyles = {
  valueContainer: () => ({
    height: 20,
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    padding: '2px 8px',
    position: 'relative',
    overflow: 'hidden',
  }),
}
export default Team;
