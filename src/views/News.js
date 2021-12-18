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
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBDataTableV5
} from 'mdbreact';
import LoadingOverlay from "react-loading-overlay";
import ChipInput from 'material-ui-chip-input'
import Switch from "react-switch";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class News extends React.Component {

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
                              <h1>News & Activity</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add News & Activity</button>
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
                            data={this.state.portfolio_table}
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
                        <h1>{this.state.txtTopicPopData}&nbsp;News & Activity</h1>
                        <button type="button" className="close" onClick={() => this.ClosePopData()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          <div className="row">
                            {/* <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Industries</label>
                              <Select
                                value={this.state.input_FK_Industries_ID}
                                onChange={this.handleChangeIndustries}
                                options={this.state.optionsIndustries}
                              />
                            </div> */}
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">News Title</label>
                              <input className="form-control py-1" type="text" value={this.state.input_News_Title} onChange={this.setStateinput_News_Title} />
                            </div>
                            <div className="form-group center col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">News Author</label>
                              <input className="form-control py-1" type="text" value={this.state.input_News_Author} onChange={this.setStateinput_News_Author} />
                            </div>
                            <div className="form-group center col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">News Publish Date</label>
                              <input className="form-control py-1" type="date" value={this.state.input_News_Publish_Date} placeholder="dd/mm/yyyy" onChange={this.setStateinput_News_Publish_Date} />
                            </div>
                            <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">News Main Image</label>
                              <br></br>
                              <input id="LogoFile" type="file" class="form-control-file" onChange={this.onFileChange} />
                              {this.state.input_News_Main_Image_Path != null ? 
                                <img class="table-img" src={`${APIImagePath}` + this.state.input_News_Main_Image_Path} /> : ""}
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <ChipInput
                                fullWidth
                                label='News Tags'
                                placeholder='Type and press enter to add News Tags'
                                defaultValue={this.state.input_News_Tags}
                                onChange={this.setStateinput_News_Tags}
                                onDelete={this.deleteStateinput_News_Tags}
                              />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">News Content</label>
                              <div
                                style={{
                                  display: "block",
                                  border: "1px solid black",
                                  padding: "2px",
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_News_Content}
                                  onEditorStateChange={this.onEditorStateChangeinput_News_Content}
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Image</label>
                              <br></br>
                              <input type="file" onChange={this.onFileMultipleChange} multiple="multiple" />
                            </div>
                            <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                <thead>
                                  <tr>
                                    <th>รูปตัวอย่าง</th>
                                    <th>ชื่อ</th>
                                    <th>ลบ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.renderTableFile()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateNews()}/>
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
    await this.GetOptionsIndustries();
    await this.GetNewsTable();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      txtTopicPopData: 'Add',
      ResData: null,
      input_News_ID: null,
      input_News_Title: '',
      input_News_Content: '',
      input_News_Main_Image_Path: null,
      input_News_Author: '',
      input_News_Tags: null,
      input_News_Publish_Date: null,
      input_Is_Display: null,
      News_table: [],
      ArrFile: [],
      ArrMultipleFile: [],
      columns: [
        {
          label: 'Image',
          field: 'news_Main_Image_Path',
          width: 270
        },     
        {
          label: 'News Title',
          field: 'news_Title',
          width: 150
        },   
        {
          label: 'News Content',
          field: 'news_Content',
          width: 150
        },

        {
          label: 'News Author',
          field: 'news_Author',
          width: 200
        },
        {
          label: 'News Tags',
          field: 'news_Tags',
          width: 100
        },
        {
          label: 'News Publish Date',
          field: 'news_Publish_Date',
          width: 150
        },
        {
          label: 'Show',
          field: 'is_Display',
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

  async GetOptionsIndustries() {
    await axios
      .get(`${APIUrl}Master/GetOptionsIndustries`)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var ProvinceObj = {
              value: index.industries_ID,
              label: index.industries_Name
            };
            ArrTemp.push(ProvinceObj);
          });
          this.setState({ optionsIndustries: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  handleChangeIndustries = event => {
    if (event != null && event != "") {
      if (event.value === undefined) //กรณีเปิด popup bind ค่าจาก api
      {
        var value = {
          label: event.industries_Name,
          value: event.industries_ID
        };
        this.setState({ input_FK_Industries_ID: value });
      }
      else //กรณีเลือกจาก cbb
      {
        this.setState({ input_FK_Industries_ID: event });
      }
    }
  }

  async GetNewsTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}News/GetNewsTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              news_Main_Image_Path: item.news_Main_Image_Path,
              news_Title: item.news_Title,
              news_Content: item.news_Content.length > 20 ? item.news_Content.substring(0,20) + "..." : item.news_Content,
              news_Author: item.news_Author,
              news_Tags: item.news_Tags,
              news_Publish_Date: item.news_Publish_Date,
              is_Display: <Switch onChange={() => this.SetDisplayNews(item.news_ID)} checked={item.is_Display} />,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.news_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataNews(item.news_ID)}>
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
          this.setState({ portfolio_table: dataTable });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  OpenEditPopup(value) {
    var _this = this;
    var NewsID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.news_ID == parseInt(NewsID));

    var Arr_News_Tags = [];

    if(!!FindData[0].news_Tags)
    {
      FindData[0].news_Tags.split(',').forEach(element => {
        Arr_News_Tags.push(element)
      });
    }

    
    var txteditorState = null;
    if(FindData != null)
    {        
      const contentBlock = htmlToDraft(this.ChangeFormatStringBR(FindData[0].news_Content));
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        txteditorState = EditorState.createWithContent(contentState);
      }
    }
    
    _this.setState({
      input_News_ID:  parseInt(NewsID),
      input_News_Title: FindData[0].news_Title,
      input_News_Main_Image_Path: FindData[0].news_Main_Image_Path,
      input_News_Content: txteditorState,
      input_News_Tags: Arr_News_Tags,
      input_News_Author: FindData[0].news_Author,
      input_News_Publish_Date: FindData[0].news_Publish_Date,
      // input_News_Publish_Date: FindData[0].news_Publish_Date == null ? "" : (parseInt(FindData[0].news_Publish_Date.split('/')[2]) + 543) + '-' + FindData[0].news_Publish_Date.split('/')[1] + '-' + FindData[0].news_Publish_Date.split('/')[0],
    });

    // this.setState({ ArrMultipleFile: FindData[0].listImages });

    var ArrMultipleTemp = [];
    Array.prototype.forEach.call(FindData[0].listImages, function (index) {
      var FileObj = {
        File: {
          id: index.news_File_ID,
          name: index.news_File_Name,
          path: index.news_File_Path
        },
        Type: "Old"
      };
      ArrMultipleTemp.push(FileObj);
    });
    this.setState({ ArrMultipleFile: ArrMultipleTemp });
  }

  async UpdateNews() {
    var _this = this;

    if(!_this.state.input_News_Title)
    {
      alert('Please fill [News Topic] !');
    }
    else
    {
      _this.setState({ loading: true });

      var temp = [];

      Array.prototype.forEach.call(this.state.ArrMultipleFile, function (index) {
        if (index.Type == "Old") {
          temp.push(index.File);
        }
      });

      var txtinput_News_Tags = '';
      if(!!_this.state.input_News_Tags)
      {
        _this.state.input_News_Tags.forEach(element => {
          txtinput_News_Tags += element + ','
        });

        txtinput_News_Tags = txtinput_News_Tags.substring(0,txtinput_News_Tags.length - 1)
      }


      const Tempdata = {
        News_ID: !_this.state.input_News_ID ? null : _this.state.input_News_ID,
        News_Title: !_this.state.input_News_Title ? null : _this.state.input_News_Title,
        News_Content: !_this.state.input_News_Content ? null : draftToHtml(convertToRaw(_this.state.input_News_Content.getCurrentContent())),
        News_Main_Image_Path: !_this.state.input_News_Main_Image_Path ? null : _this.state.input_News_Main_Image_Path,
        News_Author: !_this.state.input_News_Author ? null : _this.state.input_News_Author,
        News_Publish_Date: this.state.input_News_Publish_Date == undefined ? null : this.state.input_News_Publish_Date,
        News_Tags: txtinput_News_Tags,
        File: temp,
        CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies,
    };

      const data = new FormData();

      Array.prototype.forEach.call(this.state.ArrMultipleFile, function (index) {
        if (index.Type == "New") {
          data.append('files', index.File);
        }
      });
  
      data.append('datas', JSON.stringify(Tempdata));

      
      await axios.post(`${APIUrl}News/UpdateDataNews`, data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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


  CloseModal() {
    $("#ShowPic").removeAttr("style").hide();
    // $("#ShowDataDetail").removeAttr("style").hide();
  }

  ClosePopData() {
    $("#PopData").removeAttr("style").hide();
    var _this = this;
    _this.setState({ 
      input_News_ID: null,
      input_News_Title: '',
      input_News_Main_Image_Path: null,
      input_News_Content: null,
      ArrMultipleFile: [],
      input_News_Tags: [],
      input_News_Author: '',
      input_News_Publish_Date: '',
    });
    _this.forceUpdate();
  }

  onFileChange = event => {
    this.SaveFile(event.target.files[0]);
  };

  
  onFileMultipleChange = event => {
    var FileObj = {
      File: event.target.files[0],
      Type: "New"
    };
    this.state.ArrMultipleFile.push(FileObj);
    this.forceUpdate();
  };


  async SaveFile(file) {
    const data = new FormData();
    data.append('input_News_Main_Image_Path', file);
    await axios.post(`${APIUrl}Master/UploadImage`, data,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => {
        if (response.data.status === 0) {
            this.setState({ input_News_Main_Image_Path: response.data.data });
            $('#LogoFile').val('');
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

  setStateinput_News_Title = event => {
    this.setState({ input_News_Title: event.target.value });
  }

  setStateinput_News_Author = event => {
    this.setState({ input_News_Author: event.target.value });
  }

  setStateinput_News_Publish_Date = event => {
    this.setState({ input_News_Publish_Date: event.target.value });
  }

  setStateinput_News_Tags = input_News_Tags => {
    this.setState({ input_News_Tags });
  }

  deleteStateinput_News_Tags = event => {
    var _this = this;
    var t = _this.input_News_Tags.filter(x => x != event)
    alert(t)
    // this.setState({ input_Portfolio_Technology: event });
  }

  onEditorStateChangeinput_News_Content = input_News_Content => {
    this.setState({
      input_News_Content,
    });
  };


  DeleteDataNews(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      axios.delete(`${APIUrl}News/DeleteDataNews?News_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetNewsTable();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }
  }

  async SetDisplayNews(val) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      await axios.put(`${APIUrl}News/SetDisplayNews?News_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          await this.GetNewsTable();
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
    return this.state.ArrMultipleFile.map((item, index) => {
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
export default News;
