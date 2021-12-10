import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
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
import { Activity, Download, Search } from 'react-feather';
import LoadingOverlay from "react-loading-overlay";
import moment from 'moment';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class CustomerRenew extends React.Component {

    async componentWillMount() {
        await this.GetDataServiceCenter();
        await this.GetDataPermission();
        await this.GetDataCareCenter();
        await this.GetAllCustomerRenewPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
        // await this.GetDataProvince();
        // await this.GetDataDistrict();
        // await this.GetDataSubDistrict();
        // alert(this.state.usernames);
        // await this.GetDataServiceCenter();
    }

    constructor(props) {
        super(props);
        this.state = {
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Membership Renew',
            Permission: "",
            StartDateSearch: '',
            EndDateSearch: '',
            CustomerData: [],
            LangID: 1,
            Status_ID: null,
            Description: null,
            PathSlip: null,
            Employee_Signature: null,
            CustomerID: null,
            Renew_ID: null,
            Del_Renew_ID: null,
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
            HistoryStatus: [],
            ListServiceHistoryData: [],
            optionsServiceCenter: [],
            optionsType: [
                { value: 1, label: "สมาชิกโครงการ" },
                { value: 2, label: "สมาชิกผู้รับเหมารายย่อย" },
                { value: 3, label: "สมาชิกบ้านพักอาศัย" }
            ],
            optionsProvince: [],
            optionsDistrict: [],
            optionsSubDistrict: [],
            optionsStatus: [
                { value: -1, label: "ทั้งหมด" },
                { value: 0, label: "รอดำเนินการ" },
                { value: 1, label: "ติดต่อสอบถาม" },
                { value: 2, label: "รอชำระเงิน + แนบไฟล์ภาพ" },
                { value: 3, label: "ตรวจสอบการชำระเงิน" },
                { value: 4, label: "ทำการต่ออายุสำเร็จ" },
                { value: 5, label: "ลูกค้าไม่สนใจ" }
            ],
            CustomerTypeStatus: [
                { value: -1, label: "ทั้งหมด" },
                { value: 1, label: "สมาชิกโครงการ" },
                { value: 2, label: "สมาชิกผู้รับเหมารายย่อย" },
                { value: 3, label: "สมาชิกบ้านพักอาศัย" },
            ],
            AllDistrict: [],
            AllSubDistrict: [],
            ArrFile: [],
            img_slip: null,
            chkpdf: '',
            img_signature: null,
            chksignaturepdf: '',
            ListDataCustomer: [],
            Page: 1,
            AllPage: 0,
            PerPage: 10,
            Search: "",
            Status: null,
            Previous_Status: "page-item disabled",
            Next_Status: "page-item ",

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
                    label: "สรุบการให้บริการ*",
                    field: "servicesummary",
                    sort: "asc"
                },
                {
                    label: "ภาพหลักฐานใบบริการ/ใบเสร็จ",
                    field: "servicehistory",
                    sort: "asc"
                }
            ],
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "วัน/เดือน/ปี ที่สมัคร",
                    field: "Customer_CreateDate",
                    sort: "asc"
                },
                {
                    label: "วัน/เดือน/ปี ที่ต่ออายุ",
                    field: "Renew_Date",
                    sort: "asc"
                },
                {
                    label: "ประเภทสมาชิก",
                    field: "Customer_Type",
                    sort: "asc"
                },
                {
                    label: "รหัสลูกค้า",
                    field: "Customer_Code",
                    sort: "asc"
                },
                {
                    label: "ชื่อที่จะระบุสมาชิกหรือผู้ติดต่อ (กรณีบุคคล)",
                    field: "Customer_Fullname",
                    sort: "asc"
                },
                {
                    label: "ชื่อที่จะระบุสมาชิก (กรณี บริษัท, โรงแรม, สำนักงาน, ฯลฯ)",
                    field: "Customer_Company",
                    sort: "asc"
                },
                {
                    label: 'มือถือ*',
                    field: 'Customer_Phone',
                    sort: 'asc'
                },
                {
                    label: 'ที่อยู่ที่ติดตั้งสินค้า* (ไม่สามารถเปลี่ยนแปลงได้)',
                    field: 'Customer_Address',
                    sort: 'asc'
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
                    field: 'Customer_ZIP_Code',
                    sort: 'asc'
                },
                {
                    label: 'ศูนย์บริการสาขา',
                    field: 'Service_Center',
                    sort: 'asc'
                },
                {
                    label: 'แผนที่',
                    field: 'mapgps',
                    sort: 'asc'
                },
                {
                    label: 'ประวัติการบริการ',
                    field: 'servicehistory',
                    sort: 'asc'
                },
                {
                    label: 'สถานะ',
                    field: 'Customer_Active',
                    sort: 'asc'
                },
                {
                    label: 'สถานะลูกค้า',
                    field: 'Renew_Status',
                    sort: 'asc'
                },
                {
                    label: 'ดำเนินการ',
                    field: 'process',
                    sort: 'asc'
                },
                {
                    label: 'วันที่ดำเนินการ',
                    field: 'Renew_CreateDate',
                    sort: 'asc'
                },
                {
                    label: 'เจ้าหน้าที่',
                    field: 'Renew_CreateBy',
                    sort: 'asc'
                },
                {
                    label: 'ภาพใบเสร็จ',
                    field: 'Receipt_Image',
                    sort: 'asc'
                },
                // {
                //     label: 'แก้ไข',
                //     field: 'edit',
                //     sort: 'asc'
                // },
                {
                    label: 'ลบ',
                    field: 'delete',
                    sort: 'asc'
                }
            ],
            Username: '',
            Password: '',
            SearchCareArea: null,
            SearchCustomerType: null,
            ListDataCareCenter: [],
        };
    }

    async GetDataCareCenter() {
        await axios
            .post(`${APIUrl}Customer/GetDataCareCenter`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    var firstdata = {
                        value: -1,
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


    async GetDataPermission() {
        await axios
            .post(`${APIUrl}Permission/GetDataPermission`)
            .then(response => {
                if (response.data.status == 0) {
                    var temp = response.data.data;
                    var Permission = temp.filter(x => x.user_group == this.state.User_Group && x.menu_name == this.state.menu_name.toLowerCase());
                    if (Permission.length > 0) {
                        this.setState({ Permission: Permission[0].permission });
                        console.log(Permission);
                    }
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
                            servicehistory: item.image == null ? "ไม่ได้แนบภาพใบเสร็จ" : <img style={{ maxHeight: "100px" }} src={`${APIImagePath}` + item.image} />,
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

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchCustomerType: null });
        window.location.reload();
    }

    async GetAllCustomerRenewPerPage(Page, PerPage, Search, StartDate, EndDate, Status, CareAreaData, CustomerTypeData) {
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
            Status: Status == null ? -1 : Status.value
        };
        await axios.post(`${APIUrl}CustomerRenew/GetAllCustomerRenewPerPage`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ CustomerData: response.data.data });
                    // console.log(response.data.data);
                    let all_page = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: all_page });
                    let TempData = [];
                    let no_ran = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            // id: item.id,
                            no: (no_ran + (index + 1)),
                            Customer_CreateDate: item.customer_CreateDate,
                            Renew_Date: item.renew_Date,
                            Customer_Type: item.customer_Type == 1 ? "สมาชิกโครงการ" : item.customer_Type == 2 ? "สมาชิกผู้รับเหมารายย่อย" : item.customer_Type == 3 ? "สมาชิกบ้านพักอาศัย" : "",
                            Customer_Code: item.customer_Code,
                            Customer_Fullname: item.customer_Fullname,
                            Customer_Company: item.customer_Company,
                            Customer_Phone: item.customer_Phone,
                            Customer_Address: item.customer_Address,
                            district: item.district,
                            subdistrict: item.subdistrict,
                            province: item.province,
                            Customer_ZIP_Code: item.customer_ZIP_Code,
                            Service_Center: item.service_Center,
                            mapgps: item.mapgps,
                            servicehistory: <img style={{ maxWidth: "20px" }} src={require("../images/view.png")} onClick={() => this.GetSeviceHistory(item.customer_ID)} data-toggle="modal" data-target="#ServiceHistory" data-backdrop="static" />,
                            Customer_Active: item.customer_Active === 1 ? "Active" : "InActive",
                            Renew_Status: item.renew_Status === 0 ? "รอดำเนินการ" : item.renew_Status === 1 ? "ติดต่อสอบถาม" : item.renew_Status === 2 ? "รอชำระเงิน + แนบไฟล์ภาพ" : item.renew_Status === 3 ? "ตรวจสอบการชำระเงิน" : item.renew_Status === 4 ? "ทำการต่ออายุสำเร็จ" : item.renew_Status === 5 ? "ลูกค้าไม่สนใจ เหตุผล: " + item.renew_Description : "ไม่ระบุ",
                            process: item.renew_Status === 0 ?
                                (this.state.Permission === "W" ?
                                    <button class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ConfirmPopup" data-backdrop="static" >รับเรื่อง</button> :
                                    <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ConfirmPopup" data-backdrop="static" >รับเรื่อง</button>) :
                                item.renew_Status === 1 ?
                                    (this.state.Permission === "W" ?
                                        <button class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ContactPopup" data-backdrop="static" >จัดการ</button> :
                                        <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ContactPopup" data-backdrop="static" >จัดการ</button>) :
                                    item.renew_Status === 2 ?
                                        (this.state.Permission === "W" ?
                                            <button class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#AddSlipPopup" data-backdrop="static" >แนบไฟล์ภาพ</button> :
                                            <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#AddSlipPopup" data-backdrop="static" >แนบไฟล์ภาพ</button>) :
                                        item.renew_Status === 3 ?
                                            (
                                                this.state.Permission === "W" ?
                                                    (
                                                        <div class="container">
                                                            <div class="row">
                                                                <div class="col-12">
                                                                    <button class="btn btn-info" type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ConfirmPopup" data-backdrop="static" >อนุมัติ</button>
                                                                </div>
                                                                <div class="col-12">
                                                                    &nbsp;
                                                                </div>
                                                                <div class="col-12">
                                                                    <button class="btn btn-info" type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, 2)} data-toggle="modal" data-target="#AddSlipPopup" data-backdrop="static" >แนบไฟล์ภาพใหม่</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) :
                                                    (
                                                        <div class="container">
                                                            <div class="row">
                                                                <div class="col-12">
                                                                    <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, item.customer_ID, item.renew_Status)} data-toggle="modal" data-target="#ConfirmPopup" data-backdrop="static" >อนุมัติ</button>
                                                                </div>
                                                                <div class="col-12">
                                                                    &nbsp;
                                                                </div>
                                                                <div class="col-12">
                                                                    <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.SetIdAndStatus(item.id, 2)} data-toggle="modal" data-target="#AddSlipPopup" data-backdrop="static" >อัพภาพสลิปใหม่</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                            ) :
                                            item.renew_Status === 5 ?
                                                <button disabled class="btn btn-danger" style={{ marginLeft: '17%' }} type="button">สิ้นสุด</button> :
                                                <button disabled class="btn btn-success" style={{ marginLeft: '17%' }} type="button">สิ้นสุด</button>,
                            Renew_CreateDate: item.renew_CreateDate,
                            Renew_CreateBy: item.renew_CreateBy,
                            // HistoryStatus: this.state.Permission === "W" ?
                            // <button class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.GetHistoryStatusById(item.id)} data-toggle="modal" data-target="#HistoryStatus" data-backdrop="static" >วันที่ที่ดำเนินการ</button>
                            // : <button disabled class="btn btn-info" style={{ marginLeft: '17%' }} type="button" onClick={() => this.GetHistoryStatusById(item.id)} data-toggle="modal" data-target="#HistoryStatus" data-backdrop="static" >วันที่ที่ดำเนินการ</button>,
                            Receipt_Image: (this.state.Permission === "W" ? <button style={{ marginLeft: '17%' }} disabled={!item.is_Image} className={item.is_Image == true ? "btn btn-info" : "btn btn-secondary"} onClick={() => this.GetImageSlip(item.receipt_Image,item.employee_Signature)} data-toggle="modal" data-target="#ShowSlip" data-backdrop="static" >คลิก</button>
                                : <button disabled style={{ marginLeft: '17%' }}>คลิก</button>),
                            // edit: this.state.Permission === "W" ?
                            //     <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetCustomerById(item.id)} data-toggle="modal" data-target="#EditCustomerPopup" data-backdrop="static">
                            //         <img
                            //             style={{ maxWidth: "20px" }}
                            //             src={require("../images/editor.png")}
                            //             alt=""
                            //         />
                            //     </button>
                            //     : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetCustomerById(item.id)} data-toggle="modal" data-target="#EditCustomerPopup" data-backdrop="static">
                            //         <img
                            //             style={{ maxWidth: "20px" }}
                            //             src={require("../images/editor.png")}
                            //             alt=""
                            //         />
                            //     </button>,
                            delete: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDeleteRenew(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
                                    <img
                                        style={{ maxWidth: "20px" }}
                                        src={require("../images/DeleteIcon.png")}
                                        alt=""
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDeleteRenew(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
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
    
    async ExportExcel(Search, StartDate, EndDate, Status, CareAreaData, CustomerTypeData) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
            CustomerType: CustomerTypeData == null ? null : CustomerTypeData.value,
            Status: Status == null ? -1 : Status.value
        };
        await axios.post(`${APIUrl}CustomerRenew/MemberShipRenewExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataMembershipRenew.xlsx")
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

    async GetHistoryStatusById(val) {
        var temp = {
            ID: val
        };
        await axios.post(`${APIUrl}Customer/GetDataHistoryStatusById`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ HistoryStatus: [] });
                    // this.state.HistoryStatus = [];
                    var cus = response.data.data;
                    cus.map((item, index) => {
                        let Temp = {
                            StatusName: item.status === 0 ? "รอดำเนินการ" : item.status === 1 ? "ติดต่อสอบถาม" : item.status === 2 ? "รอชำระเงิน + แนบไฟล์ภาพ" : item.status === 3 ? "ตรวจสอบการชำระเงิน" : item.status === 4 ? "ทำการต่ออายุสำเร็จ" : item.status === 5 ? "ลูกค้าไม่สนใจ" : "ไม่ระบุ",
                            StatusBy: item.create_By,
                            StatusDate: item.create_Date,
                        }
                        this.state.HistoryStatus.push(Temp);
                        // console.log(this.state.HistoryStatus);
                    });
                    this.renderShowHistoryStatus();
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    async GetCustomerById(val) {
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
                    var servicecenterdata = cus.service_Center == null ? null : this.state.optionsServiceCenter.filter(x => x.value == cus.service_Center);
                    var customertypedata = cus.customer_Type == null ? null : this.state.optionsType.filter(x => x.value == cus.customer_Type)
                    // console.log(this.state.optionsProvince);
                    // console.log(this.state.AllDistrict);
                    // console.log(this.state.AllSubDistricts);
                    console.log(Province);
                    console.log(District);
                    console.log(SubDistrict);
                    console.log(servicecenterdata);
                    console.log(customertypedata);
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
                        CustomerProvince: Province != null ? Province.length > 0 ? {
                            value: Province[0].value,
                            label: Province[0].label
                        } : null : null,
                        CustomerDistrict: District != null ? District.length > 0 ? {
                            value: District[0].id,
                            label: District[0].district_Name
                        } : null : null,
                        CustomerSubDistrict: SubDistrict != null ? SubDistrict.length > 0 ? {
                            value: SubDistrict[0].id,
                            label: SubDistrict[0].sub_District_Name
                        } : null : null,
                        CustomerServiceCenter: servicecenterdata != null ? servicecenterdata.length > 0 ? {
                            value: servicecenterdata[0].value,
                            label: servicecenterdata[0].label
                        } : null : null,
                        CustomerType: customertypedata != null ? customertypedata.length > 0 ? {
                            value: customertypedata[0].value,
                            label: customertypedata[0].label
                        } : null : null,
                        // CustomerType: cus.customer_Type == null ? null : this.state.optionsType.filter(x => x.value == cus.customer_Type),
                        // CustomerServiceCenter: cus.service_Center == null ? null : this.state.optionsServiceCenter.filter(x => x.value == cus.service_Center),
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

    UpdateCustomer() {
        // console.log(this.state.CustomerCode);
        const Tempdata = {
            ID: this.state.CustomerID == undefined ? null : this.state.CustomerID,
            Member_Code: this.state.CustomerCode == undefined ? null : this.state.CustomerCode,
            FirstName: this.state.CustomerFirstName == undefined ? null : this.state.CustomerFirstName,
            LastName: this.state.CustomerLastName == undefined ? null : this.state.CustomerLastName,
            Tel: this.state.CustomerTel == undefined ? null : this.state.CustomerTel,
            Phone: this.state.CustomerPhone == undefined ? null : this.state.CustomerPhone,
            Email: this.state.CustomerEmail == undefined ? null : this.state.CustomerEmail,
            Address: this.state.CustomerAddress == undefined ? null : this.state.CustomerAddress,
            ZIP_Code: this.state.CustomerZIPCode == undefined ? null : this.state.CustomerZIPCode,
            // Customer_Company: this.CheckDataSelect(this.state.CustomerCompany),
            FK_Province_ID: this.state.CustomerProvince == undefined ? null : this.state.CustomerProvince.value,
            FK_District_ID: this.state.CustomerDistrict == undefined ? null : this.state.CustomerDistrict.value,
            FK_Sub_District_ID: this.state.CustomerSubDistrict == undefined ? null : this.state.CustomerSubDistrict.value,
            Customer_Type: this.CheckDataSelect(this.state.CustomerType),
            Service_Center: this.CheckDataSelect(this.state.CustomerServiceCenter),
            Quota_Service: this.state.CustomerQuotaService == undefined ? null : this.state.CustomerQuotaService,
            Username: this.state.Username == undefined ? null : this.state.Username,
            Password: this.state.Password == undefined ? null : this.state.Password,
            IsActive: this.state.CustomerStatus
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
            // Customer_Company: this.CheckDataSelect(this.state.CustomerCompany),
            FK_Province_ID: this.state.CustomerProvince == undefined ? null : this.state.CustomerProvince.value,
            FK_District_ID: this.state.CustomerDistrict == undefined ? null : this.state.CustomerDistrict.value,
            FK_Sub_District_ID: this.state.CustomerSubDistrict == undefined ? null : this.state.CustomerSubDistrict.value,
            Customer_Type: this.CheckDataSelect(this.state.CustomerType),
            Service_Center: this.CheckDataSelect(this.state.CustomerServiceCenter),
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

    CheckDataSelect(val) {
        if (val != null && val != undefined) {
            return val.value;
        }
        return null;
    }

    SetIdDeleteRenew(id) {
        this.setState({ Del_Renew_ID: id });
    }

    DeleteCustomerRenew(val) {
        var temp = {
            ID: val,
            Create_By: this.state.usernames
        };
        axios.post(`${APIUrl}CustomerRenew/DeleteCustomerRenew`, temp)
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

    UpdateStatus(Status_ID) {
        if (Status_ID == 3) {
            if (this.state.PathSlip == null) {
                alert('กรุณาแนบไฟล์ใบเสร็จก่อนทำรายการ');
                return;
            }
            if (this.state.Employee_Signature == null) {
                alert('กรุณาแนบภาพลายเซ็นเจ้าหน้าที่ก่อนทำรายการ');
                return;
            }
        }

        var temp = {
            Customer_ID: this.state.CustomerID,
            Renew_ID: this.state.Renew_ID,
            Status_ID: Status_ID,
            Description: this.state.Description,
            Path_Slip: this.state.PathSlip,
            Employee_Signature: this.state.Employee_Signature,
            Create_By: this.state.usernames
        };
        axios.post(`${APIUrl}CustomerRenew/RenewUpdateStatus`, temp)
            .then((response) => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
                else {
                    alert(response.data.message);
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    async SaveFile(file, type) {
        const data = new FormData();
        data.append('Slip', file);
        await axios.post(`${APIUrl}Customer/UploadFileSlip`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status === 0) {
                    if (type == 1) {
                        this.setState({ PathSlip: response.data.data });
                        $('#file').val('');
                    }
                    else {
                        this.setState({ Employee_Signature: response.data.data });
                        $('#signaturefile').val('');
                    }
                    this.forceUpdate();
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

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

    async GetDataServiceCenter() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios
            .post(`${APIUrl}Master/GetServiceCenter`, Tempdata)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ optionsServiceCenter: response.data.data });
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

    GetImageSlip(receipt_Image, employee_Signature) {
        this.setState({ img_slip: receipt_Image });
        this.setState({ chkpdf: receipt_Image.match('.pdf') });
        this.setState({ img_signature: employee_Signature });
        this.setState({ chksignaturepdf: employee_Signature.match('.pdf') });
        this.forceUpdate();
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

    handleChangeStatusSearch = Status => {
        this.setState({ Status: Status });
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

    // setStateCustomerType = event => {
    //     this.setState({ CustomerType: event.target.value });
    // }

    // setStateCustomerServiceCenter = event => {
    //     this.setState({ CustomerServiceCenter: event.target.value });
    // }
    handleChangeCustomerType = CustomerType => {
        this.setState({ CustomerType: CustomerType });
        // console.log(`Option selected:`, CustomerType);
    };

    handleChangeCustomerServiceCenter = CustomerServiceCenter => {
        this.setState({ CustomerServiceCenter: CustomerServiceCenter });
        // console.log(`Option selected:`, CustomerServiceCenter);
    };

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

    SetDescription = event => {
        this.setState({ Description: event.target.value });
    }

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    onFileSlipChange = event => {
        this.SaveFile(event.target.files[0], 1);
    };

    onFileSignatureChange = event => {
        this.SaveFile(event.target.files[0], 2);
    };

    ChangeSearchFilter = event => {
        this.setState({ SearchCareArea: event });
    };

    ChangeSearchCustomerType = event => {
        this.setState({ SearchCustomerType: event });
    };

    ClosePicModal() {
        $("#ShowPic").removeAttr("style").hide();
    }

    SetIdAndStatus(Renew_ID, CustomerID, status) {
        this.setState({ Renew_ID: Renew_ID });
        this.setState({ CustomerID: CustomerID });
        this.setState({ Status_ID: status });
    };

    ChangeSort() {
        // console.log(this.state.ListDataCustomer);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetAllCustomerRenewPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllCustomerRenewPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllCustomerRenewPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllCustomerRenewPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllCustomerRenewPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType);
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

    onFileChange = event => {
        if (event.target.length != 0) {
            var FileObj = {
                File: event.target.files[0],
                Type: "New"
            };
            this.state.ArrFile.push(FileObj);
            this.forceUpdate();
        }
    };

    onFileDelete(value) {
        this.state.ArrFile.splice(value, 1);
        this.forceUpdate();
    };

    renderTableFile() {
        return this.state.ArrFile.map((item, index) => {
            if (item.File != undefined) {
                if (item.Type == "New") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#tblImg' + index).attr('src', e.target.result);
                    };
                    reader.readAsDataURL(item.File);
                }

                return (
                    <tr key={index}>
                        {item.Type == "New" && <td> <img style={{ width: '100px', height: '100px' }} id={"tblImg" + index} src={item.File.name} class="table-img"></img> </td>}
                        {item.Type == "Old" && <td> <img style={{ width: '100px', height: '100px' }} class="table-img" src={`${APIImagePath}` + item.File.path}></img></td>}
                        <td>{item.File.name}</td>
                        <td onClick={() => this.onFileDelete(index)}>
                            <input type="button" value="Delete" className="btn btn-danger" />
                        </td>
                    </tr>
                );
            }
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

    renderShowHistoryStatus() {
        return this.state.HistoryStatus.map((item, index) => {
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >{item.StatusName}</td>
                    <td >{item.StatusBy}</td>
                    <td >{item.StatusDate}</td>
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
                        <div class="page-header-content pt-4">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto mt-4">
                                    <h1 class="page-header-title">
                                        <div class="page-header-icon"><Activity /></div>
                                        Manage Membership Renew
                                    </h1>
                                    <div class="page-header-subtitle">จัดการข้อมูลการต่ออายุสมาชิก</div>
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
                                                        onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType)}><Download />&nbsp; Export Excel</button> :
                                                    <button class="btn btn-outline-info" disabled type="button" style={{ width: '100%' }}><Download />&nbsp; Export Excel</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="row">
                                        <div className="form-group col-md-4"></div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2.3rem',marginBottom: '2.3rem' }}>
                                            <label className="small mb-1">ศูนย์บริการ</label>
                                            <Select
                                                styles={customStyles}
                                                value={this.state.SearchCareArea}
                                                onChange={this.ChangeSearchFilter}
                                                options={this.state.ListDataCareCenter}
                                            />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2.3rem',marginBottom: '2.3rem' }}>
                                            <label className="small mb-1">ประเภทสมาชิก</label>
                                            <Select
                                                styles={customStyles}
                                                value={this.state.SearchCustomerType}
                                                onChange={this.ChangeSearchCustomerType}
                                                options={this.state.CustomerTypeStatus}
                                            />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2.3rem',marginBottom: '2.3rem' }}>
                                            <label className="small mb-1">สถานะ</label>
                                            <Select
                                                styles={customStyles}
                                                value={this.state.Status}
                                                onChange={this.handleChangeStatusSearch}
                                                options={this.state.optionsStatus}
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
                                        <div className="form-group col-md-3"></div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2.3rem' }}>
                                            <label className="small mb-1" style={{ whiteSpace: 'nowrap' }} >วันเดือนปีที่ลงทะเบียน</label>
                                            <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.7rem' }}>
                                            <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.8rem' }}>
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
                                        <div className="col-md-2" style={{ marginTop: '-0.8rem' }}>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <button className="btn btn-success" onClick={() => this.GetAllCustomerRenewPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.Status, this.state.SearchCareArea, this.state.SearchCustomerType)}>ค้นหา</button>
                                                    &nbsp;
                                                </div>
                                                <div className="col-md-5">
                                                    <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                </div>
                                            </div>
                                        </div>
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
                                    <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูล</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        {/* <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสลูกค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.CustomerCode}
                                                    onChange={this.setStateCustomerCode}
                                                />
                                            </div>
                                        </div> */}
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
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-8">
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
                                                <label className="small mb-1">ประเภทสมาชิก</label>
                                                <Select
                                                    value={this.state.CustomerType}
                                                    onChange={this.handleChangeCustomerType}
                                                    options={this.state.optionsType}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    value={this.state.CustomerServiceCenter}
                                                    onChange={this.handleChangeCustomerServiceCenter}
                                                    options={this.state.optionsServiceCenter}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>ตัวอย่างไฟล์</th>
                                                            <th>ชื่อไฟล์</th>
                                                            <th>ลบ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.renderTableFile()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr></hr>
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
                                    <h3 style={{ fontSize: '25px' }}>แก้ไขข้อมูล</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        {/* <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสลูกค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.CustomerCode}
                                                    onChange={this.setStateCustomerCode}
                                                />
                                            </div>
                                        </div> */}
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
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-8">
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
                                                <label className="small mb-1">ประเภทสมาชิก</label>
                                                <Select
                                                    value={this.state.CustomerType}
                                                    onChange={this.handleChangeCustomerType}
                                                    options={this.state.optionsType}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    value={this.state.CustomerServiceCenter}
                                                    onChange={this.handleChangeCustomerServiceCenter}
                                                    options={this.state.optionsServiceCenter}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>ตัวอย่างไฟล์</th>
                                                            <th>ชื่อไฟล์</th>
                                                            <th>ลบ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.renderTableFile()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    style={{ float: 'right' }}
                                                    onClick={() => this.UpdateCustomer()}
                                                >
                                                    อัพเดตข้อมูล
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
                    <div className="modal" id="ContactPopup" role="dialog" aria-hidden="true">
                        {/* <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}> */}
                        <div className="modal-content" style={{
                            // marginLeft: '50%',
                            width: '20%',
                            display: "flex",
                            margin: "auto",
                            marginTop: '15%',
                            // justifyContent: "center",
                            // alignItems: "center"
                        }}>
                            <div className="modal-header">
                                <h3 style={{ fontSize: '25px' }}> ติดต่อสอบถาม</h3>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body" style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => this.UpdateStatus(this.state.Status_ID + 1)}
                                        >
                                            ลูกค้าสนใจ
                                        </button> &nbsp;&nbsp;
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-toggle="modal"
                                            data-target="#RejectDetailPopup"
                                            data-backdrop="static"
                                        >
                                            ลูกค้าไม่สนใจ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>

                <Row>

                    <div className="modal" id="RejectDetailPopup" role="dialog" aria-hidden="true">
                        <div className="modal-content" style={{
                            width: '25%',
                            display: "flex",
                            margin: "auto",
                            marginTop: '15%',
                        }}>
                            <div className="modal-header">
                                <h3 style={{ fontSize: '25px' }}> เหตุผลที่ไม่สนใจ</h3>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control" value={this.state.Description} onChange={this.SetDescription} rows="3"></textarea>
                                        </div>
                                    </div>
                                    <hr></hr>
                                    <div className="row" style={{
                                        textAlign: 'right',
                                    }}>
                                        <div className="form-group col-md-12">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => this.UpdateStatus(5)}
                                            >
                                                บันทึก
                                            </button> &nbsp;&nbsp;
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                data-dismiss="modal"
                                            >
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Row>

                <Row>
                    <div className="modal" id="AddSlipPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            {/* <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}> */}
                            <div className="modal-content" style={{
                                width: '30%',
                                display: "flex",
                                margin: "auto",
                                marginTop: '15%',
                            }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}> แนบไฟล์ภาพ</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <form>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <label>แนบภาพใบเสร็จ</label>
                                                <input type="file" id="file" class="form-control-file" onChange={this.onFileSlipChange} />
                                                {this.state.PathSlip != null ? <img class="table-img" src={`${APIImagePath}` + this.state.PathSlip} /> : ""}
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label>แนบภาพลายเซ็นเจ้าหน้าที่</label>
                                                <input type="file" id="signaturefile" class="form-control-file" onChange={this.onFileSignatureChange} />
                                                {this.state.Employee_Signature != null ? <img class="table-img" src={`${APIImagePath}` + this.state.Employee_Signature} /> : ""}
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="row" style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <div className="form-group col-md-6">
                                                <button type="button" className="btn btn-success" onClick={() => this.UpdateStatus(this.state.Status_ID + 1)}>บันทึก</button>
                                                &nbsp;&nbsp;
                                                <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>

                <Row>
                    <div className="modal" id="ConfirmPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content"
                                style={{
                                    width: '25%',
                                    display: "flex",
                                    margin: "auto",
                                    marginTop: '15%',
                                }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ยืนยันใช่หรือไม่ ?</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <div className="row">
                                        <div className="form-group col-md6" >
                                            <button type="button" className="btn btn-success" onClick={() => this.UpdateStatus(this.state.Status_ID + 1)}>ตกลง</button>
                                            &nbsp;&nbsp;
                                            <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                        </div>
                                    </div>
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
                                    <h3 style={{ fontSize: '25px' }}>ไฟล์ภาพ</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="form-group col-12">
                                            <h5>ภาพใบเสร็จ</h5>
                                        </div>
                                        <div className="form-group col-12">
                                            {this.state.img_slip == null ? 'ไม่ได้แนบไฟล์รูปภาพ' : 
                                                this.state.chkpdf == null ? 
                                                    <img class="table-img" style={{cursor: 'pointer',border: 'solid 1px'}} src={`${APIImagePath}` + this.state.img_slip} onClick={() => window.open(`${APIImagePath}` + this.state.img_slip)}/> :

                                                    <img class="table-pdf" style={{cursor: 'pointer',border: 'solid 1px'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + this.state.img_slip)} /> }
                                        </div>
                                        <div className="form-group col-12">
                                            &nbsp;
                                        </div>
                                        <div className="form-group col-12">
                                            <h5>ภาพลายเซ็นเจ้าหน้าที่</h5>
                                        </div>
                                        <div className="form-group col-md12">
                                            <div class="float-center">
                                                {this.state.img_signature == null ? 'ไม่ได้แนบไฟล์รูปภาพ' : 
                                                    this.state.chksignaturepdf == null ? 
                                                        <img class="table-img" style={{cursor: 'pointer',border: 'solid 1px'}} src={`${APIImagePath}` + this.state.img_signature} onClick={() => window.open(`${APIImagePath}` + this.state.img_signature)}/> :
                                                        <img class="table-pdf" style={{cursor: 'pointer',border: 'solid 1px'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + this.state.img_signature)} /> }
                                            </div>
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
                    <div className="modal" id="ConfirmDeletePopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content"
                                style={{
                                    width: '25%',
                                    display: "flex",
                                    margin: "auto",
                                    marginTop: '15%',
                                }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ยืนยันการลบใช่หรือไม่ ?</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <div className="row">
                                        <div className="form-group col-md6" >
                                            <button type="button" className="btn btn-success" onClick={() => this.DeleteCustomerRenew(this.state.Del_Renew_ID)}>ตกลง</button>
                                            &nbsp;&nbsp;
                                            <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>

                <Row>
                    <div className="modal" id="HistoryStatus" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ประวัติการสถานะ</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="datatable">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>ลำดับ</th>
                                                    <th>สถานะ</th>
                                                    <th>สร้างโดย</th>
                                                    <th>วันที่สร้าง</th>
                                                </tr>
                                            </thead>
                                            <tbody> {this.renderShowHistoryStatus()} </tbody>
                                        </table>
                                    </div>
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

                <style>{"\
                    .table-img {\
                        max-width: 100%;\
                    }\
                    .table-pdf {\
                        max-width: 50%;\
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
                    width: 900px;\
                    margin: auto;\
                    }\
                    .responsefrm {\
                    max-width: 1250px;\
                    min-width: 720px;\
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
export default CustomerRenew;
