import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import ReactTable from "react-table";
import { Activity, Download, Search } from 'react-feather';
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import LoadingOverlay from "react-loading-overlay";
import Select from 'react-select';
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
import Cookies from "js-cookie";
import moment from 'moment';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;
class Customer extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetAllDataCustomer();
        await this.GetDataCareCenter();
        await this.GetDataCustomerAllPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
        await this.GetDataProvince();
        await this.GetDataDistrict();
        await this.GetDataSubDistrict();
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Membership',
            Permission: "",
            CustomerData: [],
            LangID: 1,
            CustomerID: null,
            CustomerCode: null,
            CustomerFirstName: null,
            CustomerLastName: null,
            CustomerTel: null,
            CustomerPhone: null,
            CustomerEmail: null,
            CustomerAddress: null,
            CustomerZIPCode: null,
            CustomerCompany: null,
            CustomerProvince: null,
            CustomerDistrict: null,
            CustomerSubDistrict: null,
            CustomerType: null,
            CustomerServiceCenter: null,
            CustomerQuotaService: null,
            CustomerStatus: null,
            optionsProvince: [],
            optionsDistrict: [],
            optionsSubDistrict: [],
            AllDistrict: [],
            AllSubDistrict: [],
            ArrFile: [],
            ListDataCustomer: [],
            img_slip: null,
            chkpdf: "",
            Page: 1,
            AllPage: 0,
            PerPage: 10,
            Search: "",
            StartDateSearch: '',
            EndDateSearch: '',
            Previous_Status: "page-item disabled",
            Next_Status: "page-item",
            SearchCareArea: null,
            SearchCustomerType: null,
            ListDataCareCenter: [],
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "วัน/เดือน/ปี ที่สมัคร",
                    field: "createdate",
                    sort: "asc"
                },
                {
                    label: 'ประเภทสมาชิก',
                    field: 'customer_type',
                    sort: 'asc'
                },
                {
                    label: "รหัสลูกค้า",
                    field: "customercode",
                    sort: "asc"
                },
                {
                    label: "จำนวนครั้งการบริการที่เหลือ/ระยะเวลาที่เหลือก่อนหมดอายุสมาชิก*",
                    field: "quotaservice",
                    sort: "asc"
                },
                {
                    label: "ชื่อที่จะระบุสมาชิกหรือผู้ติดต่อ (กรณีบุคคล)",
                    field: "customername",
                    sort: "asc"
                },
                {
                    label: "ชื่อที่จะระบุสมาชิก (กรณี บริษัท, โรงแรม, สำนักงาน, ฯลฯ)",
                    field: "companyname",
                    sort: "asc"
                },
                {
                    label: "มือถือ*",
                    field: "mobile",
                    sort: "asc"
                },
                {
                    label: "ที่อยู่ที่ติดตั้งสินค้า* (ไม่สามารถเปลี่ยนแปลงได้)",
                    field: "customeraddress",
                    sort: "asc"
                },
                {
                    label: 'เขต/อำเภอ*',
                    field: 'district',
                    sort: 'asc'
                },
                {
                    label: 'ตำบล/แขวง*',
                    field: 'subdistrict',
                    sort: 'asc'
                },
                {
                    label: 'จังหวัด*',
                    field: 'province',
                    sort: 'asc'
                },
                {
                    label: 'รหัสไปรษณีย์*',
                    field: 'zipcode',
                    sort: 'asc'
                },
                {
                    label: 'ศูนย์บริการสาขา',
                    field: 'servicecenter',
                    sort: 'asc'
                },
                {
                    label: 'แผนที่',
                    field: 'mapgps',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'ประวัติการบริการ',
                    field: 'servicehistory',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'ประวัติการต่ออายุ',
                    field: 'renewhistory',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'สถานะ',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'ภาพใบเสร็จ',
                    field: 'is_image',
                    sort: 'asc'
                },
                {
                    label: 'ต่ออายุสมาชิก',
                    field: 'renew',
                    sort: 'asc'
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc'
                },
                {
                    label: 'ลบ',
                    field: 'delete',
                    sort: 'asc'
                }
            ],
            ServiceHistoryData: [],
            RenewHistoryData: [],
            ListServiceHistoryData: [],
            ListRenewHistoryData: [],
            ServiceHistoryColumns: [
                {
                    label: "ตัดสมาชิกครั้งที่",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "วัน/เดือน/ปี ที่บริการ",
                    field: "servicedate",
                    sort: "asc"
                },
                {
                    label: 'ใบบริการ/ใบเสร็จหมายเลข',
                    field: 'servicenumber',
                    sort: 'asc'
                },
                {
                    label: "เจ้าหน้าที่บริการ",
                    field: "servicestaff",
                    sort: "asc"
                },
                {
                    label: "สรุปการให้บริการ*",
                    field: "servicesummary",
                    sort: "asc"
                },
                {
                    label: "ภาพหลักฐานใบบริการ",
                    field: "image",
                    sort: "asc"
                },
                {
                    label: "ภาพใบเสร็จ",
                    field: "receiptimage",
                    sort: "asc"
                }
            ],
            RenewHistoryColumns: [
                {
                    label: "ต่ออายุสมาชิกครั้งที่",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "วัน/เดือน/ปี ที่บริการ",
                    field: "renewdate",
                    sort: "asc"
                },
                {
                    label: "เจ้าหน้าที่บริการ",
                    field: "employeename",
                    sort: "asc"
                },
                {
                    label: "ภาพหลักฐานใบบริการ/ใบเสร็จ",
                    field: "receiptimage",
                    sort: "asc"
                }
            ],
            Username: '',
            Password: '',
            CustomerTypeStatus: [
                { value: -1, label: "ทั้งหมด" },
                { value: 1, label: "สมาชิกโครงการ" },
                { value: 2, label: "สมาชิกผู้รับเหมารายย่อย" },
                { value: 3, label: "สมาชิกบ้านพักอาศัย" },
            ],
        };
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

    async GetAllDataCustomer() {
        await axios.post(`${APIUrl}Customer/GetDataCustomerAll`)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ CustomerData: response.data.data });
                    // console.log(response.data.data);
                }
            })
            .catch(err => console.log(err));
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchCustomerType: null });
        window.location.reload();
    }

    async GetDataCustomerAllPerPage(Page, PerPage, Search, StartDate, EndDate, CareAreaData, CustomerTypeData) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
            CustomerType: CustomerTypeData == null ? null : CustomerTypeData.value,
            // CustomerType: CustomerTypeData == null ? null : parseInt(CustomerTypeData)
        };
        // console.log("GetDataCustomerMemberAllPerPage");
        await axios.post(`${APIUrl}Customer/GetDataCustomerMemberAllPerPage`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ CustomerData: response.data.data });
                    // console.log(response.data.data);
                    let all_page = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: all_page });

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
                    let TempData = [];
                    let no_ran = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            // id: item.id,
                            no: (no_ran + (index + 1)),
                            createdate: item.createdate,
                            customertype: item.customertype == 1 ? "ลูกค้าโครงการ" : item.customertype == 2 ? "ลูกค้าผู้รับเหมารายย่อย" : "ลูกค้าบ้านพักอาศัย",
                            customercode: item.customercode,
                            quotaservice: item.quotaservice,
                            customername: item.customername,
                            companyname: item.companyname,
                            mobile: item.mobile,
                            customeraddress: item.customeraddress,
                            district: item.district,
                            subdistrict: item.subdistrict,
                            province: item.province,
                            zipcode: item.zipcode,
                            servicecenter: item.servicecenter,
                            mapgps: item.mapgps,
                            servicehistory: <img style={{ maxWidth: "20px" }} src={require("../images/view.png")} onClick={() => this.GetSeviceHistory(item.id)} data-toggle="modal" data-target="#ServiceHistory" data-backdrop="static" />,
                            renewhistory: <img style={{ maxWidth: "20px" }} src={require("../images/view.png")} onClick={() => this.GetRenewHistory(item.id)} data-toggle="modal" data-target="#RenewHistory" data-backdrop="static" />,
                            status: item.is_Active === 1 ? "Active" : "InActive",
                            is_image: this.state.Permission === "W" ?
                                <button style={{ marginLeft: '17%' }} disabled={!item.is_Image} className={item.is_Image == true ? "btn btn-info" : "btn btn-secondary"} onClick={() => this.GetImageSlip(item.id)} data-toggle="modal" data-target="#ShowSlip" data-backdrop="static" >คลิก</button>
                                :
                                <button style={{ marginLeft: '17%' }} disabled={true} className={item.is_Image == true ? "btn btn-info" : "btn btn-secondary"}>คลิก</button>,
                            renew: this.state.Permission === "W" ?
                                item.customertype != 2 ?
                                    (item.quota_Service == "" || item.quota_Service < 1) ?
                                        <button style={{ marginLeft: '17%' }} className={"btn btn-warning"} onClick={() => this.AddRenew(item)}>ต่ออายุ</button> : "" : ""
                                :
                                item.customertype == 2 ?
                                    (item.quota_Date == "" || item.quota_Date == "หมดอายุ") ?
                                        <button style={{ marginLeft: '17%' }} className={"btn btn-warning"} onClick={() => this.AddRenew(item)}>ต่ออายุ</button> : "" : "",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetCustomerById(item.id)} data-toggle="modal" data-target="#EditCustomerPopup" data-backdrop="static">
                                    <img
                                        style={{ maxWidth: "20px" }}
                                        src={require("../images/editor.png")}
                                        alt=""
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetCustomerById(item.id)} data-toggle="modal" data-target="#EditCustomerPopup" data-backdrop="static">
                                    <img
                                        style={{ maxWidth: "20px" }}
                                        src={require("../images/editor.png")}
                                        alt=""
                                    />
                                </button>,
                            delete: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteCustomer(item.id)}>
                                    <img
                                        style={{ maxWidth: "20px" }}
                                        src={require("../images/DeleteIcon.png")}
                                        alt=""
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteCustomer(item.id)}>
                                    <img
                                        style={{ maxWidth: "20px" }}
                                        src={require("../images/DeleteIcon.png")}
                                        alt=""
                                    />
                                </button>
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.columns
                    };
                    this.setState({ ListDataCustomer: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err))
            .finally(function () {
                _this.setState({ loading: false });
            });
    }

    async ExportExcel(Search, StartDate, EndDate, CareAreaData, CustomerTypeData) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
            CustomerType: CustomerTypeData == null ? null : CustomerTypeData.value,
        };
        await axios.post(`${APIUrl}Customer/MemberShipExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataMembership.xlsx")
                    document.body.appendChild(link)
                    link.click()
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function () {
                _this.setState({ loading: false });
            });
    }

    async GetCustomerById(val) {
        this.setState({
            Username: '',
            Password: '',
        });
        var temp = {
            ID: val
        };
        await axios.post(`${APIUrl}Customer/GetDataCustomerById`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    var cus = response.data.data;
                    var Province = this.state.optionsProvince.filter(x => x.value == parseInt(cus.fK_Province_ID));
                    var District = this.state.AllDistrict.filter(x => x.id == parseInt(cus.fK_District_ID));
                    var SubDistrict = this.state.AllSubDistrict.filter(x => x.id == parseInt(cus.fK_Sub_District_ID));
                    // console.log(this.state.optionsProvince);
                    // console.log(this.state.AllDistrict);
                    // console.log(this.state.AllSubDistricts);
                    this.setState({
                        CustomerID: cus.id,
                        CustomerCode: cus.customer_Code,
                        CustomerFirstName: cus.customer_Name,
                        CustomerLastName: cus.customer_Surname,
                        CustomerTel: cus.customer_Tel,
                        CustomerPhone: cus.customer_Phone,
                        CustomerEmail: cus.customer_Email,
                        CustomerAddress: cus.customer_Address,
                        CustomerZIPCode: cus.customer_ZIP_Code,
                        CustomerCompany: cus.customer_Company,
                        CustomerProvince: Province.length > 0 ? {
                            value: Province[0].value,
                            label: Province[0].label
                        } : null,
                        CustomerDistrict: District.length > 0 ? {
                            value: District[0].id,
                            label: District[0].district_Name
                        } : null,
                        CustomerSubDistrict: SubDistrict.length > 0 ? {
                            value: SubDistrict[0].id,
                            label: SubDistrict[0].sub_District_Name
                        } : null,
                        CustomerType: cus.customer_Type == 1 ? "ลูกค้าโครงการ" : cus.customer_Type == 2 ? "ลูกค้าผู้รับเหมารายย่อย" : "ลูกค้าบ้านพักอาศัย",
                        CustomerServiceCenter: cus.service_Center,
                        CustomerQuotaService: cus.quota_Service,
                        CustomerStatus: cus.is_Active,
                        Username: cus.username,
                        Password: cus.password
                    });
                    // console.log(response.data.data);
                    // console.log(this.state.CustomerProvince);
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    AddCustomer() {
        // console.log(this.state.CustomerCode);
        const Tempdata = {
            ID: this.state.CustomerID == undefined ? null : this.state.CustomerID,
            // Member_Code: this.state.CustomerCode == undefined ? null : this.state.CustomerCode,
            FirstName: this.state.CustomerFirstName == undefined ? null : this.state.CustomerFirstName,
            LastName: this.state.CustomerLastName == undefined ? null : this.state.CustomerLastName,
            Tel: this.state.CustomerTel == undefined ? null : this.state.CustomerTel,
            Phone: this.state.CustomerPhone == undefined ? null : this.state.CustomerPhone,
            Email: this.state.CustomerEmail == undefined ? null : this.state.CustomerEmail,
            Address: this.state.CustomerAddress == undefined ? null : this.state.CustomerAddress,
            ZIP_Code: this.state.CustomerZIPCode == undefined ? null : this.state.CustomerZIPCode,
            Customer_Company: this.state.CustomerCompany == undefined ? null : this.state.CustomerCompany,
            FK_Province_ID: this.state.CustomerProvince == undefined ? null : this.state.CustomerProvince.value,
            FK_District_ID: this.state.CustomerDistrict == undefined ? null : this.state.CustomerDistrict.value,
            FK_Sub_District_ID: this.state.CustomerSubDistrict == undefined ? null : this.state.CustomerSubDistrict.value,
            // Customer_Type: this.state.CustomerType == undefined ? null : this.state.CustomerType,
            Service_Center: this.state.CustomerServiceCenter == undefined ? null : this.state.CustomerServiceCenter,
            Quota_Service: this.state.CustomerQuotaService == undefined ? null : this.state.CustomerQuotaService,
            IsActive: this.state.CustomerStatus == 1 ? true : false,
            Username: this.state.Username == undefined ? null : this.state.Username,
            Password: this.state.Password == undefined ? null : this.state.Password
        };

        axios.post(`${APIUrl}Customer/UpdateCustomer`, Tempdata)
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

    SaveDataCustomer() {
        // console.log(this.state.CustomerCode);
        const Tempdata = {
            Member_Code: this.state.CustomerCode == undefined ? null : this.state.CustomerCode,
            FirstName: this.state.CustomerFirstName == undefined ? null : this.state.CustomerFirstName,
            LastName: this.state.CustomerLastName == undefined ? null : this.state.CustomerLastName,
            Tel: this.state.CustomerTel == undefined ? null : this.state.CustomerTel,
            Phone: this.state.CustomerPhone == undefined ? null : this.state.CustomerPhone,
            Email: this.state.CustomerEmail == undefined ? null : this.state.CustomerEmail,
            Address: this.state.CustomerAddress == undefined ? null : this.state.CustomerAddress,
            ZIP_Code: this.state.CustomerZIPCode == undefined ? null : this.state.CustomerZIPCode,
            Customer_Company: this.state.CustomerCompany == undefined ? null : this.state.CustomerCompany,
            FK_Province_ID: this.state.CustomerProvince == undefined ? null : this.state.CustomerProvince.value,
            FK_District_ID: this.state.CustomerDistrict == undefined ? null : this.state.CustomerDistrict.value,
            FK_Sub_District_ID: this.state.CustomerSubDistrict == undefined ? null : this.state.CustomerSubDistrict.value,
            Customer_Type: this.state.CustomerType == undefined ? null : this.state.CustomerType,
            Service_Center: this.state.CustomerServiceCenter == undefined ? null : this.state.CustomerServiceCenter,
            Quota_Service: this.state.CustomerQuotaService == undefined ? null : this.state.CustomerQuotaService
        };

        axios.post(`${APIUrl}Customer/AddCustomer`, Tempdata)
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

    DeleteCustomer(val) {
        var temp = {
            ID: val
        };
        axios.post(`${APIUrl}Customer/DeleteCustomer`, temp)
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

    async GetDataProvince() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios
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
                    // console.log(response.data.data);
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataDistrict() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios
            .post(`${APIUrl}Master/GetDistrict`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ AllDistrict: response.data.data });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataSubDistrict() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios
            .post(`${APIUrl}Master/GetSubDistrict`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ AllSubDistrict: response.data.data });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    GetImage(val) {
        const Tempdata = {
            ID: val
        };
        axios
            .post(`${APIUrl}Customer/GetImageByCustomerId`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ ArrFile: response.data.data });
                    this.renderShowFile();
                    $("#ShowPic").removeAttr("style").show();
                }
            })
            .catch(err => {
                console.log(err);
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

    GetSeviceHistory(val) {
        const Tempdata = {
            CustomerID: val
        };
        axios
            .post(`${APIUrl}ServiceInformation/GetDataInformationListByCustomerID`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ ServiceHistoryData: response.data.data.temp });
                    // console.log(response.data.data);
                    let TempData = [];
                    response.data.data.temp.map((item, index) => {
                        let TempSubData = {
                            no: index + 1,
                            servicedate: item.servicedate,
                            servicenumber: item.servicenumber,
                            servicestaff: item.servicestaff,
                            servicesummary: item.servicesummary,
                            image: item.image == null ? "ไม่ได้แนบภาพใบเสร็จ" : item.image.match('.pdf') == null ? 
                            <img style={{ maxHeight: "100px",cursor: 'pointer' }}  src={`${APIImagePath}` + item.image} onClick={() => window.open(`${APIImagePath}` + item.image)} /> :
                            <img style={{ maxHeight: "100px",cursor: 'pointer' }}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.image)} />,
                            receiptimage: item.receiptimage == null ? "ไม่ได้แนบภาพใบเสร็จ" : item.receiptimage.match('.pdf') == null ? 
                            <img style={{ maxHeight: "100px",cursor: 'pointer' }}  src={`${APIImagePath}` + item.receiptimage} onClick={() => window.open(`${APIImagePath}` + item.receiptimage)} /> :
                            <img style={{ maxHeight: "100px",cursor: 'pointer' }}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.receiptimage)} />
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.ServiceHistoryColumns
                    };
                    this.setState({ ListServiceHistoryData: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    GetRenewHistory(val) {
        axios
            .post(`${APIUrl}CustomerRenew/GetMembershipRenewHistory?ID=` + val)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ RenewHistoryData: response.data.data });
                    // console.log(response.data.data);
                    let TempData = [];
                    response.data.data.map((item, index) => {
                        let TempSubData = {
                            no: index + 1,
                            renewdate: item.renewdate,
                            employeename: item.employeename,
                            receiptimage: item.receiptimage == null ? "ไม่ได้แนบภาพใบเสร็จ" : <img style={{ maxHeight: "100px" }} src={`${APIImagePath}` + item.receiptimage} />,
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.RenewHistoryColumns
                    };
                    this.setState({ ListRenewHistoryData: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    AddRenew(item) {
        const Tempdata = {
            Customer_ID: item.id,
            Renew_Center: item.servicecenter,
            Renew_Type: item.customertype,
        };
        axios
            .post(`${APIUrl}CustomerRenew/SaveRequestCustomerRenew`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    alert('Success')
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    GetImageSlip(val) {
        const Tempdata = {
            ID: val
        };
        axios
            .post(`${APIUrl}Customer/GetImageSlipByCustomerId`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ img_slip: response.data.data.receipt_Image });
                    this.setState({ chkpdf: response.data.data.receipt_Image.match('.pdf') });
                    // this.setState({ optionsDistrict: ArrTempDistrict });
                    // $("#ShowPic").removeAttr("style").show();
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChangeProvince = Province => {
        this.setState({ CustomerProvince: Province });
        if (Province != null && Province != "") {
            var tempDistrict = this.state.AllDistrict.filter(x => x.fK_Province_ID == parseInt(Province.value));
            var ArrTempDistrict = [];
            Array.prototype.forEach.call(tempDistrict, function (index) {
                var DistrictObj = {
                    value: index.id,
                    label: index.district_Name,
                };
                ArrTempDistrict.push(DistrictObj);
            });
            this.setState({ optionsDistrict: ArrTempDistrict });
        }
        // console.log(`Option selected:`, Province);
    };

    handleChangeDistrict = District => {
        this.setState({ CustomerDistrict: District });
        if (District != null && District != "") {
            var tempSubDistrict = this.state.AllSubDistrict.filter(x => x.fK_District_ID == parseInt(District.value));
            var ArrTempSubDistrict = [];
            Array.prototype.forEach.call(tempSubDistrict, function (index) {
                var SubDistrictObj = {
                    value: index.id,
                    label: index.sub_District_Name,
                };
                ArrTempSubDistrict.push(SubDistrictObj);
            });
            this.setState({ optionsSubDistrict: ArrTempSubDistrict });
        }
        // console.log(`Option selected:`, District);
    };

    handleChangeSubDistrict = SubDistrict => {
        this.setState({ CustomerSubDistrict: SubDistrict });
        if (SubDistrict != null && SubDistrict != "") {
            var tempSubDistrict = this.state.AllSubDistrict.filter(x => x.id == parseInt(SubDistrict.value));
            this.setState({ CustomerZIPCode: tempSubDistrict[0].zip_Code });
        }
        // console.log(`Option selected:`, SubDistrict);
    };

    setStateCustomerCode = event => {
        this.setState({ CustomerCode: event.target.value });
    }

    setStateCustomerFirstName = event => {
        this.setState({ CustomerFirstName: event.target.value });
    }

    setStateCustomerLastName = event => {
        this.setState({ CustomerLastName: event.target.value });
    }

    setStateCustomerTel = event => {
        this.setState({ CustomerTel: event.target.value });
    }

    setStateCustomerPhone = event => {
        this.setState({ CustomerPhone: event.target.value });
    }

    setStateCustomerEmail = event => {
        this.setState({ CustomerEmail: event.target.value });
    }

    setStateCustomerAddress = event => {
        this.setState({ CustomerAddress: event.target.value });
    }

    setStateCustomerCompany = event => {
        this.setState({ CustomerCompany: event.target.value });
    }

    setStateCustomerType = event => {
        this.setState({ CustomerType: event.target.value });
    }

    setStateCustomerServiceCenter = event => {
        this.setState({ CustomerServiceCenter: event.target.value });
    }

    setStateCustomerQuotaService = event => {
        this.setState({ CustomerQuotaService: event.target.value });
    }

    setStateCustomerStatus = event => {
        this.setState({ CustomerStatus: event.target.value });

    }
    SetDataUsername = event => {
        this.setState({ Username: event.target.value });
    }

    SetDataPassword = event => {
        this.setState({ Password: event.target.value });
    }

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    ChangeSearchFilter = event => {
        this.setState({ SearchCareArea: event });
    };

    ChangeSearchCustomerType = event => {
        this.setState({ SearchCustomerType: event });
    };

    ClosePicModal() {
        $("#ShowPic").removeAttr("style").hide();
    }

    ChangeSort() {
        // console.log(this.state.ListDataCustomer);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetDataCustomerAllPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetDataCustomerAllPerPage(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
    };

    onPaginationNext() {
        let page = this.state.Page + 1;
        if (page == 1) {
            this.setState({ Previous_Status: "page-item disabled" });
            this.setState({ Next_Status: "page-item disabled" });
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
        this.GetDataCustomerAllPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetDataCustomerAllPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetDataCustomerAllPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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

    renderTable() {
        return this.state.CustomerData.map((CustomerData, index) => {
            const {
                id,
                customer_Code,
                customer_Name,
                customer_Tel,
                customer_Address,
                customer_Type,
                is_Active,
                create_Date,
                is_Image,
            } = CustomerData;
            return (
                <tr key={id}>
                    <td> {index + 1} </td>
                    <td> {customer_Code} </td>
                    <td> {customer_Name} </td>
                    <td> {customer_Tel} </td>
                    <td> {customer_Address} </td>
                    <td> {customer_Type} </td>
                    <td> {create_Date} </td>
                    <td> {create_Date} </td>
                    <td> {is_Active == 1 ? "Active" : "InActive"} </td>
                    <td>
                        <button class="btn btn-info" style={{ marginLeft: '17%' }} disabled={!is_Image} onClick={() => this.GetImage(id)} data-toggle="modal" data-target="#ShowPic" data-backdrop="static" >คลิก</button>
                    </td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetCustomerById(id)} data-toggle="modal" data-target="#EditCustomerPopup" data-backdrop="static">
                            <img
                                style={{ maxWidth: "20px" }}
                                src={require("../images/editor.png")}
                                alt=""
                            />
                        </button>
                    </td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteCustomer(id)}>
                            <img
                                style={{ maxWidth: "20px" }}
                                src={require("../images/DeleteIcon.png")}
                                alt=""
                            />
                        </button>
                    </td>
                </tr>
            );
        });
    }

    renderShowFile() {
        return this.state.ArrFile.map((item, index) => {
            // console.log(item.name);
            if (index == 0) {
                return (
                    <div class="carousel-item active">
                        <img class="d-block w-100" src={`${APIImagePath}` + item.path} alt="First slide" />
                    </div>
                );
            } else {
                return (
                    <div class="carousel-item">
                        <img class="d-block w-100" src={`${APIImagePath}` + item.path} alt="Slide" />
                    </div>
                );
            }
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
                            <div class="page-header-content pt-4">
                                <div class="row align-items-center justify-content-between">
                                    <div class="col-auto mt-4">
                                        <h1 class="page-header-title">
                                            <div class="page-header-icon"><Activity /></div>
                                            Manage Membership
                                        </h1>
                                        <div class="page-header-subtitle">จัดการข้อมูลลูกค้าสมาชิก</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <MDBContainer className='mt-0' fluid responsive>
                        <MDBRow className='py-3'>
                            <MDBCol md='12'>
                                <MDBCard>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                            </div>
                                            <div className="col-md-6">
                                                <div class="float-right">
                                                    {this.state.Permission === "W" ?
                                                        <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }}
                                                            onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType)}><Download />&nbsp; Export Excel</button> :
                                                        <button class="btn btn-outline-info" disabled type="button" style={{ width: '100%' }}><Download />&nbsp; Export Excel</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* {this.state.Permission === "W" ?
                                    <button className="btn btn-success col-md-1" style={{ marginLeft: '2%' }} data-toggle="modal" data-target="#AddCustomerPopup" data-backdrop="static">เพิ่มข้อมูล</button>
                                    : <button disabled className="btn btn-success col-md-1" style={{ marginLeft: '2%' }} data-toggle="modal" data-target="#AddCustomerPopup" data-backdrop="static">เพิ่มข้อมูล</button>} */}
                                    <MDBCardBody>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2.1rem', marginBottom: '2.3rem' }}>
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    styles={customStyles}
                                                    value={this.state.SearchCareArea}
                                                    onChange={this.ChangeSearchFilter}
                                                    options={this.state.ListDataCareCenter}
                                                />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2.1rem', marginBottom: '2.3rem' }}>
                                                <label className="small mb-1">ประเภทสมาชิก</label>
                                                <Select
                                                    styles={customStyles}
                                                    value={this.state.SearchCustomerType}
                                                    onChange={this.ChangeSearchCustomerType}
                                                    options={this.state.CustomerTypeStatus}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
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
                                            <div className="form-group col-md-3">
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
                                                    class="form-control form-control-sm ml-0 my-1"
                                                    type="text"
                                                    placeholder="Search"
                                                    aria-label="Search"
                                                    value={this.state.Search}
                                                    onChange={this.ChangeSearch}
                                                    onKeyPress={this.EnterSearch}
                                                />
                                            </div>
                                            <div className="col-md-2" style={{ marginTop: '-5px' }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <button className="btn btn-success" onClick={() => this.GetDataCustomerAllPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType)}>ค้นหา</button> 
                                                        &nbsp;
                                                    </div>
                                                    <div className="col-md-5">
                                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-1" style={{ marginTop: '-5px' }}>
                                            <button className="btn btn-danger" onClick={() => this.GetDataCustomerAllPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType)}>เคลียร์</button>
                                        </div> */}
                                        </div>
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ListDataCustomer.columns} />
                                            <MDBTableBody rows={this.state.ListDataCustomer.rows} />
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
                    <Row>
                        <div className="modal" id="AddCustomerPopup" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูลลูกค้า</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รหัสลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerCode}
                                                        onChange={this.setStateCustomerCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ชื่อลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerFirstName}
                                                        onChange={this.setStateCustomerFirstName}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">นามสกุลลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerLastName}
                                                        onChange={this.setStateCustomerLastName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เบอร์โทร</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerTel}
                                                        onChange={this.setStateCustomerTel}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เบอร์มือถือ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerPhone}
                                                        onChange={this.setStateCustomerPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อีเมล</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerEmail}
                                                        onChange={this.setStateCustomerEmail}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">CustomerType</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerType}
                                                        onChange={this.setStateCustomerType}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    <label className="small mb-1">ที่อยู่</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerAddress}
                                                        onChange={this.setStateCustomerAddress}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">จังหวัด</label>
                                                    <Select
                                                        value={this.state.CustomerProvince}
                                                        onChange={this.handleChangeProvince}
                                                        options={this.state.optionsProvince}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อำเภอ</label>
                                                    <Select
                                                        value={this.state.CustomerDistrict}
                                                        onChange={this.handleChangeDistrict}
                                                        options={this.state.optionsDistrict}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ตำบล</label>
                                                    <Select
                                                        value={this.state.CustomerSubDistrict}
                                                        onChange={this.handleChangeSubDistrict}
                                                        options={this.state.optionsSubDistrict}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รหัสไปรษณีย์</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerZIPCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">Customer Company</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerCompany}
                                                        onChange={this.setStateCustomerCompany}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ศูนย์บริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerServiceCenter}
                                                        onChange={this.setStateCustomerServiceCenter}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">โควต้าบริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="number"
                                                        value={this.state.CustomerQuotaService}
                                                        onChange={this.setStateCustomerQuotaService}
                                                    />
                                                </div>
                                            </div>
                                            <hr></hr>
                                            {/* <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ภาพใบเสร็จ</label>
                                                <br></br>
                                                <input 
                                                    type="file" 
                                                />
                                            </div>
                                        </div> */}
                                            <div className="row">
                                                <div className="form-group col-md-11">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        style={{ float: 'right' }}
                                                        onClick={() => this.SaveDataCustomer()}
                                                    >
                                                        เพิ่มข้อมูล
                                                    </button>
                                                    {/* <input value="Add Data" className="btn btn-success" onClick={() => this.AddCustomer}/> */}
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>

                    <Row>
                        <div className="modal" id="EditCustomerPopup" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>จัดการข้อมูลลูกค้า</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รหัสลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerCode}
                                                        // onChange={this.setStateCustomerCode}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ชื่อลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerFirstName}
                                                        onChange={this.setStateCustomerFirstName}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">นามสกุลลูกค้า</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerLastName}
                                                        onChange={this.setStateCustomerLastName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เบอร์โทร</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerTel}
                                                        onChange={this.setStateCustomerTel}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เบอร์มือถือ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerPhone}
                                                        onChange={this.setStateCustomerPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อีเมล</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerEmail}
                                                        onChange={this.setStateCustomerEmail}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">CustomerType</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerType}
                                                        // onChange={this.setStateCustomerType}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    <label className="small mb-1">ที่อยู่</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerAddress}
                                                        onChange={this.setStateCustomerAddress}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">จังหวัด</label>
                                                    <Select
                                                        value={this.state.CustomerProvince}
                                                        onChange={this.handleChangeProvince}
                                                        options={this.state.optionsProvince}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อำเภอ</label>
                                                    <Select
                                                        value={this.state.CustomerDistrict}
                                                        onChange={this.handleChangeDistrict}
                                                        options={this.state.optionsDistrict}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ตำบล</label>
                                                    <Select
                                                        value={this.state.CustomerSubDistrict}
                                                        onChange={this.handleChangeSubDistrict}
                                                        options={this.state.optionsSubDistrict}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รหัสไปรษณีย์</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerZIPCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">Customer Company</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerCompany}
                                                        onChange={this.setStateCustomerCompany}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ศูนย์บริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.CustomerServiceCenter}
                                                        onChange={this.setStateCustomerServiceCenter}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">โควต้าบริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="number"
                                                        value={this.state.CustomerQuotaService}
                                                        onChange={this.setStateCustomerQuotaService}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">สถานะ</label>
                                                    <div>
                                                        <input type="radio" value="1" onChange={this.setStateCustomerStatus} checked={this.state.CustomerStatus == 1} />
                                                        <label className="small mb-4">&nbsp;&nbsp; Active</label>
                                                        &nbsp;&nbsp;
                                                        <input type="radio" value="0" onChange={this.setStateCustomerStatus} checked={this.state.CustomerStatus == 0} />
                                                        <label className="small mb-4">&nbsp;&nbsp; InActive</label>

                                                    </div>
                                                    {/* <label className="small mb-1">Status</label>
                                                <div className="radio">
                                                    <label>
                                                    <label className="small mb-1">InActive</label>
                                                        <input type="radio" value="0" onChange={this.setStateCustomerStatus} checked={this.state.CustomerStatus == 0} />
                                                        
                                                    </label>
                                                    <label className="small mb-1">Active</label>
                                                    <label>
                                                        <input type="radio" value="1" onChange={this.setStateCustomerStatus} checked={this.state.CustomerStatus == 1} />
                                                        
                                                    </label>
                                                </div> */}
                                                </div>
                                            </div>
                                            <hr></hr>
                                            {/* <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ภาพใบเสร็จ</label>
                                                <br></br>
                                                <input 
                                                    type="file" 
                                                />
                                            </div>
                                        </div> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">Username</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Username}
                                                        onChange={this.SetDataUsername}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">Password</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="password"
                                                        value={this.state.Password}
                                                        onChange={this.SetDataPassword}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-11">
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning" style={{ float: 'right' }}
                                                        onClick={() => this.AddCustomer()}
                                                    >
                                                        อัพเดต
                                                    </button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>

                    <Row>
                        <div className="modal" id="ShowSlip" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>สลิป</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="form-group col-md6">
                                                {this.state.img_slip == null ? 'ไม่ได้แนบไฟล์รูปภาพ' : this.state.chkpdf == null ? <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + this.state.img_slip} onClick={() => window.open(`${APIImagePath}` + this.state.img_slip)}/> :
                                                <img class="table-pdf" style={{cursor: 'pointer'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + this.state.img_slip)} /> }
                                            </div>
                                        </div>
                                        {/* <div className="row">
                                        <div className="form-group col-md6">
                                                <button type="button" className="btn btn-danger" data-dismiss="modal">ปิด</button>
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <div className="modal" id="ServiceHistory" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>ประวัติการบริการ</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ListServiceHistoryData.columns} />
                                            <MDBTableBody rows={this.state.ListServiceHistoryData.rows} />
                                        </MDBTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <div className="modal" id="RenewHistory" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>ประวัติการต่ออายุ</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ListRenewHistoryData.columns} />
                                            <MDBTableBody rows={this.state.ListRenewHistoryData.rows} />
                                        </MDBTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <style>{"\
                .table-img {\
                    max-width: 100%;\
                }\
                .table-pdf {\
                    max-width: 50%;\
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
export default Customer;
