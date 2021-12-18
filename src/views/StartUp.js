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

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class StartUp extends React.Component {

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
                              <h1>StartUp</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add StartUp</button>
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
                        <h1>{this.state.txtTopicPopData}&nbsp;StartUp</h1>
                        <button type="button" className="close" onClick={() => this.ClosePopData()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          <div className="row">
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Industries</label>
                              <Select
                                value={this.state.input_FK_Industries_ID}
                                onChange={this.handleChangeIndustries}
                                options={this.state.optionsIndustries}
                              />
                            </div>
                            <div className="form-group col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Logo</label>
                              <br></br>
                              <input id="LogoFile" type="file" class="form-control-file" onChange={this.onFileChange} />
                              {this.state.input_Portfolio_Logo_Path != null ? 
                                <img class="table-img" src={`${APIImagePath}` + this.state.input_Portfolio_Logo_Path} /> : ""}
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Name</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Portfolio_Name} onChange={this.setStateinput_Portfolio_Name} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">About</label>
                              <textarea className="form-control py-1" rows="5" value={this.state.input_Portfolio_About} onChange={this.setStateinput_Portfolio_About} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <ChipInput
                                fullWidth
                                label='Technology'
                                placeholder='Type and press enter to add Technology Tags'
                                defaultValue={this.state.input_Portfolio_Technology}
                                // value={this.state.input_Portfolio_Technology}
                                onChange={this.setStateinput_Portfolio_Technology}
                                onDelete={this.deleteStateinput_Portfolio_Technology}
                              />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Location</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Portfolio_Location} onChange={this.setStateinput_Portfolio_Location} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Contact Website</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Portfolio_Contact_Website} onChange={this.setStateinput_Portfolio_Contact_Website} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Contact LinkedIn</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Portfolio_Contact_LinkedIn} onChange={this.setStateinput_Portfolio_Contact_LinkedIn} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateStartUp()}/>
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
      "}</style>
        </Container>
       </LoadingOverlay>
    );
  }

  async componentWillMount() {
    await this.GetOptionsIndustries();
    await this.GetStartUpTable();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      txtTopicPopData: 'Add',
      ResData: null,
      input_Portfolio_ID: null,
      input_FK_Industries_ID: null,
      input_Portfolio_Name: '',
      input_Portfolio_About: '',
      input_Portfolio_Technology: null,
      input_Portfolio_Location: '',
      input_Portfolio_Contact_Website: '',
      input_Portfolio_Contact_LinkedIn: '',
      input_Portfolio_Logo_Path: null,
      optionsIndustries: [],
      portfolio_table: [],
      ArrFile: [],
      columns: [
        {
          label: 'Logo',
          field: 'portfolio_Logo_Path',
          width: 270
        },     
        {
          label: 'Name',
          field: 'portfolio_Name',
          width: 150
        },   
        {
          label: 'Industries',
          field: 'industries_Name',
          width: 150
        },

        {
          label: 'About',
          field: 'portfolio_About',
          width: 200
        },
        {
          label: 'Technology',
          field: 'portfolio_Technology',
          width: 100
        },
        {
          label: 'Location',
          field: 'portfolio_Location',
          width: 150
        },
        {
          label: 'Contact Website',
          field: 'portfolio_Contact_Website',
          width: 150
        },
        {
          label: 'Contact LinkedIn',
          field: 'portfolio_Contact_LinkedIn',
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

  async GetStartUpTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Portfolio/GetStartUpTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              portfolio_Logo_Path: item.portfolio_Logo_Path,
              portfolio_Name: item.portfolio_Name,
              industries_Name: item.industries_Name,
              portfolio_About: item.portfolio_About.length > 20 ? item.portfolio_About.substring(0,20) + "..." : item.portfolio_About,
              portfolio_Technology: item.portfolio_Technology,
              portfolio_Location: item.portfolio_Location,
              portfolio_Contact_Website: item.portfolio_Contact_Website,
              portfolio_Contact_LinkedIn: item.portfolio_Contact_LinkedIn,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.portfolio_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataPortfolio(item.portfolio_ID)}>
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
    var PortfolioID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.portfolio_ID == parseInt(PortfolioID));

    var Arr_Portfolio_Technology = [];

    if(!!FindData[0].portfolio_Technology)
    {
      FindData[0].portfolio_Technology.split(',').forEach(element => {
        Arr_Portfolio_Technology.push(element)
      });
    }
    
    var tempIndustries = {
      value: FindData[0].industries_ID,
      label: FindData[0].industries_Name
    };

    _this.setState({
      input_Portfolio_ID:  parseInt(PortfolioID),
      input_FK_Industries_ID: tempIndustries,
      // input_FK_Industries_ID: FindData[0].industries_ID,
      input_Portfolio_Name: FindData[0].portfolio_Name,
      input_Portfolio_Logo_Path: FindData[0].portfolio_Logo_Path,
      input_Portfolio_About: FindData[0].portfolio_About,
      input_Portfolio_Technology:  Arr_Portfolio_Technology,
      input_Portfolio_Location: FindData[0].portfolio_Location,
      input_Portfolio_Contact_Website: FindData[0].portfolio_Contact_Website,
      input_Portfolio_Contact_LinkedIn: FindData[0].portfolio_Contact_LinkedIn,
    });

    _this.handleChangeIndustries(tempIndustries);

  }

  async UpdateStartUp() {
    var _this = this;

    if(!_this.state.input_Portfolio_Name)
    {
      alert('Please fill [StartUp Name] !');
    }
    else
    {
      _this.setState({ loading: true });
      var txtinput_Portfolio_Technology = '';
      if(!!_this.state.input_Portfolio_Technology)
      {
        _this.state.input_Portfolio_Technology.forEach(element => {
          txtinput_Portfolio_Technology += element + ','
        });

        txtinput_Portfolio_Technology = txtinput_Portfolio_Technology.substring(0,txtinput_Portfolio_Technology.length - 1)
      }


      const Tempdata = {
        Portfolio_ID: !_this.state.input_Portfolio_ID ? null : _this.state.input_Portfolio_ID,
        FK_Industries_ID: !_this.state.input_FK_Industries_ID ? null : _this.state.input_FK_Industries_ID.value,
        Portfolio_Section: 1,
        Portfolio_Name: !_this.state.input_Portfolio_Name ? null : _this.state.input_Portfolio_Name,
        Portfolio_Logo_Path: !_this.state.input_Portfolio_Logo_Path ? null : _this.state.input_Portfolio_Logo_Path,
        Portfolio_About: !_this.state.input_Portfolio_About ? null : _this.state.input_Portfolio_About,
        Portfolio_Technology: txtinput_Portfolio_Technology,
        Portfolio_Location: !_this.state.input_Portfolio_Location ? null : _this.state.input_Portfolio_Location,
        Portfolio_Contact_Website: !_this.state.input_Portfolio_Contact_Website ? null : _this.state.input_Portfolio_Contact_Website,
        Portfolio_Contact_LinkedIn: !_this.state.input_Portfolio_Contact_LinkedIn ? null : _this.state.input_Portfolio_Contact_LinkedIn,
        CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies
      };

      await axios.post(`${APIUrl}Portfolio/UpdateDataPortfolio`, Tempdata)
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
    _this.setState({ txtTopicPopData: 'Add', input_Portfolio_ID: null, input_Portfolio_About: '', input_Portfolio_Name: '', input_Portfolio_Location: '', input_Portfolio_Contact_Website: '', input_Portfolio_Contact_LinkedIn: '', input_Portfolio_Logo_Path: null,input_FK_Industries_ID: null, input_Portfolio_Technology: []});
    _this.forceUpdate();
  }

  onFileChange = event => {
    this.SaveFile(event.target.files[0]);
  };

  async SaveFile(file) {
    const data = new FormData();
    data.append('input_Portfolio_Logo_Path', file);
    await axios.post(`${APIUrl}Master/UploadImage`, data,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((response) => {
        if (response.data.status === 0) {
            this.setState({ input_Portfolio_Logo_Path: response.data.data });
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

  setStateinput_Portfolio_Name = event => {
    this.setState({ input_Portfolio_Name: event.target.value });
  }

  setStateinput_Portfolio_About = event => {
    this.setState({ input_Portfolio_About: event.target.value });
  }

  setStateinput_Portfolio_Technology = input_Portfolio_Technology => {
    this.setState({ input_Portfolio_Technology });
  }

  deleteStateinput_Portfolio_Technology = event => {
    var _this = this;
    var t = _this.input_Portfolio_Technology.filter(x => x != event)
    alert(t)
    // this.setState({ input_Portfolio_Technology: event });
  }

  setStateinput_Portfolio_Location = event => {
    this.setState({ input_Portfolio_Location: event.target.value });
  }

  setStateinput_Portfolio_Contact_Website = event => {
    this.setState({ input_Portfolio_Contact_Website: event.target.value });
  }

  setStateinput_Portfolio_Contact_LinkedIn = event => {
    this.setState({ input_Portfolio_Contact_LinkedIn: event.target.value });
  }

  DeleteDataPortfolio(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      axios.delete(`${APIUrl}Portfolio/DeleteDataPortfolio?Portfolio_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetStartUpTable();
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
export default StartUp;
