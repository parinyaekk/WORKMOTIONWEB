import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import { Activity } from 'react-feather';
// import { TableHeader } from "../components/DataTable";
// import ReactTable from "react-table";
//import "../css/styles.css";
// import "../js/scripts.js";
// import "../assets/demo/datatables-demo.js";
//import "../assets/img/favicon.png";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import { Download, Search } from 'react-feather';
import moment from 'moment';
import Select from 'react-select';
import Cookies from "js-cookie";
import {
  MDBDataTable,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdbreact';
import LoadingOverlay from "react-loading-overlay";

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class WarrantyList extends React.Component {

  UpdateWarranty = event => {
    event.preventDefault();

    var temp = [];

    Array.prototype.forEach.call(this.state.ArrFile, function (index) {
      if (index.Type == "Old") {
        temp.push(index.File);
      }
    });

    const Tempdata = {
      ID: this.state.WarrantyID == undefined ? null : this.state.WarrantyID,

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
      Warranty_No: this.state.Warranty_No == undefined ? null : this.state.Warranty_No,
      Store_Other_Name: this.state.Store_Other_Name == undefined ? null : this.state.Store_Other_Name,
      Warranty_Date: this.state.Warranty_Date == undefined ? null : this.state.Warranty_Date,
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
    // axios.post(`http://www.mostactive.info/API/api/Warranty/UpdateDataWarranty`, Tempdata)
    // axios.post(`https://localhost:44373/api/Warranty/UpdateDataWarranty`, Tempdata)
    axios.post(`${APIUrl}Warranty/UpdateDataWarranty`, data,
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

  async componentWillMount() {
    console.log(this.state.usernames);
    await this.GetDataPermission();
    await this.GetAllDataWarranty();
    await this.GetDataCareCenter();
    await this.GetAllDataWarrantyPerpage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    await this.GetDataProvince();
    await this.GetDistrict();
    await this.GetSubDistrict();
    await this.GetStore();
    await this.GetProductType();
    await this.GetProduct();

  }

  async GetDataPermission() {
    await axios
      .post(`${APIUrl}Permission/GetDataPermission`)
      .then(response => {
        if (response.data.status == 0) {
          var temp = response.data.data;
          var Permission = temp.filter(x => x.user_group == this.state.User_Group && x.menu_name == this.state.menu_name.toLowerCase());
          if (Permission.length > 0) {
            this.setState({ Permission: Permission[0].permission });
          }
          this.forceUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      WarrantyID: parseInt(data),
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
      Warranty_No: FindData[0].warranty_No,
      Product_Code_Other: FindData[0].product_Code_Other,
      Product_QTY: FindData[0].product_QTY,
      remark: FindData[0].remark == null ? "" : FindData[0].remark,
      Score: FindData[0].score,
      Description: FindData[0].description,
      customer_province_name: FindData[0].customer_province_name,
      sub_district_Name: FindData[0].sub_district_Name,
      district_Name: FindData[0].district_Name,
      // Warranty_Date: FindData[0].warranty_Date_Format,
      Warranty_Date: FindData[0].warranty_Date_Format == null ? "" : (parseInt(FindData[0].warranty_Date_Format.split('/')[2]) + 543) + '-' + FindData[0].warranty_Date_Format.split('/')[1] + '-' + FindData[0].warranty_Date_Format.split('/')[0],
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
    $("#ShowDataDetail").removeAttr("style").hide();
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      usernames: Cookies.get('username'),
      User_Group: localStorage.getItem("User_Group"),
      menu_name: 'Manage Warranty Registration',
      Permission: "",
      StartDateSearch: '',
      EndDateSearch: '',
      SearchCareArea: null,
      SearchTypeName: null,
      WarrantyID: 0,
      CustomerCode: '',
      CustomerAddress: '',
      CustomerEmail: '',
      CustomerMobile: '',
      CustomerName: '',
      CustomerSurname: '',
      CustomerMobile: '',
      CustomerType: '',
      CustomerZipCode: '',
      Barcode_No: '',
      Receipt_Number: '',
      Store_Other_Name: '',
      Warranty_No: '',
      Product_Code_Other: '',
      Product_QTY: '',
      remark: '',
      Score: '',
      Description: '',
      customer_province_name: '',
      sub_district_Name: '',
      district_Name: '',
      Warranty_Date: '',
      ProductCode: '',
      ProductName: '',
      Quota: '',
      ServiceCenter: '',
      StoreName: '',
      ImagePath: '',
      /////////////////////////
      image: '',
      ResData: [],
      RowID: '',
      loading: true,
      ProvinceData: [],
      //state is by default an object
      warrantydata: [],
      ArrFile: [],
      optionsCustomerProvince: [],
      optionsProvince: [],
      optionsCustomerDistrict: [],
      optionsDistrict: [],
      optionsCustomerSubDistrict: [],
      optionsSubDistrict: [],
      Province: null,
      StoreAll: [],
      optionsStore: [],
      Store: null,
      optionsProductType: [],
      ProductType: null,
      ProductAll: [],
      optionsProduct: [],
      Product: null,
      Page: 1,
      AllPage: 0,
      PerPage: 10,
      Search: "",
      CustomerProvince: '',
      CustomerDistrict: '',
      CustomerSubDistrict: '',
      Previous_Status: "page-item disabled",
      Next_Status: "page-item ",
      columns: [
        {
          label: "ลำดับ",
          field: "no",
          sort: "asc",
          width: 300
        },
        {
          label: 'วันเดือนปีที่ลงทะเบียน',
          field: 'createdate',
          sort: 'asc',
          width: 300
        },
        {
          label: "ชื่อลูกค้า",
          field: "customername",
          sort: "asc",
          width: 300
        },
        {
          label: "นามสกุล",
          field: "customersurname",
          sort: "asc",
          width: 300
        },
        {
          label: 'เบอร์โทรศัพท์*',
          field: 'customer_Tel',
          sort: 'asc',
          width: 300
        },
        {
          label: 'มือถือ*',
          field: 'customer_Mobile',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ที่อยู่ที่ติดตั้งสินค้า* (ไม่สามารถเปลี่ยนแปลงได้)',
          field: 'customeraddress',
          sort: 'asc',
          width: 300
        },
        {
          label: "เขต/อำเภอ*",
          field: "district",
          sort: "asc",
          width: 300
        },
        {
          label: "ตำบล/แขวง*",
          field: "subdistrict",
          sort: "asc",
          width: 300
        },
        {
          label: 'จังหวัด*',
          field: 'province',
          sort: 'asc',
          width: 300
        },
        {
          label: 'รหัสไปรษณีย์',
          field: 'zipcode',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ศูนย์บริการสาขา',
          field: 'servicecenter',
          sort: 'asc',
          width: 300
        },
        {
          label: 'วัน/เดือน/ปี ที่ซื้อ*',
          field: 'purchasedate',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ชื่อร้านตัวแทนจำหน่าย',
          field: 'storename',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ชื่อร้านตัวแทนจำหน่าย(กรณีค้นหาไม่พบ)',
          field: 'store_Other_Name',
          sort: 'asc',
          width: 300
        },
        {
          label: 'หมายเลขใบเสร็จ*',
          field: 'receiptnumber',
          sort: 'asc',
          width: 300
        },
        {
          label: 'หมายเลขรับประกัน/หมายเลขซีเรียลผลิตภัณฑ์',
          field: 'warrantynumber',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ประเภทสินค้า*',
          field: 'typename',
          sort: 'asc',
          width: 300
        },
        {
          label: 'รหัสสินค้า*',
          field: 'productcode',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ชื่อสินค้า',
          field: 'productname',
          sort: 'asc',
          width: 300
        },
        {
          label: 'รหัสสินค้า (กรณีค้นหาไม่พบ)',
          field: 'cantfindproductcode',
          sort: 'asc',
          width: 300
        },
        {
          label: 'จำนวนชิ้นที่ซื้อ',
          field: 'qty',
          sort: 'asc',
          width: 300
        },
        {
          label: 'แผนที่',
          field: 'mapgps',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ภาพใบเสร็จ',
          field: 'image',
          sort: 'asc',
          width: 300
        },
        {
          label: 'สถานะ',
          field: 'status',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ระดับความพึงพอใจต่อสินค้าอเมริกันสแตนดาร์ด',
          field: 'score',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ข้อเสนอแนะ',
          field: 'description',
          sort: 'asc',
          width: 300
        },
        {
          label: 'หมายเหตุ',
          field: 'remark',
          sort: 'asc',
          width: 300
        },
        {
          label: 'แก้ไข',
          field: 'edit',
          sort: 'asc',
          width: 300
        },
        {
          label: 'ลบ',
          field: 'delete',
          sort: 'asc',
          width: 300
        }
      ],
      imagePathPop: ""
    };
    this.handleInputChangeProduct = this.handleInputChangeProduct.bind(this);
    this.handleChangeProduct = this.handleChangeProduct.bind(this);

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

  async GetAllDataWarranty() {
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Warranty/GetAllDataWarranty`)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data });
          this.setState({ warrantydata: response.data.data });
          // console.log(response.data.data);
        }
      })
      .catch(err => console.log(err));
  }

  async GetAllDataWarrantyPerpage(Page, PerPage, Search, StartDate, EndDate, CareAreaData, SearchTypeName) {
    var _this = this;
    _this.setState({ loading: true });
    let temp = {
      Page: Page,
      PerPage: PerPage,
      Search: Search,
      Start: StartDate,
      End: EndDate,
      CareArea: CareAreaData == null ? null : CareAreaData.label,
      SearchTypeName: SearchTypeName == null ? null : SearchTypeName.label
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Warranty/GetAllDataWarrantyPerpage`, temp)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data.result });
          var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
          this.setState({ AllPage: Total });
          var TempData = [];
          var Number = ((this.state.Page - 1) * this.state.PerPage);

          let setpage = Page;
          if (setpage == 1 && this.state.AllPage == 1) {
              this.setState({ Previous_Status: "page-item disabled" });
              this.setState({ Next_Status: "page-item disabled" });
          }
          else if (setpage == 1) {
              this.setState({ Previous_Status: "page-item disabled" });
              this.setState({ Next_Status: "page-item" });
          }
          else if (setpage == this.state.AllPage) {
              this.setState({ Next_Status: "page-item disabled" });
              this.setState({ Previous_Status: "page-item" });
          }
          else {
              this.setState({ Previous_Status: "page-item" });
              this.setState({ Next_Status: "page-item" });
          }
          
          response.data.data.result.map((item, index) => {
            let TempSubData = {
              no: (Number + (index + 1)),
              createdate: item.createdate,
              customername: item.customername,
              customersurname: item.customersurname,
              customer_Tel: item.customer_Tel,
              customer_Mobile: item.customer_Mobile,
              customeraddress: item.customeraddress,
              district: item.district,
              subdistrict: item.subdistrict,
              province: item.province,
              zipcode: item.zipcode,
              servicecenter: item.servicecenter,
              purchasedate: item.purchasedate,
              storename: item.storename,
              store_Other_Name: item.store_Other_Name,
              receiptnumber: item.receiptnumber,
              warrantynumber: item.warrantynumber,
              typename: item.typename,
              productcode: item.productcode,
              productname: item.productname,
              cantfindproductcode: item.cantfindproductcode,
              qty: item.qty,
              mapgps: item.mapgps.length > 0 ? <a href={`https://www.google.co.th/maps/search/` + item.mapgps} target="_blank"> {item.mapgps} </a> : null,
              // image: item.image == null ? "No Image" : item.typeimage == 'image/jpeg' ? 
              //   <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + item.image} onClick={() => window.open(`${APIImagePath}` + item.image) }/> : 
              //   <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.image) }/>,
              image: item.image == null ? "No Image" : item.typeimage == 'image/jpeg' ||  item.typeimage == 'image/png' ? 
                <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + item.image} 
                data-toggle="modal" data-target="#ShowImage" data-backdrop="static"
                onClick={() => this.OpenImagePopup(item.image)}
                // onClick={() => window.open(`${APIImagePath}` + item.image) }
                /> : 
                <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.image) }/>,
              status: item.is_Active === 1 ? "Active" : "InActive",
              // warranty_Date_Format: item.warranty_Date_Format,
              // customer_Code: item.customer_Code,
              // customer_Name: item.customer_Name,
              // customer_Mobile: item.customer_Mobile,
              // customer_Address: item.customer_Address,
              // type_Name: item.type_Name,
              // productCode: item.productCode,
              // store_Name: item.store_Name,
              // province_Name: item.province_Name,
              // serviceCenter: item.serviceCenter,
              // create_Date: item.create_Date,
              score: item.score,
              description: item.description,
              remark: item.remark,
              edit: this.state.Permission === "W" ?
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#ShowDataDetail" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                  <img
                    class="img-manage"
                    src={require("../images/editor.png")}
                    alt="Edit"
                  />
                </button>
                :
                <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#ShowDataDetail" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                  <img
                    class="img-manage"
                    src={require("../images/editor.png")}
                    alt="Edit"
                  />
                </button>,
              delete: this.state.Permission === "W" ?
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static" onClick={() => this.SetIdDeleteWarranty(item.id)}>
                  <img
                    class="img-manage"
                    src={require("../images/DeleteIcon.png")}
                    alt="Edit"
                  />
                </button>
                :
                <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static" onClick={() => this.SetIdDeleteWarranty(item.id)}>
                  <img
                    class="img-manage"
                    src={require("../images/DeleteIcon.png")}
                    alt="Edit"
                  />
                </button>
              // delete: this.state.Permission === "W" ?
              //   <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDeleteWarranty(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
              //     <img
              //       style={{ maxWidth: "40px" }}
              //       src={require("../images/DeleteIcon.png")}
              //       alt=""
              //     />
              //   </button>
              //   : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDeleteWarranty(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
              //     <img
              //       style={{ maxWidth: "40px" }}
              //       src={require("../images/DeleteIcon.png")}
              //       alt=""
              //     />
              //   </button>
            };
            TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ warrantydata: dataTable });
          this.forceUpdate();
          // this.setState({ warrantydata: response.data.data });
          // console.log(response.data.data);
        }
      })
      .catch(err => console.log(err))
      .finally(function () {
        _this.setState({ loading: false });
    });
  }

  ClearSearch() {
    this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchTypeName: null});
    window.location.reload();
  }

  async GetStore() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Master/GetStore`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {

          this.setState({ StoreAll: response.data.data });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  handleChangeStore = Store => {
    this.setState({ Store });
    // console.log(`Option selected:`, Store);
  };

  async GetDataProvince() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Master/GetProvince`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var ProvinceObj = {
              value: index.id,
              label: index.province_Name
            };
            ArrTemp.push(ProvinceObj);
          });
          this.setState({ optionsProvince: ArrTemp });
          this.setState({ optionsCustomerProvince: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  async GetDistrict() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Master/GetDistrict`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var DistrictObj = {
              id: index.id,
              fK_Province_ID: index.fK_Province_ID,
              district_Name: index.district_Name
            };
            ArrTemp.push(DistrictObj);
          });
          this.setState({ optionsDistrict: ArrTemp });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  async GetSubDistrict() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Master/GetSubDistrict`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var SubDistrictObj = {
              id: index.id,
              fK_District_ID: index.fK_District_ID,
              sub_District_Name: index.sub_District_Name,
              zip_Code: index.zip_Code,
            };
            ArrTemp.push(SubDistrictObj);
          });
          this.setState({ optionsSubDistrict: ArrTemp });
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  handleChangeCustomerProvince = event => {
    var ArrTempDistrict = [];
    if (event != null && event != "") {
      if (event.value === undefined) //กรณีเปิด popup bind ค่าจาก api
      {
        var value = {
          label: event.province_Name,
          value: event.id
        };
        this.setState({ CustomerProvince: value });
        this.setState({ CustomerDistrict: null });
        this.setState({ CustomerSubDistrict: null });
        this.setState({ CustomerZipCode: '' });
        var test = this.state.optionsDistrict;
        var TempDistrict = this.state.optionsDistrict.filter(x => x.fK_Province_ID == parseInt(event.id));
        Array.prototype.forEach.call(TempDistrict, function (index) {
          var DistrictObj = {
            value: index.id,
            label: index.district_Name
          };
          ArrTempDistrict.push(DistrictObj);
        });
      }
      else //กรณีเลือกจาก cbb
      {
        this.setState({ CustomerProvince: event });
        this.setState({ CustomerDistrict: null });
        this.setState({ CustomerSubDistrict: null });
        this.setState({ CustomerZipCode: '' });
        var test = this.state.optionsDistrict;
        var TempDistrict = this.state.optionsDistrict.filter(x => x.fK_Province_ID == parseInt(event.value));
        Array.prototype.forEach.call(TempDistrict, function (index) {
          var DistrictObj = {
            value: index.id,
            label: index.district_Name
          };
          ArrTempDistrict.push(DistrictObj);
        });
      }
      this.setState({ optionsCustomerDistrict: ArrTempDistrict });
    }
  }

  handleChangeCustomerDistrict = event => {
    var ArrTempSubDistrict = [];
    if (event != null && event != "") {
      if (event.value === undefined) //กรณีเปิด popup bind ค่าจาก api
      {
        var value = {
          label: event.district_Name,
          value: event.id
        };
        this.setState({ CustomerDistrict: value });
        this.setState({ CustomerSubDistrict: null });
        this.setState({ CustomerZipCode: '' });
        var test = this.state.optionsSubDistrict;
        var TempSubDistrict = this.state.optionsSubDistrict.filter(x => x.fK_District_ID == parseInt(event.id));
        Array.prototype.forEach.call(TempSubDistrict, function (index) {
          var SubDistrictObj = {
            value: index.id,
            label: index.sub_District_Name
          };
          ArrTempSubDistrict.push(SubDistrictObj);
        });
      }
      else //กรณีเลือกจาก cbb
      {
        this.setState({ CustomerDistrict: event });
        this.setState({ CustomerSubDistrict: null });
        this.setState({ CustomerZipCode: '' });
        var test = this.state.optionsSubDistrict;
        var TempSubDistrict = this.state.optionsSubDistrict.filter(x => x.fK_District_ID == parseInt(event.value));
        Array.prototype.forEach.call(TempSubDistrict, function (index) {
          var SubDistrictObj = {
            value: index.id,
            label: index.sub_District_Name
          };
          ArrTempSubDistrict.push(SubDistrictObj);
        });
      }
      this.setState({ optionsCustomerSubDistrict: ArrTempSubDistrict });
    }
  }

  handleChangeCustomerSubDistrict = event => {
    var SubDistrictObj = '';
    if (event != null && event != "") {
      if (event.value === undefined) //กรณีเปิด popup bind ค่าจาก api
      {
        var value = {
          label: event.sub_District_Name,
          value: event.id
        };
        this.setState({ CustomerSubDistrict: value });
        // var test = this.state.optionsSubDistrict;
        var test = this.state.optionsSubDistrict;
        var TempSubDistrict = this.state.optionsSubDistrict.filter(x => x.id == parseInt(event.id));
        Array.prototype.forEach.call(TempSubDistrict, function (index) {
          SubDistrictObj = index.zip_Code;
        });
      }
      else //กรณีเลือกจาก cbb
      {
        this.setState({ CustomerSubDistrict: event });
        var test = this.state.optionsSubDistrict;
        var TempSubDistrict = this.state.optionsSubDistrict.filter(x => x.id == parseInt(event.value));
        Array.prototype.forEach.call(TempSubDistrict, function (index) {
          SubDistrictObj = index.zip_Code;
        });
      }
      this.setState({ CustomerZipCode: SubDistrictObj });
    }
  }

  handleChange = Province => {
    this.setState({ Province });
    if (Province != null && Province != "") {
      var tempStore = this.state.StoreAll.filter(x => x.fK_Province_ID == parseInt(Province.value));
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
    // console.log(`Option selected:`, Province);
  };

  async GetProductType() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Product/GetAllProductType`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          var ArrTemp2 = [];
          var ProductTypeObj2 = {
            value: null,
            label: "---ทั้งหมด---"
          };
          ArrTemp2.push(ProductTypeObj2);
          Array.prototype.forEach.call(response.data.data, function (index) {
            var ProductTypeObj = {
              value: index.id,
              label: index.type_Name
            };
            ArrTemp.push(ProductTypeObj);
            ArrTemp2.push(ProductTypeObj);
          });
          this.setState({ optionsProductType: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  handleChangeProductType = ProductType => {
    this.setState({ ProductType });
    // console.log(`Option selected:`, ProductType);
  };

  async GetProduct() {
    const Tempdata = {
      Lang_ID: 1
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Product/GetAllProduct`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ ProductAll: response.data.data });
          var ArrTemp = [];
          let i = 0;
          Array.prototype.forEach.call(response.data.data, function (index) {
            if (i < 100) {
              var ProductObj = {
                value: index.id,
                label: index.product_Name
              };
              ArrTemp.push(ProductObj);
              i++;
            }
          });
          this.setState({ optionsProduct: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => console.log(err));
  }

  handleChangeProduct = Product => {
    this.setState({ Product });
    var tempProduct = this.state.ProductAll.filter(x => x.id == Product.value);
    this.setState({ ProductCode: tempProduct[0].product_Code });
    // console.log(`Option selected:`, Product);
  };

  handleInputChangeProduct = input => {
    var tempProduct = this.state.ProductAll.filter(x => x.product_Name.includes(input));
    var ArrTemp = [];
    let i = 0;
    Array.prototype.forEach.call(tempProduct, function (index) {
      if (i < 100) {
        var ProductObj = {
          value: index.id,
          label: index.product_Name
        };
        ArrTemp.push(ProductObj);
        i++;
      }
    });
    this.setState({ optionsProduct: ArrTemp });
    // console.log(`Input:`, input);
  };

  setStateCustomerName = event => {
    this.setState({ CustomerName: event.target.value });
  }
  setStateCustomerSurname = event => {
    this.setState({ CustomerSurname: event.target.value });
  }
  setStateCustomerTel = event => {
    this.setState({ CustomerTel: event.target.value });
  }
  setStateCustomerMobile = event => {
    this.setState({ CustomerMobile: event.target.value });
  }
  setStateCustomerEmail = event => {
    this.setState({ CustomerEmail: event.target.value });
  }
  setStateCustomerAddress = event => {
    this.setState({ CustomerAddress: event.target.value });
  }
  setStateCustomerZipCode = event => {
    this.setState({ CustomerZipCode: event.target.value });
  }
  setStateProductCode = event => {
    this.setState({ ProductCode: event.target.value });
  }
  setStateRecieptNumber = event => {
    this.setState({ Receipt_Number: event.target.value });
  }
  setStateStoreOtherName = event => {
    this.setState({ Store_Other_Name: event.target.value });
  }
  setStateWarrantyNo = event => {
    this.setState({ Warranty_No: event.target.value });
  }
  setStateProductCodeOther = event => {
    this.setState({ Product_Code_Other: event.target.value });
  }
  setStateProductQTY = event => {
    this.setState({ Product_QTY: event.target.value });
  }
  setStateRemark = event => {
    this.setState({ remark: event.target.value });
  }
  setStateScore = event => {
    this.setState({ Score: event.target.value });
  }
  setStateDescription = event => {
    this.setState({ Description: event.target.value });
  }
  setStateWarrantyDate = event => {
    this.setState({ Warranty_Date: event.target.value });
  }
  setStateBarcodeNo = event => {
    this.setState({ Barcode_No: event.target.value });
  }
  setStateProductName = event => {
    this.setState({ ProductName: event.target.value });
  }

  setStateStartDateSearch = event => {
    this.setState({ StartDateSearch: event.target.value });
  }

  setStateEndDateSearch = event => {
    this.setState({ EndDateSearch: event.target.value });
  }

  SetIdDeleteWarranty(id) {
    this.setState({ WarrantyID: id });
  }

  ChangeSearchFilter = event => {
    this.setState({ SearchCareArea: event });
  };

  ChangeSearchTypeFilter = event => {
    this.setState({ SearchTypeName: event });
  };

  DeleteDataWarranty(val) {
    var temp = {
      ID: val
    };
    axios.post(`${APIUrl}Warranty/DeleteDataWarranty`, temp)
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

  async GetDataCareCenter() {
    await axios
      .post(`${APIUrl}Customer/GetDataCareCenter`)
      .then(response => {
        if (response.data.status == 0) {
          var Temp = [];
          var firstdata = {
            value: null,
            label: 'ทั้งหมด'
          };
          Temp.push(firstdata);
          Array.prototype.forEach.call(response.data.data, function (index) {
            var data = {
              value: index.id,
              label: index.code
            };
            Temp.push(data);
          });
          this.setState({ ListDataCareCenter: Temp });
          this.forceUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async ExportExcel(Search, StartDate, EndDate, CareAreaData,SearchTypeName) {
    var _this = this;
    _this.setState({ loading: true });
    let temp = {
      Search: Search,
      Start: StartDate,
      End: EndDate,
      CareArea: CareAreaData == null ? null : CareAreaData.label,
      SearchTypeName: SearchTypeName == null ? null : SearchTypeName.label
    };
    await axios.post(`${APIUrl}Warranty/ExportExcel`, temp,
      {
        responseType: 'blob',
      }).then(response => {
        if (response.data != null) {
          const url = URL.createObjectURL(new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          }))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataWarranty.xlsx")
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

  async GetAllWarrantySearch(Page, PerPage, Search, StartDate, EndDate, CareAreaData,SearchTypeName) {
    let temp = {
      Page: Page,
      PerPage: PerPage,
      Search: Search,
      Start: StartDate,
      End: EndDate,
      CareArea: CareAreaData == null ? null : CareAreaData.label,
      SearchTypeName: SearchTypeName == null ? null : SearchTypeName.label
    };
    await axios
      // .post(`http://www.mostactive.info/API/api/Warranty/GetAllDataWarranty`)
      .post(`${APIUrl}Warranty/GetAllWarrantySearch`, temp)
      .then(response => {
        if (response.data.status == 0) {
          this.setState({ loading: false, ResData: response.data.data.result });
          var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
          this.setState({ AllPage: Total });
          var TempData = [];
          var Number = ((this.state.Page - 1) * this.state.PerPage);
          response.data.data.result.map((item, index) => {
            let TempSubData = {
              no: (Number + (index + 1)),
              warranty_Date_Format: item.warranty_Date_Format,
              customer_Code: item.customer_Code,
              customer_Name: item.customer_Name,
              customer_Mobile: item.customer_Mobile,
              customer_Address: item.customer_Address,
              type_Name: item.type_Name,
              productCode: item.productCode,
              store_Name: item.store_Name,
              province_Name: item.province_Name,
              serviceCenter: item.serviceCenter,
              edit:
                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#ShowDataDetail" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                  <img
                    class="img-manage"
                    src={require("../images/editor.png")}
                    alt="Edit"
                  />
                </button>
            };
            TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ warrantydata: dataTable });
          this.forceUpdate();
          // this.setState({ warrantydata: response.data.data });
          // console.log(response.data.data);
        }
      })
      .catch(err => console.log(err));
  }

  ChangeSort() {
    // console.log(this.state.GetAllDataWarrantyPerpage);
  };

  EnterSearch = event => {
    if (event.key === 'Enter') {
      this.setState({ Page: 1 });
      this.GetAllDataWarrantyPerpage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    }
  };

  ChangeSearch = event => {
    this.setState({ Search: event.target.value });
  };

  ChangePerPage = event => {
    this.setState({ PerPage: event.target.value });
    this.GetAllDataWarrantyPerpage(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
  };

  onPaginationNext() {
    let page = this.state.Page + 1;
    if (page == 1) {
      this.setState({ Previous_Status: "page-item disabled" });
      this.setState({ Next_Status: "page-item" });
    }
    else if (page == this.state.AllPage) {
      this.setState({ Next_Status: "page-item disabled" });
      this.setState({ Previous_Status: "page-item" });
    }
    else {
      this.setState({ Previous_Status: "page-item" });
      this.setState({ Next_Status: "page-item" });
    }
    this.setState({ Page: page });
    this.GetAllDataWarrantyPerpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    this.forceUpdate();
  };

  onPaginationNumber(page) {
    if (page == 1) {
      this.setState({ Previous_Status: "page-item disabled" });
      this.setState({ Next_Status: "page-item" });
    }
    else if (page == this.state.AllPage) {
      this.setState({ Next_Status: "page-item disabled" });
      this.setState({ Previous_Status: "page-item" });
    }
    else {
      this.setState({ Previous_Status: "page-item" });
      this.setState({ Next_Status: "page-item" });
    }
    this.setState({ Page: page });
    this.GetAllDataWarrantyPerpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    this.forceUpdate();
  };

  onPaginationPrevious() {
    let page = this.state.Page - 1;
    if (page == 1) {
      this.setState({ Previous_Status: "page-item disabled" });
      this.setState({ Next_Status: "page-item" });
    }
    else if (page == this.state.AllPage) {
      this.setState({ Next_Status: "page-item disabled" });
      this.setState({ Previous_Status: "page-item" });
    }
    else {
      this.setState({ Previous_Status: "page-item" });
      this.setState({ Next_Status: "page-item" });
    }
    this.setState({ Page: page });
    this.GetAllDataWarrantyPerpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName);
    this.forceUpdate();
  };

  renderPagination() {
    let page = []
    // console.log(this.state.AllPage);
    // let div_page = 10;
    // if(this.state.AllPage <= 200)
    // {
    //     div_page = 20;
    // }
    // else if(this.state.AllPage <= 300)
    // {
    //     div_page = 30;
    // }
    // else if(this.state.AllPage <= 400)
    // {
    //     div_page = 40;
    // }
    // else if(this.state.AllPage <= 500)
    // {
    //     div_page = 50;
    // }
    for (let i = 0; i < this.state.AllPage; i++) {
      if (this.state.AllPage < 10) {
        if (this.state.Page == (i + 1)) {
          page.push(
            <li class="page-item active" aria-current="page">
              <a class="page-link" >{i + 1}<span class="visually-hidden"></span></a>
            </li>
          )
        }
        else {
          page.push(
            <li class="page-item">
              <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
            </li>
          )
        }
      }
      else {
        if (this.state.Page == (i + 1)) {
          page.push(
            <li class="page-item active" aria-current="page">
              <a class="page-link" >{i + 1}<span class="visually-hidden"></span></a>
            </li>
          )
        }
        else if (this.state.Page == (i + 2) || this.state.Page == (i + 3)) {
          if (this.state.Page == (i + 3) && i > 0) {
            page.push(
              <li class="page-item">
                <a class="page-link">...</a>
              </li>
            )
          }
          page.push(
            <li class="page-item">
              <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
            </li>
          )
        }
        else if (this.state.Page == i || this.state.Page == (i - 1)) {
          page.push(
            <li class="page-item">
              <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
            </li>
          )
          if (this.state.Page == (i - 1) && (i + 1) < this.state.AllPage) {
            page.push(
              <li class="page-item">
                <a class="page-link">...</a>
              </li>
            )
          }
        }
        else if ((i + 1) == 1) {
          page.push(
            <li class="page-item">
              <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
            </li>
          )
        }
        else if ((i + 1) == this.state.AllPage) {
          page.push(
            <li class="page-item">
              <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
            </li>
          )
        }
        // else if ((i + 1) % div_page == 0) 
        // {
        //     // console.log(((i + 1) / div_page) + "||" + (i + 1));
        //     // if((i + 1) == ((i + 1) / div_page))
        //     // {
        //     //     page.push(
        //     //         <li class="page-item">
        //     //             <a class="page-link">...</a>
        //     //         </li>
        //     //     )
        //     // }
        //     page.push(
        //         <li class="page-item">
        //             <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
        //         </li>
        //     )
        //     page.push(
        //         <li class="page-item">
        //             <a class="page-link">...</a>
        //         </li>
        //     )
        // }
        // else if ((i + 1) == 1 || (i + 1) == this.state.AllPage) 
        // {
        //     // if((i + 1) == this.state.AllPage)
        //     // {
        //     //     page.push(
        //     //         <li class="page-item">
        //     //             <a class="page-link">...</a>
        //     //         </li>
        //     //     )
        //     // }
        //     page.push(
        //         <li class="page-item">
        //             <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
        //         </li>
        //     )
        //     if((i + 1) == 1)
        //     {
        //         page.push(
        //             <li class="page-item">
        //                 <a class="page-link">...</a>
        //             </li>
        //         )
        //     }
        // }
      }
    }
    return page;
  };

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

  
  OpenImagePopup(imagePathPop) {
    this.setState({ imagePathPop: imagePathPop });
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
              <div class="page-header-content pt-4">
                <div class="row align-items-center justify-content-between">
                  <div class="col-auto mt-4">
                    <h1 class="page-header-title">
                      <div class="page-header-icon"><Activity /></div>
                      Manage Warranty Registration
                    </h1>
                    <div class="page-header-subtitle">จัดการข้อมูลการรับประกัน</div>
                  </div>
                </div>
              </div>
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
                              &nbsp;
                            </div>
                            <div className="col-md-6">
                              <div class="float-right">
                                {this.state.Permission === "W" ?
                                  <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }} onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName)}><Download />&nbsp; Export Excel</button> :
                                  <button class="btn btn-outline-info" disabled type="button" style={{ width: '100%' }}><Download />&nbsp; Export Excel</button>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <MDBCardBody>
                          <div className="row">
                            <div className="form-group col-md-4">
                            </div>
                            <div className="form-group col-md-2" >
                              <label className="small mb-1">ศูนย์บริการ</label>
                              <Select
                                styles={customStyles}
                                value={this.state.SearchCareArea}
                                onChange={this.ChangeSearchFilter}
                                options={this.state.ListDataCareCenter}
                              />
                            </div>
                            <div className="form-group col-md-2" >
                              <label className="small mb-1">ประเภทสินค้า</label>
                              <Select
                                styles={customStyles}
                                value={this.state.SearchTypeName}
                                onChange={this.ChangeSearchTypeFilter}
                                options={this.state.optionsProductType}
                              />
                            </div>
                          </div>

                          <div className="row" style={{ paddingTop: '30px' }}>
                            <div className="form-group col-md-1">
                              <select className="custom-select custom-select-sm form-control form-control-sm"
                                value={this.state.PerPage}
                                onChange={this.ChangePerPage}
                              >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                              </select>
                            </div>
                            <div className="form-group col-md-3 ">
                            </div>
                            <div className="form-group col-md-2" style={{ marginTop: '-2rem' }}>
                              <label className="small mb-1">วันเดือนปีที่ลงทะเบียน</label>
                              <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                            </div>
                            <div className="form-group col-md-2" style={{ marginTop: '-0.3rem' }}>
                              <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                            </div>
                            <div className="form-group col-md-2" style={{ marginTop: '-10px' }}>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Search"
                                aria-label="Search"
                                value={this.state.Search}
                                onChange={this.ChangeSearch}
                                onKeyPress={this.EnterSearch}
                              />
                            </div>
                            
                            <div className="col-md-2" style={{ marginTop: '-10px' }}>
                                <div className="row">
                                    <div className="col-md-5">
                                      <button className="btn btn-success" onClick={() => this.GetAllDataWarrantyPerpage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchTypeName)}>ค้นหา</button>&nbsp;
                                    </div>
                                    <div className="col-md-5">
                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="form-group col-md-1">
                            <button class="btn btn-block btn-success" type="button" style={{ width: '100%' }} >Export Excel</button>
                          </div> */}
                          </div>
                          <MDBTable responsive hover>
                            <MDBTableHead columns={this.state.warrantydata.columns} />
                            <MDBTableBody rows={this.state.warrantydata.rows} />
                          </MDBTable>
                          <nav aria-label="...">
                            <ul class="pagination">
                              <li className={this.state.Previous_Status}>
                                <a class="page-link" onClick={() => this.onPaginationPrevious()} >Previous</a>
                              </li>
                              {this.renderPagination()}
                              <li className={this.state.Next_Status}>
                                <a class="page-link" onClick={() => this.onPaginationNext()}>Next</a>
                              </li>
                            </ul>
                          </nav>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>

                <div className="modal" id="ShowPic" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" onClick={() => this.CloseModal()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                          <div class="carousel-inner">
                            {this.renderShowFile()}
                          </div>
                          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                          </a>
                          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="modal" id="ShowDataDetail" role="dialog" aria-hidden="true">
                  <div className="editmodal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" onClick={() => this.CloseEditModal()} data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={this.UpdateWarranty} class="responsefrm" >
                          <h4>Customer Part</h4>
                          {/* <h4>Customer Part *ReadOnly</h4> */}
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Code</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerCode} disabled />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Type</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerType} disabled />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Name</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerName} onChange={this.setStateCustomerName} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Surname</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerSurname} onChange={this.setStateCustomerSurname} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Tel</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerTel} onChange={this.setStateCustomerTel} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Mobile</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerMobile} onChange={this.setStateCustomerMobile} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Customer Email</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerEmail} onChange={this.setStateCustomerEmail} />
                            </div>
                          </div>
                          <hr></hr>
                          {/* <h4>Installation Address *ReadOnly</h4> */}
                          <h4>Installation Address</h4>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="small mb-1">Address</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerAddress} onChange={this.setStateCustomerAddress} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Province</label>
                              <Select
                                value={this.state.CustomerProvince}
                                onChange={this.handleChangeCustomerProvince}
                                options={this.state.optionsCustomerProvince}
                              />
                              {/* <input className="form-control py-1" type="text" value={this.state.customer_province_name}/> */}
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">District</label>
                              <Select
                                value={this.state.CustomerDistrict}
                                onChange={this.handleChangeCustomerDistrict}
                                options={this.state.optionsCustomerDistrict}
                              />
                              {/* <input className="form-control py-1" type="text" value={this.state.district_Name}  /> */}
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Sub District</label>
                              <Select
                                value={this.state.CustomerSubDistrict}
                                onChange={this.handleChangeCustomerSubDistrict}
                                options={this.state.optionsCustomerSubDistrict}
                              />
                              {/* <input className="form-control py-1" type="text" value={this.state.sub_district_Name} /> */}
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">ZipCode</label>
                              <input className="form-control py-1" type="text" value={this.state.CustomerZipCode} onChange={this.setStateCustomerZipCode} />
                            </div>
                          </div>
                          <hr></hr>
                          <h4>Product Detail</h4>
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Purchase Province</label>
                              <Select
                                value={this.state.Province}
                                onChange={this.handleChange}
                                options={this.state.optionsProvince}
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Warranty Date</label>
                              <input className="form-control py-1" type="date" value={this.state.Warranty_Date} placeholder="dd/mm/yyyy" onChange={this.setStateWarrantyDate} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">StoreName</label>
                              <Select
                                value={this.state.Store}
                                onChange={this.handleChangeStore}
                                options={this.state.optionsStore}
                              />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Store Other Name</label>
                              <input className="form-control py-1" type="text" value={this.state.Store_Other_Name} onChange={this.setStateStoreOtherName} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Reciept Number</label>
                              <input className="form-control py-1" type="text" value={this.state.Receipt_Number} onChange={this.setStateRecieptNumber} />
                            </div>
                            <div className="form-group col-md-6">

                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="small mb-1">BarCode No</label>
                              <input className="form-control py-1" type="text" value={this.state.Barcode_No} onChange={this.setStateBarcodeNo} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Warranty No</label>
                              <input className="form-control py-1" type="text" value={this.state.Warranty_No} onChange={this.setStateWarrantyNo} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Product Code</label>
                              <input className="form-control py-1" type="text" value={this.state.ProductCode} onChange={this.setStateProductCode} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Product Name</label>
                              <Select
                                value={this.state.Product}
                                onChange={this.handleChangeProduct}
                                onInputChange={this.handleInputChangeProduct}
                                options={this.state.optionsProduct}
                              />
                              {/* <input className="form-control py-1" type="text" value={this.state.ProductName}  onChange={this.setStateProductName}/> */}
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Product TypeName</label>
                              <Select
                                value={this.state.ProductType}
                                onChange={this.handleChangeProductType}
                                options={this.state.optionsProductType}
                              />
                              {/* <input className="form-control py-1" type="text" value={this.state.ProductTypeName}/> */}
                            </div>
                            <div className="form-group col-md-6">

                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Product Code Other</label>
                              <input className="form-control py-1" type="text" value={this.state.Product_Code_Other} onChange={this.setStateProductCodeOther} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Product QTY</label>
                              <input className="form-control py-1" type="number" value={this.state.Product_QTY} onChange={this.setStateProductQTY} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Score</label>
                              <input className="form-control py-1" type="number" value={this.state.Score} onChange={this.setStateScore} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Description</label>
                              <input className="form-control py-1" type="text" value={this.state.Description} onChange={this.setStateDescription} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="small mb-1">Image</label>
                              <br></br>
                              <input type="file" onChange={this.onFileChange} multiple="multiple" />
                              {/* <input className="form-control py-1" type="text" value={this.state.ImagePath}/> */}
                              {/* <input type="file"/> */}
                            </div>
                            <div className="form-group col-md-12">
                              <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                <thead>
                                  <tr>
                                    <th>รูปตัวอย่าง</th>
                                    <th>ชื่อ</th>
                                    <th>ลบ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* {this.state.ArrFile.map((person, index) => (
                                        <p>Hello, {person.name} from {person.name}!</p>
                                    ))} */}
                                  {this.renderTableFile()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-10">
                              <label className="small mb-1">หมายเหตุ</label>
                              <input className="form-control py-1" value={this.state.remark} onChange={this.setStateRemark} />
                            </div>
                            <div className="form-group col-md-2">
                              <input type="submit" value="Update" className="btn btn-success" style={{marginTop:"24px"}} />
                            </div>
                          </div>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal" id="ShowImage" role="dialog" aria-hidden="true">
                  <div className="editmodal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4>ภาพใบเสร็จ</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div className="modal-body">
                          {/* <h4>Customer Part *ReadOnly</h4> */}
                          <div className="row">
                            <div className="form-group col-md-12">
                              <img class="popimg" style={{cursor: 'pointer'}} src={`${APIImagePath}` + this.state.imagePathPop} 
                                onClick={() => window.open(`${APIImagePath}` + this.state.imagePathPop) }
                                />
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <div className="modal" id="ConfirmDeletePopup" role="dialog" aria-hidden="true">
              <div className="AddModal-dialog">
                <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                  <div className="modal-header">
                    <h3 style={{ fontSize: '25px' }}>ยืนยันการลบใช่หรือไม่ ?</h3>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div className="modal-body">
                    <div className="row col-md-12">
                      <div className="form-group col-md-6">
                        <button type="button" className="btn btn-success" style={{ marginLeft: '300px' }} onClick={() => this.DeleteDataWarranty(this.state.WarrantyID)}>ตกลง</button>
                        &nbsp;&nbsp;

                      </div>
                      <div className="form-group col-md-6">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          {/* <ReactTable data={this.state.ResData} columns={columns} > */}
          {/* </ReactTable> */}
          <style>{"\
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
export default WarrantyList;
