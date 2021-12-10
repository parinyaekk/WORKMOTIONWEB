import React from "react";
import axios from "axios";
import Select from 'react-select';
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
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
// import { Link } from "react-router-dom";
import { Activity, Download, Search } from 'react-feather';
import LoadingOverlay from "react-loading-overlay";
import moment from 'moment';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;
class ServiceInformation extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetDataCareCenter();
        await this.GetDataProvince();
        await this.GetDataDistrict();
        await this.GetDataSubDistrict();
        await this.GetDataCustomer();
        await this.GetAllDataInformationList(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Service Membership Information',
            Permission: "",
            DistrictList: [],
            SubDistrictList: [],
            ProvinceList: [],
            SearchCareArea: null,
            SearchCustomerType: null,
            ID: 0,
            Customer_Tel: "",
            Customer_Phone: "",
            Customer_SubDistrict: "",
            Customer_District: "",
            Customer_Province: "",
            ServiceTime: "",
            ServiceSubject: "",
            ServiceStatusActive: null,
            ServiceCount: null,
            ServiceStaff: "",
            Customer_Address: "",
            Customer_ID: null,
            Service_Center: "",
            ServiceDate: null,
            ServiceNumber: null,
            ServiceSummary: null,
            ServiceHistory: null,
            ServiceCharge: null,
            SpareCharge: null,
            ServiceImage: [],
            ServiceStatus: null,
            MemberSignature: null,
            OfficerSignature: null,
            ReceiptImage: null,
            ContentData: [],
            ListData: [],
            ListDataCustomerMain: [],
            ListDataCustomer: [],
            ListDataCareCenter: [],
            CustomerTypeStatus: [
                { value: -1, label: "ทั้งหมด" },
                { value: 1, label: "สมาชิกโครงการ" },
                { value: 2, label: "สมาชิกผู้รับเหมารายย่อย" },
                { value: 3, label: "สมาชิกบ้านพักอาศัย" },
            ],
            LangID: 1,
            data: {},
            Search: "",
            StartDateSearch: '',
            EndDateSearch: '',
            Page: 1,
            AllPage: 0,
            PerPage: 10,
            Previous_Status: "page-item disabled",
            Next_Status: "page-item ",
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "วัน/เดือน/ปี ที่สมัคร",
                    field: "regis_Date",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "วัน/เดือน/ปี ที่ต่ออายุ",
                    field: "renewdate",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ประเภทสมาชิก",
                    field: "customertype",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รหัสลูกค้า",
                    field: "customercode",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อที่จะระบุสมาชิกหรือผู้ติดต่อ (กรณีบุคคล)",
                    field: "customernameperson",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อที่จะระบุสมาชิก (กรณี บริษัท, โรงแรม, สำนักงาน, ฯลฯ)",
                    field: "customernamecompany",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "มือถือ",
                    field: "mobilenumber",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ที่อยู่ที่ติดตั้งสินค้า* (ไม่สามารถเปลี่ยนแปลงได้)",
                    field: "customer_Address",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "เขต/อำเภอ*",
                    field: "district",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ตำบล/แขวง*",
                    field: "subdistrict",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "จังหวัด*",
                    field: "province",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รหัสไปรษณีย์*",
                    field: "zipcode",
                    sort: "asc",
                    width: 150
                },
                // {
                //     label: "เลขที่บริการ",
                //     field: "service_Number",
                //     sort: "asc",
                //     width: 150
                // },
                // {
                //     label: "ชื่อลูกค้า",
                //     field: "customer_Name",
                //     sort: "asc",
                //     width: 150
                // },
                // {
                //     label: "ประเภท",
                //     field: "customer_Type",
                //     sort: "asc",
                //     width: 150
                // },
                // {
                //     label: "ที่อยู่",
                //     field: "customer_Address",
                //     sort: "asc",
                //     width: 150
                // },
                {
                    label: "ศูนย์บริการ",
                    field: "service_Center",
                    sort: "asc",
                    width: 150
                },
                // {
                //     label: "เจ้าหน้าที่บริการ",
                //     field: "service_Personnel",
                //     sort: "asc",
                //     width: 150
                // },
                {
                    label: "แผนที่",
                    field: "mapgps",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "วัน/เดือน/ปี ที่บริการ",
                    field: "servicedate",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ใบบริการ/ใบเสร็จหมายเลข",
                    field: "servicenumber",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "จำนวนครั้งบริการที่เหลือ",
                    field: "quotaservice",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "เจ้าหน้าที่บริการ",
                    field: "servicestaff",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "สถานะการบริการ",
                    field: "servicestatus",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ภาพหลักฐานใบบริการ",
                    field: "image",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ภาพใบเสร็จ",
                    field: "receiptimage",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "สถานะ",
                    field: "is_Active",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "แก้ไข",
                    field: "",
                    sort: "asc",
                    width: 150
                }, {
                    label: "ลบ",
                    field: "",
                    sort: "asc",
                    width: 150
                },
            ],
        };
        this.ClearDataInformation = this.ClearDataInformation.bind(this);
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchCustomerType: null });
        window.location.reload();
    }

    async GetAllDataInformationList(Page, PerPage, Search, StartDate, EndDate, CareAreaData, CustomerTypeData) {
        var _this = this;
        _this.setState({ loading: true });
        // console.log("GetAllDataInformationList");
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
            CustomerType: CustomerTypeData == null ? -1 : CustomerTypeData.value
            // CustomerType: CustomerTypeData == null ? null : parseInt(CustomerTypeData)
            // CustomerType: CustomerTypeData == null ? null : parseInt(CustomerTypeData)
        };
        await axios.post(`${APIUrl}ServiceInformation/GetAllDataInformationList`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            regis_Date: item.regis_Date,
                            renewdate: item.renewdate,
                            customertype: item.customertype == 1 ? "ลูกค้าโครงการ" : item.customertype == 2 ? "ลูกค้าผู้รับเหมารายย่อย" : "ลูกค้าบ้านพักอาศัย",
                            customercode: item.customercode,
                            customernameperson: item.customernameperson,
                            customernamecompany: item.customernamecompany,
                            mobilenumber: item.mobilenumber,
                            customer_Address: item.customer_Address,
                            district: item.district,
                            subdistrict: item.subdistrict,
                            province: item.province,
                            zipcode: item.zipcode,
                            //service_Number: item.service_Number,
                            //customer_Name: item.customer_Name,
                            // customer_Type: item.customer_Type,
                            //customer_Address: item.customer_Address,
                            service_Center: item.service_Center,
                            //service_Personnel: item.service_Personnel,
                            mapgps: item.mapgps,
                            servicedate: item.servicedate + " " + (item.servicetime == null ? "" : item.servicetime),
                            servicenumber: item.servicenumber,
                            quotaservice: item.quotaservice,
                            servicestaff: item.servicestaff,
                            servicestatus: item.servicestatus === 1 ? "นัดหมายใหม่" : item.servicestatus === 2 ? "อยู่ระหว่างดำเนินงาน" : item.servicestatus === 3 ? "เสร็จสิ้น" : "ยกเลิก",
                            image: item.image == null ? "No Image" : item.image.match('.pdf') == null ? 
                            <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + item.image}  onClick={() => window.open(`${APIImagePath}` + item.image)}/> : 
                            <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")}  onClick={() => window.open(`${APIImagePath}` + item.image)}/>,
                            receiptimage: item.receiptimage == null ? "No Image" : item.receiptimage.match('.pdf') == null ? 
                            <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + item.receiptimage}  onClick={() => window.open(`${APIImagePath}` + item.receiptimage)}/> : 
                            <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")}  onClick={() => window.open(`${APIImagePath}` + item.receiptimage)}/>,
                            is_Active: item.is_Active === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetDataInformationByID(item.id)} data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static">
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button> :
                                <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.GetDataInformationByID(item.id)} data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static">
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>
                            ,
                            delete: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDelete(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
                                    <img
                                        class="img-manage"
                                        src={require("../images/DeleteIcon.png")}
                                        alt="Delete"
                                    />
                                </button> :
                                <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.SetIdDelete(item.id)} data-toggle="modal" data-target="#ConfirmDeletePopup" data-backdrop="static">
                                    <img
                                        class="img-manage"
                                        src={require("../images/DeleteIcon.png")}
                                        alt="Delete"
                                    />
                                </button>
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.columns
                    };
                    this.setState({ ListData: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            })
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
            CustomerType: CustomerTypeData == null ? -1 : CustomerTypeData.value
        };
        await axios.post(`${APIUrl}ServiceInformation/ServiceInformationExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataServiceInformation.xlsx")
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

    async SaveDataInformation() {
        // console.log("GetAllDataInformationList");
        let TempServiceImage = [];
        this.state.ServiceImage.map((item) => {
            TempServiceImage.push(item.id);
        });

        let temp = {
            Customer_ID: this.state.Customer_ID.value,
            Customer_Address: this.state.Customer_ID.address,
            Service_Number: this.state.ServiceNumber,
            ServiceDate: this.state.ServiceDate,
            ServiceSummary: this.state.ServiceSummary,
            ServiceHistory: this.state.ServiceHistory,
            ServiceCharge: this.state.ServiceCharge,
            SpareCharge: this.state.SpareCharge,
            ServiceStatus: this.state.ServiceStatus,
            ServiceImage: TempServiceImage,
            MemberSignature: this.state.MemberSignature == null ? null : this.state.MemberSignature.id,
            OfficerSignature: this.state.OfficerSignature == null ? null : this.state.OfficerSignature.id,
            ReceiptImage: this.state.ReceiptImage == null ? null :this.state.ReceiptImage.id,
            Service_Personnel: localStorage.getItem('full_name'),
            Service_Center: this.state.Service_Center.label,
            ServiceTime: this.state.ServiceTime,
            ServiceSubject: this.state.ServiceSubject,
            ServiceStatusActive: this.state.ServiceStatusActive,
            ServiceCount: this.state.ServiceCount,
            ServiceStaff: this.state.ServiceStaff
        };
        await axios.post(`${APIUrl}ServiceInformation/SaveDataInformation`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
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
                    }
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataInformationByID(id) {
        await axios.post(`${APIUrl}ServiceInformation/GetDataInformationByID?ID=` + id)
            .then(response => {
                if (response.data.status == 0) {
                    let TempData = response.data.data;
                    var DataCustomer = this.state.ListDataCustomerMain.filter(x => x.value == parseInt(TempData.customer_ID));
                    var TempDataCustomer = this.state.ListDataCustomerMain.filter(x => x.service_Center == TempData.service_Center);
                    this.setState({ ListDataCustomer: TempDataCustomer });
                    var DataCareCenter = this.state.ListDataCareCenter.filter(x => x.label == TempData.service_Center);
                    var SubDistrict = "";
                    var District = "";
                    var Province = "";
                    if (DataCustomer[0].subdistrict != null && DataCustomer[0].district != null && DataCustomer[0].province != null) {
                        SubDistrict = this.state.SubDistrictList.filter(x => x.id == DataCustomer[0].subdistrict)[0].sub_District_Name;
                        District = this.state.DistrictList.filter(x => x.id == DataCustomer[0].district)[0].district_Name;
                        Province = this.state.ProvinceList.filter(x => x.id == DataCustomer[0].province)[0].province_Name;
                    }
                    else {
                        SubDistrict = "";
                        District = "";
                        Province = "";
                    }

                    this.setState({
                        ID: TempData.id,
                        ServiceNumber: TempData.service_Number,
                        // Customer_ID : DataCustomer,
                        Customer_ID: DataCustomer.length > 0 ? {
                            value: DataCustomer[0].value,
                            label: DataCustomer[0].label
                        } : null,

                        Customer_Tel: DataCustomer[0].telephone,
                        Customer_Phone: DataCustomer[0].mobilephone,
                        Customer_SubDistrict: SubDistrict,
                        Customer_District: District,
                        Customer_Province: Province,

                        ServiceTime: TempData.serviceTime,
                        ServiceSubject: TempData.serviceSubject,
                        ServiceStatusActive: TempData.is_Active === 1 ? "1" : "2",
                        ServiceCount: TempData.serviceCount === 1 ? "1" : "2",
                        ServiceStaff: TempData.serviceStaff,
                        // ServiceNumber : TempData.customer_Type,
                        Customer_Address: TempData.customer_Address,
                        //Service_Center : TempData.service_Center,
                        Service_Center: DataCareCenter.length > 0 ? {
                            value: DataCareCenter[0].value,
                            label: DataCareCenter[0].label
                        } : null,
                        // ServiceNumber : TempData.service_Personnel,
                        ServiceDate: TempData.serviceDate,
                        ServiceSummary: TempData.serviceSummary,
                        ServiceHistory: TempData.serviceHistory,
                        ServiceCharge: TempData.serviceCharge,
                        SpareCharge: TempData.spareCharge,
                        ServiceStatus: TempData.serviceStatus,
                        MemberSignature: TempData.fileMember_sig,
                        OfficerSignature: TempData.fileOfficer_sig,
                        ReceiptImage: TempData.receipt_Image,
                    });

                    let TempFile = [];
                    TempData.file.map((item) => {
                        var Temp = {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            path: item.path,
                            service_type: item.service_type
                        };
                        TempFile.push(Temp);
                    });
                    this.setState({ ServiceImage: TempFile });

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataProvince() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetProvince`)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ ProvinceList: response.data.data });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataDistrict() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetDistrict`)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ DistrictList: response.data.data });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataSubDistrict() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetSubDistrict`)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ SubDistrictList: response.data.data });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataCareCenter() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetDataCareCenter`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
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

    async GetDataCustomer() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetDataCustomer`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var data = {
                            value: index.id,
                            //label: index.id + " " + (index.customer_Surname === "" ? index.customer_Name : index.customer_Name + " " + index.customer_Surname),
                            label: index.customer_Code + "  " + (index.customer_Surname === "" ? index.customer_Name : index.customer_Name + " " + index.customer_Surname),
                            address: index.customer_Address,
                            telephone: index.customer_Tel,
                            mobilephone: index.customer_Phone,
                            district: index.fK_District_ID,
                            subdistrict: index.fK_Sub_District_ID,
                            province: index.fK_Province_ID,
                            service_Center: index.service_Center
                        };
                        Temp.push(data);
                    });
                    this.setState({ ListDataCustomer: Temp });
                    this.setState({ ListDataCustomerMain: Temp });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    ChangeCustomerData = data => {
        this.setState({ Service_Center: data });
        if (data != null && data != "") {
            var tempData = null;
            if (data.label != null && data.label != "" && data.label != "ทั้งหมด") {
                tempData = this.state.ListDataCustomerMain.filter(x => x.service_Center == data.label);
            }
            else {
                tempData = this.state.ListDataCustomerMain;
            }
            this.setState({ ListDataCustomer: tempData });
        }
    };

    ChangeCustomer = cus => {
        this.setState({ Customer_ID: cus });
        this.setState({ Customer_Address: cus.address });
        this.setState({ Customer_Tel: cus.telephone });
        this.setState({ Customer_Phone: cus.mobilephone });
        this.setState({ Customer_SubDistrict: this.state.SubDistrictList.filter(x => x.id == cus.subdistrict)[0].sub_District_Name });
        this.setState({ Customer_District: this.state.DistrictList.filter(x => x.id == cus.district)[0].district_Name });
        this.setState({ Customer_Province: this.state.ProvinceList.filter(x => x.id == cus.province)[0].province_Name });
    };

    async EditSaveDataInformation() {
        // console.log("GetAllDataInformationList");
        let TempServiceImage = [];
        this.state.ServiceImage.map((item) => {
            TempServiceImage.push(item.id);
        });

        let temp = {
            ID: this.state.ID,
            Customer_ID: this.state.Customer_ID == null ? null : this.state.Customer_ID.value,
            Customer_Address: this.state.Customer_Address,
            Service_Number: this.state.ServiceNumber,
            ServiceDate: this.state.ServiceDate,
            ServiceSummary: this.state.ServiceSummary,
            ServiceHistory: this.state.ServiceHistory,
            ServiceCharge: this.state.ServiceCharge,
            SpareCharge: this.state.SpareCharge,
            ServiceStatus: this.state.ServiceStatus,
            ServiceImage: TempServiceImage,
            MemberSignature: this.state.MemberSignature == null ? null : this.state.MemberSignature.id,
            ReceiptImage: this.state.ReceiptImage == null ? null : this.state.ReceiptImage.id,
            OfficerSignature: this.state.OfficerSignature == null ? null : this.state.OfficerSignature.id,
            Service_Personnel: localStorage.getItem('full_name'),
            Service_Center: this.state.Service_Center.label,
            ServiceTime: this.state.ServiceTime,
            ServiceSubject: this.state.ServiceSubject,
            ServiceStatusActive: this.state.ServiceStatusActive,
            ServiceCount: this.state.ServiceCount,
            ServiceStaff: this.state.ServiceStaff
        };
        await axios.post(`${APIUrl}ServiceInformation/EditSaveDataInformation`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
                else
                {
                    alert(response.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    ClearDataInformation() {
        this.setState({
            ID: 0,
            ServiceNumber: "",
            ServiceDate: "",
            ServiceSummary: "",
            ServiceHistory: "",
            ServiceCharge: "",
            ServiceStatus: "",
            ServiceImage: [],
            MemberSignature: "",
            OfficerSignature: "",
            ReceiptImage: "",
            Customer_Tel: "",
            Customer_Phone: "",
            Customer_SubDistrict: "",
            Customer_District: "",
            Customer_Province: "",
            ListDataCustomer: [],
            Customer_Address: "",
            Customer_ID: null,
            Service_Center: "",
        });
        this.forceUpdate();
    };

    SetIdDelete(id) {
        this.setState({ ID: id });
    }

    async DeleteData(val) {
        var temp = {
            ID: val
        };
        await axios.post(`${APIUrl}ServiceInformation/DeleteDataInformation`, temp)
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

    setStateServiceTime = event => {
        this.setState({ ServiceTime: event.target.value });
    };

    setStateServiceSubject = event => {
        this.setState({ ServiceSubject: event.target.value });
    };

    setStateServiceStatusActive = event => {
        this.setState({ ServiceStatusActive: event.target.value });
    };

    setStateServiceCount = event => {
        this.setState({ ServiceCount: event.target.value });
    };

    setStateServiceStaff = event => {
        this.setState({ ServiceStaff: event.target.value });
    };

    setStateCustomer_Name = event => {
        this.setState({ Customer_Name: event.target.value });
    };

    setStateCustomer_Address = event => {
        this.setState({ Customer_Address: event.target.value });
    };

    setStateService_Center = event => {
        this.setState({ Service_Center: event.target.value });
    };

    setStateServiceDate = event => {
        this.setState({ ServiceDate: event.target.value });
    };

    setStateServiceNumber = event => {
        this.setState({ ServiceNumber: event.target.value });
    };

    setStateServiceSummary = event => {
        this.setState({ ServiceSummary: event.target.value });
    };

    setStateServiceHistory = event => {
        this.setState({ ServiceHistory: event.target.value });
    };

    setStateServiceCharge = event => {
        this.setState({ ServiceCharge: event.target.value });
    };

    setStateSpareCharge = event => {
        this.setState({ SpareCharge: event.target.value });
    };

    setStateServiceStatus = event => {
        this.setState({ ServiceStatus: event.target.value });
    };

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    onServiceImage = event => {
        this.SaveFile("ServiceImage", event.target.files[0]);
    };

    onMemberSignature = event => {
        this.SaveFile("MemberSignature", event.target.files[0]);
    };

    onReceiptImage = event => {
        this.SaveFile("ReceiptImage", event.target.files[0]);
    };

    onOfficerSignature = event => {
        this.SaveFile("OfficerSignature", event.target.files[0]);
    };

    ChangeSearchFilter = event => {
        // this.setState({ SearchCareArea: event.value });
        this.setState({ SearchCareArea: event });
        //this.GetAllDataInformationList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, event.label, this.state.SearchCustomerType);
    };

    ChangeSearchCustomerType = event => {
        this.setState({ SearchCustomerType: event });
        //.GetAllDataInformationList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, parseInt(event.target.value));
    };

    async SaveFile(val, file) {
        var _this = this;
        _this.setState({ loading: true });
        const data = new FormData();
        if (val == "ServiceImage") {
            data.append('service_image', file);
        }
        else if (val == "MemberSignature") {
            data.append('member_signature', file);
        }
        else if (val == "OfficerSignature") {
            data.append('officer_signature', file);
        }
        else if (val == "ReceiptImage") {
            data.append('Receipt_Image', file);
        }
        await axios.post(`${APIUrl}ServiceInformation/UploadFile`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status === 0) {
                    var Temp = {
                        id: response.data.data.id,
                        name: response.data.data.file_name,
                        type: response.data.data.file_type,
                        path: response.data.data.file_path,
                        service_type: response.data.data.service_type
                    }
                    if (Temp.service_type == 1) {
                        this.state.ServiceImage.push(Temp);
                    }
                    else if (Temp.service_type == 2) {
                        this.setState({ MemberSignature: Temp });
                    }
                    else if (Temp.service_type == 3) {
                        this.setState({ OfficerSignature: Temp });
                    }
                    else if (Temp.service_type == 4) {
                        this.setState({ ReceiptImage: Temp });
                    }
                    $('#file').val('');
                    this.forceUpdate();
                }
            })
            .catch((err) => {
                alert(err);
            }).finally(function () {
                _this.setState({ loading: false });
            });
    };

    ChangeSort() {
        // console.log(this.state.ListDataProduct_SparepartTest);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetAllDataInformationList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllDataInformationList(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllDataInformationList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllDataInformationList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
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
        this.GetAllDataInformationList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType);
        this.forceUpdate();
    };

    renderPagination() {
        let page = []
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

            }
        }
        return page;
    };

    onFileDelete(value) {
        this.state.ServiceImage.splice(value, 1);
        this.forceUpdate();
    };

    renderTableFile() {
        return this.state.ServiceImage.map((item, index) => {
            // console.log(item.name);
            return (
                <tr key={index}>
                    <td>
                        {item.type.includes("image") ? 
                            item.path.match('.pdf') == null ? <img class="table-img" style={{cursor: 'pointer'}}  src={`${APIImagePath}` + item.path} onClick={() => window.open(`${APIImagePath}` + item.path)}/> :
                            <img class="table-img" style={{cursor: 'pointer'}}  src={require("../images/PDF.png")} onClick={() => window.open(`${APIImagePath}` + item.path)} />
                            : "No Image"}
                    </td>
                    <td>{item.name}</td>
                    <td onClick={() => this.onFileDelete(index)}>
                        <input type="button" value="ลบ" className="btn btn-danger" />
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
                        zIndex: "99999"
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
                                            Service Membership Information
                                        </h1>
                                        <div class="page-header-subtitle">จัดการข้อมูลการบริการสมาชิก</div>
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
                                                {this.state.Permission === "W" ?
                                                    <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} onClick={() => this.ClearDataInformation()} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button> :
                                                    <button class="btn btn-block btn-success" disabled type="button" style={{ width: '25%' }}>เพิ่มข้อมูล</button>}
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
                                    <MDBCardBody>
                                        <div className="row">
                                            <div className="form-group col-md-4"></div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2.3rem', marginBottom: '2.3rem' }}>
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    styles={customStyles}
                                                    value={this.state.SearchCareArea}
                                                    onChange={this.ChangeSearchFilter}
                                                    options={this.state.ListDataCareCenter}
                                                />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2.3rem', marginBottom: '2.3rem' }}>
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
                                            <div className="form-group col-md-3"></div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2rem' }}>
                                                <label className="small mb-1">วันเดือนปีที่ลงทะเบียน</label>
                                                <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-0.3rem' }}>
                                                <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-0.4rem' }}>
                                                <input
                                                    class="form-control form-control-sm ml-0 my-0"
                                                    type="text"
                                                    placeholder="Search"
                                                    aria-label="Search"
                                                    value={this.state.Search}
                                                    onChange={this.ChangeSearch}
                                                    onKeyPress={this.EnterSearch}
                                                />
                                            </div>
                                            <div className="col-md-2" style={{ marginTop: '-0.4rem' }}>
                                            <div className="row">
                                                    <div className="col-md-5">
                                                <button className="btn btn-success" onClick={() => this.GetAllDataInformationList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea, this.state.SearchCustomerType)}>ค้นหา</button>
                                                        &nbsp;
                                                    </div>
                                                    <div className="col-md-5">
                                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ListData.columns} />
                                            <MDBTableBody rows={this.state.ListData.rows} />
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
                        <div className="modal" id="AddModalPopup" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูล</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form class="responsefrm">
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">วัน/เดือน/ปี (ที่บริการ)</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="date" value={this.state.ServiceDate}
                                                        placeholder="dd/mm/yyyy"
                                                        onChange={this.setStateServiceDate}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ศูนย์บริการ</label>
                                                    <Select
                                                        value={this.state.Service_Center}
                                                        onChange={this.ChangeCustomerData}
                                                        options={this.state.ListDataCareCenter}
                                                    />
                                                    {/* <input 
                                                    className="form-control py-1" 
                                                    type="text"
                                                    value={this.state.Service_Center}
                                                    onChange={this.setStateService_Center}
                                                /> */}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ใบบริการ/ใบเสร็จหมายเลข</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceNumber}
                                                        onChange={this.setStateServiceNumber}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เวลานัดหมาย</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        placeholder="HH : mm"
                                                        value={this.state.ServiceTime}
                                                        onChange={this.setStateServiceTime}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รหัสลูกค้า</label>
                                                    {/* <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Customer_Name}
                                                    onChange={this.setStateCustomer_Name}
                                                /> */}
                                                    <Select
                                                        value={this.state.Customer_ID}
                                                        onChange={this.ChangeCustomer}
                                                        options={this.state.ListDataCustomer}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ที่อยู่</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Address}
                                                        onChange={this.setStateCustomer_Address}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">โทรศัพท์</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Tel}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">มือถือ</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Phone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ตำบล</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_SubDistrict}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อำเภอ</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_District}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">จังหวัด</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Province}
                                                    />
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เรื่อง</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceSubject}
                                                        onChange={this.setStateServiceSubject}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เจ้าหน้าที่บริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceStaff}
                                                        onChange={this.setStateServiceStaff}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">สรุปการบริการ</label>
                                                    <textarea
                                                        class="form-control"
                                                        value={this.state.ServiceSummary}
                                                        onChange={this.setStateServiceSummary}
                                                        rows="3"
                                                    >
                                                    </textarea>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">การนับจำนวนครั้งบริการ</label>
                                                    {/* <input
                                                    className="form-control py-1"
                                                    type="number"
                                                    value={this.state.ServiceCount}
                                                    onChange={this.setStateServiceCount}
                                                /> */}
                                                    <br></br>
                                                    <input
                                                        type="radio" name="นับจำนวนครั้งบริการ"
                                                        value={1}
                                                        checked={this.state.ServiceCount == "1"}
                                                        onChange={this.setStateServiceCount} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">นับจำนวนครั้งบริการ</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="ไม่นับจำนวนครั้งบริการ"
                                                        value={2}
                                                        checked={this.state.ServiceCount == "2"}
                                                        onChange={this.setStateServiceCount} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ไม่นับจำนวนครั้งบริการ</label>
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ประวัติการบริการ</label>
                                                    <textarea
                                                        class="form-control"
                                                        value={this.state.ServiceHistory}
                                                        onChange={this.setStateServiceHistory}
                                                        rows="3"
                                                    >
                                                    </textarea>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อัพโหลดรูปภาพ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onServiceImage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                        <thead>
                                                            <tr>
                                                                <th>รูปตัวอย่าง</th>
                                                                <th>ชื่อไฟล์</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.renderTableFile()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">ค่าบริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceCharge}
                                                        onChange={this.setStateServiceCharge}
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">ค่าอะไหล่</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.SpareCharge}
                                                        onChange={this.setStateSpareCharge}
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">สถานะ</label>
                                                    <br></br>
                                                    <input
                                                        type="radio" name="Active"
                                                        value={1}
                                                        checked={this.state.ServiceStatusActive == "1"}
                                                        onChange={this.setStateServiceStatusActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">Active</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="InActive"
                                                        value={2}
                                                        checked={this.state.ServiceStatusActive == "2"}
                                                        onChange={this.setStateServiceStatusActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">InActive</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {/* <div className="form-group col-md-1" style={{paddingTop:'3px'}} >
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div> */}
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="radio" name="นัดหมายใหม่"
                                                        value={1}
                                                        checked={this.state.ServiceStatus == "1"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">นัดหมายใหม่</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="อยู่ระหว่างดำเนินงาน"
                                                        value={2}
                                                        checked={this.state.ServiceStatus == "2"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">อยู่ระหว่างดำเนินงาน</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="เสร็จสิ้น"
                                                        value={3}
                                                        checked={this.state.ServiceStatus == "3"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">เสร็จสิ้น</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="ยกเลิก"
                                                        value={4}
                                                        checked={this.state.ServiceStatus == "4"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ยกเลิก</label>
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ภาพใบบริการ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onMemberSignature}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ภาพใบเสร็จ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onReceiptImage}
                                                    />
                                                </div>
                                                {/* <div className="form-group col-md-6">
                                                <label className="small mb-1">เจ้าหน้าที่บริการ</label>
                                                <br></br>
                                                <input 
                                                    type="file" 
                                                    id="file" 
                                                    class="form-control-file" 
                                                    onChange={this.onOfficerSignature} 
                                                />
                                            </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-11">
                                                    <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
                                                    <button type="button" className="btn btn-success" style={{ float: 'right' }} onClick={() => this.SaveDataInformation()}>เพิ่มข้อมูล</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>

                    <Row>
                        <div className="modal" id="EditModalPopup" role="dialog" aria-hidden="true">
                            <div className="AddModal-dialog">
                                <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                    <div className="modal-header">
                                        <h3 style={{ fontSize: '25px' }}>แก้ไขข้อมูล</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form class="responsefrm">
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">วัน/เดือน/ปี (ที่บริการ)</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="date" value={this.state.ServiceDate}
                                                        placeholder="dd/mm/yyyy"
                                                        onChange={this.setStateServiceDate}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ศูนย์บริการ</label>
                                                    <Select
                                                        value={this.state.Service_Center}
                                                        onChange={this.ChangeCustomerData}
                                                        options={this.state.ListDataCareCenter}
                                                    />
                                                    {/* <input 
                                                    className="form-control py-1" 
                                                    type="text"
                                                    value={this.state.Service_Center}
                                                    onChange={this.setStateService_Center}
                                                /> */}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ใบบริการ/ใบเสร็จหมายเลข</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceNumber}
                                                        onChange={this.setStateServiceNumber}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เวลานัดหมาย</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        placeholder="HH : mm"
                                                        value={this.state.ServiceTime}
                                                        onChange={this.setStateServiceTime}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ชื่อลูกค้า</label>
                                                    {/* <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Customer_Name}
                                                    onChange={this.setStateCustomer_Name}
                                                /> */}
                                                    <Select
                                                        value={this.state.Customer_ID}
                                                        onChange={this.ChangeCustomer}
                                                        options={this.state.ListDataCustomer}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ที่อยู่</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Address}
                                                        onChange={this.setStateCustomer_Address}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">โทรศัพท์</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Tel}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">มือถือ</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Phone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ตำบล</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_SubDistrict}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อำเภอ</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_District}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">จังหวัด</label>
                                                    <input
                                                        disabled
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.Customer_Province}
                                                    />
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เรื่อง</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceSubject}
                                                        onChange={this.setStateServiceSubject}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เจ้าหน้าที่บริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceStaff}
                                                        onChange={this.setStateServiceStaff}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">สรุปการบริการ</label>
                                                    <textarea
                                                        class="form-control"
                                                        value={this.state.ServiceSummary}
                                                        onChange={this.setStateServiceSummary}
                                                        rows="3"
                                                    >
                                                    </textarea>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">การนับจำนวนครั้งบริการ</label>
                                                    <br></br>
                                                    <input
                                                        type="radio" name="นับจำนวนครั้งบริการ"
                                                        value={1}
                                                        checked={this.state.ServiceCount == "1"}
                                                        onChange={this.setStateServiceCount} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">นับจำนวนครั้งบริการ</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="ไม่นับจำนวนครั้งบริการ"
                                                        value={2}
                                                        checked={this.state.ServiceCount == "2"}
                                                        onChange={this.setStateServiceCount} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ไม่นับจำนวนครั้งบริการ</label>
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ประวัติการบริการ</label>
                                                    <textarea
                                                        class="form-control"
                                                        value={this.state.ServiceHistory}
                                                        onChange={this.setStateServiceHistory}
                                                        rows="3"
                                                    >
                                                    </textarea>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">อัพโหลดรูปภาพ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onServiceImage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                        <thead>
                                                            <tr>
                                                                <th>รูปตัวอย่าง</th>
                                                                <th>ชื่อไฟล์</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.renderTableFile()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">ค่าบริการ</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.ServiceCharge}
                                                        onChange={this.setStateServiceCharge}
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">ค่าอะไหล่</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.SpareCharge}
                                                        onChange={this.setStateSpareCharge}
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">สถานะ</label>
                                                    <br></br>
                                                    <input
                                                        type="radio" name="Active"
                                                        value={1}
                                                        checked={this.state.ServiceStatusActive == "1"}
                                                        onChange={this.setStateServiceStatusActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">Active</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="InActive"
                                                        value={2}
                                                        checked={this.state.ServiceStatusActive == "2"}
                                                        onChange={this.setStateServiceStatusActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">InActive</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {/* <div className="form-group col-md-1" style={{paddingTop:'3px'}} >
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div> */}
                                                <div className="form-group col-md-6">
                                                    <input
                                                        type="radio" name="นัดหมายใหม่"
                                                        value={1}
                                                        checked={this.state.ServiceStatus == "1"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">นัดหมายใหม่</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="อยู่ระหว่างดำเนินงาน"
                                                        value={2}
                                                        checked={this.state.ServiceStatus == "2"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">อยู่ระหว่างดำเนินงาน</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="เสร็จสิ้น"
                                                        value={3}
                                                        checked={this.state.ServiceStatus == "3"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">เสร็จสิ้น</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="ยกเลิก"
                                                        value={4}
                                                        checked={this.state.ServiceStatus == "4"}
                                                        onChange={this.setStateServiceStatus} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ยกเลิก</label>
                                                </div>
                                            </div>
                                            {/* <br></br> */}
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ภาพใบบริการ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onMemberSignature}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ภาพใบเสร็จ</label>
                                                    <br></br>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        class="form-control-file"
                                                        onChange={this.onReceiptImage}
                                                    />
                                                </div>
                                                {/* <div className="form-group col-md-6">
                                                <label className="small mb-1">เจ้าหน้าที่บริการ</label>
                                                <br></br>
                                                <input 
                                                    type="file" 
                                                    id="file" 
                                                    class="form-control-file" 
                                                    onChange={this.onOfficerSignature} 
                                                />
                                            </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    {/* {this.state.MemberSignature != null ? <img class="table-img" src={`${APIImagePath}` + this.state.MemberSignature.path} /> : "No Image"} */}
                                                    {this.state.MemberSignature != null ? 
                                                        this.state.MemberSignature.path == null ? "No Image" : this.state.MemberSignature.path.match('.pdf') == null ? 
                                                            <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + this.state.MemberSignature.path}  onClick={() => window.open(`${APIImagePath}` + this.state.MemberSignature.path)} /> :
                                                            <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")}  onClick={() => window.open(`${APIImagePath}` + this.state.MemberSignature.path)} />
                                                    : "No Image"}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    {/* {this.state.ReceiptImage != null ? <img class="table-img" src={`${APIImagePath}` + this.state.ReceiptImage.path} /> : "No Image"} */}
                                                    {this.state.ReceiptImage != null ? 
                                                        this.state.ReceiptImage.path == null ? "No Image" : this.state.ReceiptImage.path.match('.pdf') == null ? 
                                                            <img class="table-img" style={{cursor: 'pointer'}} src={`${APIImagePath}` + this.state.ReceiptImage.path}  onClick={() => window.open(`${APIImagePath}` + this.state.ReceiptImage.path)} /> :
                                                            <img class="table-img" style={{cursor: 'pointer'}} src={require("../images/PDF.png")}  onClick={() => window.open(`${APIImagePath}` + this.state.ReceiptImage.path)} />
                                                    : "No Image"}
                                                </div>
                                                {/* <div className="form-group col-md-6">
                                                {this.state.OfficerSignature != null ? <img class="table-img" src={`${APIImagePath}` + this.state.OfficerSignature.path}/> : "No Image"}
                                            </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                                <div className="form-group col-md-3">
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-11">
                                                    <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
                                                    <button type="button" className="btn btn-success" style={{ float: 'right' }} onClick={() => this.EditSaveDataInformation()}>บันทึก</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        <div className="row">
                                            <div className="form-group col-md6">
                                                <button type="button" className="btn btn-success" style={{ marginLeft: '361px' }} onClick={() => this.DeleteData(this.state.ID)}>ตกลง</button>
                                                &nbsp;&nbsp;
                                                <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <style>{"\
                    .table-img {\
                        width: 200px;\
                    }\
                    table.dataTable {\
                    display: inline-table;\
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
export default ServiceInformation;
