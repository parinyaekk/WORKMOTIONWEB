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

class Categories extends React.Component {

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
                              <h1>Categories</h1>
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                <button class="btn btn-outline-info" type="button" style={{ width: '100%' }} data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => null}><Plus />&nbsp; Add Categories</button>
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
                            data={this.state.categories_table}
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
                        <h1>{this.state.txtTopicPopData}&nbsp;Categories</h1>
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
                            <div className="form-group center col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <input className="py-1" type="checkbox" id="chkTop"/>
                              <label className="small mb-1" for="chkTop">&nbsp; Top Group</label>
                            </div>
                            <div className="form-group center col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                            </div>
                            <div className="form-group center col-md-6" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Group Number</label>
                              <input className="form-control py-1" type="number" value={this.state.input_Group_Number} onChange={this.setStateinput_Group_Number} />
                            </div>
                            <div className="form-group center col-md-12" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                              <label className="small mb-1">Categories Name</label>
                              <input className="form-control py-1" type="text" value={this.state.input_Categories_Name} onChange={this.setStateinput_Categories_Name} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} onClick={() => this.UpdateCategories()}/>
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
    await this.GetOptionCategories();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PerPage: 5,
      txtTopicPopData: 'Add',
      ResData: null,
      input_Categories_ID: null,
      input_FK_Industries_ID: null,
      input_Group_Number: null,
      input_Categories_Name: '',
      optionsIndustries: [],
      categories_table: [],
      ArrFile: [],
      columns: [     
        {
          label: 'Name',
          field: 'categories_Name',
          width: 150
        },   
        {
          label: 'Industries',
          field: 'industries_Name',
          width: 150
        },
        {
          label: 'Group Number',
          field: 'group_Number',
          width: 150
        },
        {
          label: 'Top Group',
          field: 'is_TopGroup',
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

  async GetOptionCategories() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Master/GetOptionCategories`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data});
          var TempData = [];

          response.data.data.map((item) => {
            let TempSubData = {
              categories_Name: item.categories_Name,
              industries_Name: item.industries_Name,
              group_Number: item.group_Number,
              is_TopGroup: item.is_TopGroup == true ? "Header" : "Children",
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.categories_ID)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteDataCategories(item.categories_ID)}>
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
          this.setState({ categories_table: dataTable });
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
    var CategoriesID = value;
    this.setState({ txtTopicPopData: 'Edit' });
    var FindData = this.state.ResData.filter(x => x.categories_ID == parseInt(CategoriesID));
    
    var tempIndustries = {
      value: FindData[0].industries_ID,
      label: FindData[0].industries_Name
    };

    _this.setState({
      input_Categories_ID:  parseInt(CategoriesID),
      input_Group_Number:  parseInt(FindData[0].group_Number),
      input_FK_Industries_ID: tempIndustries,
      input_Categories_Name: FindData[0].categories_Name,
    });

    FindData[0].is_TopGroup == true ? $("#chkTop").prop('checked', true) : $("#chkTop").prop('checked', false);

    _this.handleChangeIndustries(tempIndustries);

  }

  async UpdateCategories() {
    var _this = this;

    if(!_this.state.input_Categories_Name || !_this.state.input_FK_Industries_ID)
    {
      alert('Please fill [Categories Name || Industries] !');
    }
    else
    {
      _this.setState({ loading: true });

      const Tempdata = {
        Categories_ID: !_this.state.input_Categories_ID ? null : _this.state.input_Categories_ID,
        FK_Industries_ID: !_this.state.input_FK_Industries_ID ? null : _this.state.input_FK_Industries_ID.value,
        Categories_Name: !_this.state.input_Categories_Name ? null : _this.state.input_Categories_Name,
        Group_Number: !_this.state.input_Group_Number ? null : parseInt(_this.state.input_Group_Number),
        Is_TopGroup: $("#chkTop").is(':checked') == true ? true : false,
        CreateBy: !this.state.CreateByCookies ? null : this.state.CreateByCookies
      };

      await axios.post(`${APIUrl}Master/UpdateDataCategories`, Tempdata)
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

  CloseModal() {
    $("#ShowPic").removeAttr("style").hide();
    // $("#ShowDataDetail").removeAttr("style").hide();
  }

  ClosePopData() {
    $("#PopData").removeAttr("style").hide();
    var _this = this;
    _this.setState({ txtTopicPopData: 'Add', input_Categories_ID: null, input_Group_Number: '', input_Categories_Name: '', input_FK_Industries_ID: null });
    $('input:checkbox').prop('checked', false);
    _this.forceUpdate();
  }

  setStateinput_Categories_Name = event => {
    this.setState({ input_Categories_Name: event.target.value });
  }

  setStateinput_Group_Number = event => {
    this.setState({ input_Group_Number: event.target.value });
  }

  DeleteDataCategories(val) {
    var popconfirm = window.confirm('Confirm to delete ? [Ok/Cancel]');
    if (popconfirm) {
      var CreateBy = !this.state.CreateByCookies ? null : this.state.CreateByCookies;
      axios.delete(`${APIUrl}Master/DeleteDataCategories?Categories_ID=` + val + `&CreateBy=` + CreateBy)
      .then(async (response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          await this.GetOptionCategories();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }
  }
}
export default Categories;
