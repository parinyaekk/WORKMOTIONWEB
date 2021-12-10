import React from "react";
import axios from "axios";
import Select from 'react-select';
import { Container, Row, Breadcrumb, BreadcrumbItem, Nav, NavItem, NavLink } from "shards-react";
import { Activity, Download } from 'react-feather';
import "react-table/react-table.css";
import "../MainConfig";
import $ from "jquery";
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
import LoadingOverlay from "react-loading-overlay";
import moment from 'moment';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class Complacence extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetDataCareCenter();
        await this.GetAllDataSatisfactionAmericanStandard(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Satisfaction',
            Permission: "",
            SearchCareArea: null,
            ListDataCareCenter: [],
            Search: "",
            StartDateSearch: '',
            EndDateSearch: '',

            FlagCheckTab: true,
            ListDataAmericanStandard: [],
            ListDataCustomer: [],
            LangID: 1,
            data: {},
            Search: "",
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
                    label: "วัน/เดือน/ปี ที่ลงทะเบียน",
                    field: "createdate",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อ",
                    field: "customername",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "นามสกุล",
                    field: "customersurname",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "โทรศัพท์มือถือ",
                    field: "tel",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รหัสสินค้า",
                    field: "product_code",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "วันเดือนปีที่ซื้อ",
                    field: "warranty_date",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "จังหวัดที่ซื้อ",
                    field: "province_name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อร้านตัวแทนจำหน่าย",
                    field: "store_name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ศูนย์บริการสาขา",
                    field: "servicecenter",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ระดับความพึงพอใจ",
                    field: "score",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ข้อเสนอแนะ",
                    field: "feedback",
                    sort: "asc",
                    width: 150
                },
            ],
            columnsCustomer: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "วันเดือนปี ที่บริการ",
                    field: "servicedate",
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
                    label: "ชื่อลูกค้า",
                    field: "customername",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "นามสกุล",
                    field: "customersurename",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "เบอร์โทร",
                    field: "tel",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "เจ้าหน้าที่บริการ",
                    field: "serviceStaff",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ศูนย์บริการ",
                    field: "servicecenter",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ใบบริการ/ใบเสร็จหมายเลข",
                    field: "receiptnumber",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ค่าบริการ",
                    field: "servicecharge",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ค่าอะไหล่",
                    field: "sparecharge",
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
                    label: "ระดับความพึงพอใจ",
                    field: "score",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ข้อเสนอแนะ",
                    field: "feedback",
                    sort: "asc",
                    width: 150
                },
            ],
        };
    }

    async GetAllDataSatisfactionAmericanStandard(Page, PerPage, Search, StartDate, EndDate, CareAreaData) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
        };
        await axios.post(`${APIUrl}Satisfaction/GetAllDataSatisfactionAmericanStandard`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            createdate: item.createdate,
                            customername: item.customername,
                            customersurname: item.customersurname,
                            tel: item.tel,
                            product_code: item.product_code,
                            warranty_date: item.warranty_date,
                            province_name: item.province_name,
                            store_name: item.store_name,
                            servicecenter: item.servicecenter,
                            score: item.score,
                            feedback: item.feedback,
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.columns
                    };
                    this.setState({ ListDataAmericanStandard: dataTable });
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

    async GetAllDataSatisfactionCustomer(Page, PerPage, Search, StartDate, EndDate, CareAreaData) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label,
        };
        await axios.post(`${APIUrl}Satisfaction/GetAllDataSatisfactionCustomer`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(_this.state.PerPage));
                    _this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((_this.state.Page - 1) * _this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            servicedate: item.servicedate,
                            customercode: item.customercode,
                            customername: item.customername,
                            customersurename: item.customersurename,
                            tel: item.tel,
                            serviceStaff: item.serviceStaff,
                            servicecenter: item.servicecenter,
                            receiptnumber: item.receiptnumber,
                            servicecharge: item.servicecharge,
                            sparecharge: item.sparecharge,
                            quotaservice: item.quotaservice,
                            score: item.score,
                            feedback: item.feedback,
                        };
                        TempData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempData,
                        columns: this.state.columnsCustomer
                    };
                    this.setState({ ListDataCustomer: dataTable });
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


    async ExportExcel(Search, StartDate, EndDate,CareAreaData) {
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
            CareArea: CareAreaData == null ? null : CareAreaData.label
        };
        if (this.state.FlagCheckTab === true) {
            // this.GetAllDataSatisfactionAmericanStandard(1, event.target.value, this.state.Searc, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
            await axios.post(`${APIUrl}Satisfaction/ExportSatisfactionWaranntyExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataSatisfactionWarranty.xlsx")
                    document.body.appendChild(link)
                    link.click()
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            // this.GetAllDataSatisfactionCustomer(1, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
            await axios.post(`${APIUrl}Satisfaction/ExportSatisfactionServiceExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataSatisfactionService.xlsx")
                    document.body.appendChild(link)
                    link.click()
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
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

    async GetDataCareCenter() {
        await axios
            .post(`${APIUrl}ServiceInformation/GetDataCareCenter`)
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

    CheckTab(val) {
        if (val == 1) {
            this.setState({
                FlagCheckTab: true,
                Search: "",
                Page: 1,
                AllPage: 0,
                PerPage: 10,
            });
            this.forceUpdate();
            this.GetAllDataSatisfactionAmericanStandard(1, 10, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.setState({
                FlagCheckTab: false,
                Search: "",
                Page: 1,
                AllPage: 0,
                PerPage: 10,
            });
            this.forceUpdate();
            this.GetAllDataSatisfactionCustomer(1, 10, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
    };

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchCustomerType: null });
        this.forceUpdate();
    }

    searchtype(FlagCheckTab) {
        if (FlagCheckTab) {
            this.GetAllDataSatisfactionAmericanStandard(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.GetAllDataSatisfactionCustomer(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            if (this.state.FlagCheckTab === true) {
                this.GetAllDataSatisfactionAmericanStandard(1, event.target.value, this.state.Searc, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
            }
            else {
                this.GetAllDataSatisfactionCustomer(1, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
            }
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        if (this.state.FlagCheckTab === true) {
            this.GetAllDataSatisfactionAmericanStandard(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.GetAllDataSatisfactionCustomer(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
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
        if (this.state.FlagCheckTab === true) {
            this.GetAllDataSatisfactionAmericanStandard(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.GetAllDataSatisfactionCustomer(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
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

        if (this.state.FlagCheckTab === true) {
            this.GetAllDataSatisfactionAmericanStandard(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.GetAllDataSatisfactionCustomer(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
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
        if (this.state.FlagCheckTab === true) {
            this.GetAllDataSatisfactionAmericanStandard(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
        else {
            this.GetAllDataSatisfactionCustomer(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea);
        }
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

    ChangeSearchFilter = event => {
        this.setState({ SearchCareArea: event });
    };

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
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
                                            Manage Satisfaction
                                        </h1>
                                        <div class="page-header-subtitle">จัดการข้อมูลความพึงพอใจ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div style={{ marginTop: '14px', marginBottom: '-14px' }}>
                        <Nav tabs className="border-0 mt-auto mx-4 pt-2" type="dark" theme="primary" expand="md">
                            <NavItem>
                                {this.state.FlagCheckTab === true ?
                                    <NavLink active onClick={() => this.CheckTab(1)} className="active">ประเมินความพึงพอใจต่อสินค้าอเมริกันสแตนดาร์ด</NavLink> :
                                    <NavLink onClick={() => this.CheckTab(1)}>ประเมินความพึงพอใจต่อสินค้าอเมริกันสแตนดาร์ด</NavLink>}
                            </NavItem>
                            <NavItem>
                                {this.state.FlagCheckTab === true ?
                                    <NavLink onClick={() => this.CheckTab(2)}>ประเมินความพึงพอใจต่อการบริการสมาชิก</NavLink> :
                                    <NavLink active onClick={() => this.CheckTab(2)} className="active">ประเมินความพึงพอใจต่อการบริการสมาชิก</NavLink>}
                            </NavItem>
                        </Nav>
                    </div>
                    <MDBContainer className='mt-0' fluid responsive>
                        <MDBRow className='py-3'>
                            <MDBCol md='12'>
                                <MDBCard>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                                {this.state.FlagCheckTab === true ?
                                                    <h4>ประเมินความพึงพอใจต่อสินค้าอเมริกันสแตนดาร์ด</h4> :
                                                    <h4>ประเมินความพึงพอใจต่อการบริการสมาชิก</h4>
                                                }
                                            </div>
                                            <div className="col-md-6">
                                                <div class="float-right">
                                                    {this.state.Permission === "W" ?
                                                        <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }}
                                                            onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch, this.state.SearchCareArea)}><Download />&nbsp; Export Excel</button> :
                                                        <button class="btn btn-outline-info" disabled type="button" style={{ width: '100%' }}><Download />&nbsp; Export Excel</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <MDBCardBody>
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
                                            <div className="col-md-1">
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2rem' }}>
                                                <label className="small mb-1">วันเดือนปีที่ลงทะเบียน</label>
                                                <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-0.3rem' }}>
                                                <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-2.1rem' }}>
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    styles={customStyles}
                                                    value={this.state.SearchCareArea}
                                                    onChange={this.ChangeSearchFilter}
                                                    options={this.state.ListDataCareCenter}
                                                />
                                            </div>
                                            <div className="form-group col-md-2" style={{ marginTop: '-0.5rem' }}>
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
                                            <div className="col-md-2" style={{ marginTop: '-0.5rem' }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <button className="btn btn-success" onClick={() => this.searchtype(this.state.FlagCheckTab)}>ค้นหา</button>
                                                        &nbsp;
                                                    </div>
                                                    <div className="col-md-5">
                                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {this.state.FlagCheckTab === true ?
                                            <MDBTable responsive hover>
                                                <MDBTableHead columns={this.state.ListDataAmericanStandard.columns} />
                                                <MDBTableBody rows={this.state.ListDataAmericanStandard.rows} />
                                            </MDBTable> :
                                            <MDBTable responsive hover>
                                                <MDBTableHead columns={this.state.ListDataCustomer.columns} />
                                                <MDBTableBody rows={this.state.ListDataCustomer.rows} />
                                            </MDBTable>
                                        }
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
                    <style>{"\
        table.dataTable {\
          display: inline-table;\
        }\
        .active {\
            background-color: #d8d8d8;\
        }\
        .nav-link {\
            font-family: 'Kanit', sans-serif;\
            cursor: pointer !important;\
        }\
        .nav-link.active {\
            font-family: 'Kanit', sans-serif;\
            color: #ffffff !important;\
            background-color: #398BCE !important;\
            cursor: pointer !important;\
            font-size: 18px;\
            border-color: #398BCE !important;\
        }\
        .tab {\
            overflow: hidden;\
            border: 1px solid #ccc;\
            background-color: #f1f1f1;\
        }\
        .tab button {\
            background-color: inherit;\
            float: left;\
            border: none;\
            outline: none;\
            cursor: pointer;\
            padding: 14px 16px;\
            transition: 0.3s;\
        }\
        .tab button:hover {\
            background-color: #ddd;\
        }\
        .tab button.active {\
            background-color: #ccc;\
        }\
        .tabcontent {\
            display: none;\
            padding: 6px 12px;\
            border: 1px solid #ccc;\
            border-top: none;\
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
export default Complacence;
