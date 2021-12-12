import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import { Activity } from 'react-feather';
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import { Plus } from 'react-feather';
import moment from 'moment';
import Select from 'react-select';
import Cookies from "js-cookie";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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

class BannerList extends React.Component {


  async componentWillMount() {
    console.log(this.state.usernames);
    await this.GetBannerTable();
    // await this.GetAllDataBanner();
    // await this.GetDataCareCenter();
    // await this.GetAllDataBannerPerpage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
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
      menu_name: 'Manage Banner',
      txtTopicPopData: 'Add',
      input_Banner_Name: '',
      input_Banner_Topic: '',
      input_Banner_Description: '',
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
      imagePathPop: ""
    };
  }

  UpdateBanner = event => {
    event.preventDefault();

    var temp = [];

    Array.prototype.forEach.call(this.state.ArrFile, function (index) {
      if (index.Type == "Old") {
        temp.push(index.File);
      }
    });

    const Tempdata = {
      ID: this.state.BannerID == undefined ? null : this.state.BannerID,

      CustomerName: this.state.CustomerName == undefined ? null : this.state.CustomerName,
      CustomerSurname: this.state.CustomerSurname == undefined ? null : this.state.CustomerSurname,
      CustomerTel: this.state.CustomerTel == undefined ? null : this.state.CustomerTel,
      CustomerMobile: this.state.CustomerMobile == undefined ? null : this.state.CustomerMobile,
      CustomerEmail: this.state.CustomerEmail == undefined ? null : this.state.CustomerEmail,

      CustomerAddress: this.state.CustomerAddress == undefined ? null : this.state.CustomerAddress,
      CustomerProvince: this.state.CustomerProvince == undefined ? null : this.state.CustomerProvince.value,
      CustomerDistrict: this.state.CustomerDistrict == undefined ? null : this.state.CustomerDistrict.value,
      CustomerSubDistrict: this.state.CustomerSubDistrict == undefined ? null : this.state.CustomerSubDistrict.value,
      CustomerZipCode: this.state.CustomerZipCode == undefined ? null : this.state.CustomerZipCode,

      Barcode_No: this.state.Barcode_No == undefined ? null : this.state.Barcode_No,
      Receipt_Number: this.state.Receipt_Number == undefined ? null : this.state.Receipt_Number,
      Banner_No: this.state.Banner_No == undefined ? null : this.state.Banner_No,
      Store_Other_Name: this.state.Store_Other_Name == undefined ? null : this.state.Store_Other_Name,
      Banner_Date: this.state.Banner_Date == undefined ? null : this.state.Banner_Date,
      Product_Code_Other: this.state.Product_Code_Other == undefined ? null : this.state.Product_Code_Other,
      Product_QTY: this.state.Product_QTY == undefined ? null : this.state.Product_QTY,
      Score: this.state.Score == undefined ? null : this.state.Score,
      Description: this.state.Description == undefined ? null : this.state.Description,
      ProductCode: this.state.ProductCode == undefined ? null : this.state.ProductCode,
      Product: this.state.Product.value == undefined ? null : this.state.Product.value,
      ProductType: this.state.ProductType.value == undefined ? null : this.state.ProductType.value,
      Province: this.state.Province.value == undefined ? null : this.state.Province.value,
      Quota: this.state.Quota == undefined ? null : this.state.Quota,
      ServiceCenter: this.state.ServiceCenter == undefined ? null : this.state.ServiceCenter,
      StoreName: this.state.Store.value == undefined ? null : this.state.Store.value,
      File: temp,
      Create_By: this.state.usernames ? null : this.state.usernames,
      remark: this.state.remark == undefined ? null : this.state.remark,
    };
    const data = new FormData();

    Array.prototype.forEach.call(this.state.ArrFile, function (index) {
      if (index.Type == "New") {
        data.append('files', index.File);
      }
    });

    data.append('datas', JSON.stringify(Tempdata));
    // axios.post(`http://www.mostactive.info/API/api/Banner/UpdateDataBanner`, Tempdata)
    // axios.post(`https://localhost:44373/api/Banner/UpdateDataBanner`, Tempdata)
    axios.post(`${APIUrl}Banner/UpdateDataBanner`, data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status == 0) {
          //console.log(response.data.data);
          alert('Success !');
          window.location.reload();
        }
      })
      .catch((err) => alert(err));
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
    var data = value;
    this.setState({ remark: null, RowID: data });
    var FindData = this.state.ResData.filter(x => x.id == parseInt(data));
    // console.log(FindData);
    if (FindData[0].province_ID != null && FindData[0].province_ID != "") {
      var tempStore = this.state.StoreAll.filter(x => x.fK_Province_ID == parseInt(FindData[0].province_ID));
      var ArrTempStore = [];
      var FirstStoreObj = {
        value: 0,
        label: 'ไม่เลือกร้านค้า',
      };
      ArrTempStore.push(FirstStoreObj);
      Array.prototype.forEach.call(tempStore, function (index) {
        var StoreObj = {
          value: index.id,
          label: index.store_Name + " " + index.store_Branch,
        };
        ArrTempStore.push(StoreObj);
      });
      this.setState({ optionsStore: ArrTempStore });
    }
    var tempProvince = {
      value: FindData[0].province_ID,
      label: FindData[0].province_Name
    };
    var tempStore = {
      value: FindData[0].store_ID,
      label: FindData[0].store_ID == 0 ? 'ไม่เลือกร้านค้า' : FindData[0].store_Name
    };
    var tempProductType = {
      value: FindData[0].type_ID,
      label: FindData[0].type_Name
    };
    var tempProduct = {
      value: FindData[0].product_ID,
      label: FindData[0].product_Name
    };
    var customerType = "";
    if (parseInt(FindData[0].customer_Type) == 1) {
      customerType = "การบริการลูกค้าแบบสมาชิกบ้านพักอาศัย";
    } else if (parseInt(FindData[0].customer_Type) == 2) {
      customerType = "การบริการลูกค้าแบบสมาชิกผู้รับเหมารายย่อย";
    } else if (parseInt(FindData[0].customer_Type) == 3) {
      customerType = "การบริการลูกค้าแบบสมาชิกโครงการสำนักงานโรงแรม,ออฟฟิศ ฯลฯ ที่ไม่ใช่บ้านพักอาศัย";
    }
    _this.setState({
      BannerID: parseInt(data),
      CustomerCode: FindData[0].customer_Code,
      CustomerAddress: FindData[0].customer_Address,
      CustomerEmail: FindData[0].customer_Email,
      CustomerTel: FindData[0].customer_Tel,
      CustomerName: FindData[0].customer_Name,
      CustomerSurname: FindData[0].customer_Surname,
      CustomerMobile: FindData[0].customer_Mobile,
      Barcode_No: FindData[0].barcode_No,
      Receipt_Number: FindData[0].receipt_Number,
      Store_Other_Name: FindData[0].store_Other_Name,
      Banner_No: FindData[0].banner_No,
      Product_Code_Other: FindData[0].product_Code_Other,
      Product_QTY: FindData[0].product_QTY,
      remark: FindData[0].remark == null ? "" : FindData[0].remark,
      Score: FindData[0].score,
      Description: FindData[0].description,
      customer_province_name: FindData[0].customer_province_name,
      sub_district_Name: FindData[0].sub_district_Name,
      district_Name: FindData[0].district_Name,
      // Banner_Date: FindData[0].banner_Date_Format,
      Banner_Date: FindData[0].banner_Date_Format == null ? "" : (parseInt(FindData[0].banner_Date_Format.split('/')[2]) + 543) + '-' + FindData[0].banner_Date_Format.split('/')[1] + '-' + FindData[0].banner_Date_Format.split('/')[0],
      CustomerType: customerType,
      CustomerZipCode: FindData[0].customer_ZipCode,
      ProductCode: FindData[0].productCode,
      Product: tempProduct,
      ProductType: tempProductType,
      Province: tempProvince,
      Quota: FindData[0].quota,
      ServiceCenter: FindData[0].ServiceCenter,
      Store: tempStore,
      // insModel = _this.state.optionsInstallationModel.filter(x => x.value == (subTempData.installation_model == null ? 0 : subTempData.installation_model.value));
      CustomerProvince: FindData[0].customerProvince,
      CustomerDistrict: FindData[0].customerDistrict,
      CustomerSubDistrict: FindData[0].customerSubDistrict
    });

    _this.handleChangeCustomerProvince(FindData[0].customerProvince);
    _this.handleChangeCustomerDistrict(FindData[0].customerDistrict);
    _this.handleChangeCustomerSubDistrict(FindData[0].customerSubDistrict);

    this.setState({ ImagePath: FindData[0].image_Path });
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

    // this.state.ArrFile.push(FileObj);
  }

  CloseModal() {
    $("#ShowPic").removeAttr("style").hide();
    // $("#ShowDataDetail").removeAttr("style").hide();
  }

  CloseEditModal() {
    $("#PopData").removeAttr("style").hide();
  }

  onFileChange = event => {
    // console.log("onFileChange");
    // const files = event.target.files;

    var FileObj = {
      File: event.target.files[0],
      Type: "New"
    };
    this.state.ArrFile.push(FileObj);
    // this.renderTableFile();
    // console.log(this.state.ArrFile);
    this.forceUpdate();
    // this.setState({ selectedFile: event.target.files[0] });
  };

  onFileDelete(value) {
    this.state.ArrFile.splice(value, 1);
    this.forceUpdate();
  };

  async GetBannerTable() {
    var _this = this;
    _this.setState({ loading: true });
    await axios
      .get(`${APIUrl}Banner/GetBannerTable`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false });
          var TempData = [];
          response.data.data.map((item, index) => {
            let TempSubData = {
              // no: (Number + (index + 1)),
              banner_Name: item.banner_Name,
              banner_Topic: item.banner_Topic,
              banner_Description: item.banner_Description,
              banner_Image_Path: item.banner_Image_Path,
              is_Display: <Switch onChange={this.handleChange} checked={item.is_Display} />,
              Action: 
              <div>
                <button style={{ marginTop: '-9px'}} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                    <img
                      class="img-manage"
                      src={require("../images/editor.png")}
                      alt="Edit"
                    />
                  </button>
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#PopData" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
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
    var temp = {
      ID: val
    };
    axios.post(`${APIUrl}Banner/DeleteDataBanner`, temp)
      .then((response) => {
        if (response.data.status == 0) {
          alert(response.data.message);
          window.location.reload();
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  
  renderShowFile() {
    return this.state.ArrFile.map((item, index) => {
      // console.log(item.File.name);
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
      // console.log(item.File.name);
      // var count = this.state.ArrFile.length;
      if (item.Type == "New") {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#tblImg' + index).attr('src', e.target.result);
        };
        reader.readAsDataURL(item.File);

        // var files = this.state.ArrFile[this.state.ArrFile.length - 1]; //FileList object
        // // var output = document.getElementById("result");

        // // for (var i = 0; i < files.length; i++) {
        //     var file = files.File;
        //     //Only pics
        //     if (!file.type.match('image'));

        //     var picReader = new FileReader();
        //     picReader.addEventListener("load", function (event) {
        //         var picFile = event.target;
        //         var div = document.createElement("div");
        //         div.innerHTML = "<img id='tblImg' class='table-img' src='" + picFile.result + "'/>";
        //         // output.insertBefore(div, null);\
        //         document.getElementById('result'+ count).insertBefore(div, null);
        //     });
        //     //Read the image
        //     picReader.readAsDataURL(file);
        // }
      }
      return (
        <tr key={index}>
          {item.Type == "New" && <td> <img id={"tblImg" + index} src={item.File.name} class="table-img"></img></td>}
          {/* {item.Type == "New" && <td><output id="result" />} */}
          {/* {item.Type == "New" && <td><output id={"result"+ count} /></td>} */}
          {item.Type == "Old" && <td> {item.File.path.match('.pdf') == null ? <img class="table-img"  style={{cursor: 'pointer'}}  src={`${APIImagePath}` + item.File.path} onClick={() => window.open(`${APIImagePath}` + item.File.path)}></img> : <img class="table-img"  style={{cursor: 'pointer'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.File.path)}></img>} </td>}
          <td>{item.File.name}</td>
          <td onClick={() => this.onFileDelete(index)}>
            <input type="button" value="Delete" className="btn btn-danger" />
          </td>
        </tr>
      );
    });
  }
  
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
                            entriesOptions={[5, 20, 25]}
                            entries={25}
                            data={this.state.banner_table}
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
                        <h1>{this.state.txtTopicPopData}&nbsp;Banner</h1>
                        <button type="button" className="close" onClick={() => this.CloseEditModal()} data-dismiss="modal">&times;</button>
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
                                  // maxHeight: "300px"
                                }}
                              >
                                <Editor
                                  editorState={this.state.input_Banner_Description}
                                  onEditorStateChange={this.onEditorStateChangeinput_Banner_Description}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <div className="float-right">
                                <input type="submit" value={this.state.txtTopicPopData + " Data"} className="btn btn-success" style={{marginTop:"24px"}} />
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
export default BannerList;
