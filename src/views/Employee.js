import React from "react";
import axios from "axios";
import Select from 'react-select';
import { Container, Row } from "shards-react";
import { Activity, Download, Search } from 'react-feather';
import "react-table/react-table.css";
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
import moment from 'moment';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class Employee extends React.Component {

    async componentWillMount() {
        await this.GetDataCareCenter();
        await this.GetDataPermission();
        await this.GetDataCustomer();
        await this.GetAllDataEmployeeList(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }

    constructor(props) {
        super(props);
        this.state = {
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Employee',
            Permission: "",

            ListDataCareCenter: [],
            Service_Center: "",
            UserID: null,
            Username: "",
            Password: "",
            EmployeeCode: "",
            EmployeeName: "",
            EmployeeSurName: "",
            TelephoneNumber: "",
            MobileNumber: "",
            Email: "",
            ServiceLocation: "",
            EmployeeZipcode: "",
            Active: null,
            UserGroup: null,
            ListDataUserGroup: [],    
            ServiceDate: null,
            ServiceNumber: null,
            ServiceSummary: null,
            ServiceCharge: null,
            ServiceImage: [],
            ServiceStatus: null,
            MemberSignature: null,
            OfficerSignature: null,
            ContentData: [],
            ListData: [],
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
                    label: "UserID",
                    field: "username",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อ",
                    field: "employee_name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "โทรศัพท์",
                    field: "employee_tel",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "โทรศัพท์มือถือ",
                    field: "employee_phone",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "อีเมล",
                    field: "employee_email",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ศูนย์บริการ",
                    field: "employee_address",
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
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: ''});
        window.location.reload();
    }

    async GetAllDataEmployeeList(Page, PerPage, Search, StartDate, EndDate) {
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Employee/GetEmployeePerPage`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    // console.log(response.data);
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            // id: item.id,
                            username: item.username,
                            employee_name: item.employee_name,
                            // employee_surname: item.employee_surname,
                            employee_tel: item.employee_tel,
                            employee_phone: item.employee_phone,
                            employee_email: item.employee_email,
                            // employee_code: item.employee_code,
                            employee_address: item.employee_address,
                            is_Active: item.is_active === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button> : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>
                                ,
                            delete: this.state.Permission === "W" ?
                            <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.pro.id)}>
                                <img
                                    class="img-manage"
                                    src={require("../images/DeleteIcon.png")}
                                    alt="Delete"
                                />
                            </button> : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.pro.id)}>
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
            });
    }

    async ExportExcel(Search, StartDate, EndDate) {
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Employee/ExportExcel`, temp,
        {
            responseType: 'blob',
        }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataEmployee.xlsx")
                    document.body.appendChild(link)
                    link.click()
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataCustomer() {
        await axios
            .post(`${APIUrl}Employee/GetDataUserGroup`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var data = {
                            value: index.id,
                            label: index.groupname,
                            active: index.is_active
                        };
                        Temp.push(data);
                    });
                    this.setState({ ListDataUserGroup: Temp });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetDataCareCenter() {
        await axios
            .post(`${APIUrl}Employee/GetDataCareCenter`)
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

    async GetDataPermission() {
        await axios
            .post(`${APIUrl}Permission/GetDataPermission`)
            .then(response => {
                if (response.data.status == 0) {
                    var temp = response.data.data;
                    var Permission = temp.filter(x => x.user_group == this.state.User_Group && x.menu_name == this.state.menu_name.toLowerCase());
                    if(Permission.length > 0){
                        this.setState({ Permission: Permission[0].permission });
                    }                  
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async OpenEditPopup(id) {
        var data = id;
        await axios.post(`${APIUrl}Employee/GetDataEmployeeByID?ID=` + data)
            .then((response) => {
                if (response.data.status === 0) {
                    // console.log(response.data.data);
                    var Data = response.data.data;
                    var ug = this.state.ListDataUserGroup.filter(x => x.value == Data.usergroup);
                    var servicecent = this.state.ListDataCareCenter.filter(x => x.value == Data.servicecenter);
                    this.setState({
                        UserID: Data.id,
                        Username: Data.username,
                        Password: Data.password,
                        EmployeeCode: Data.employeeCode,
                        EmployeeName: Data.employeeName,
                        EmployeeSurName: Data.employeeSurName,
                        TelephoneNumber: Data.employeeTel,
                        MobileNumber: Data.employeePhone,
                        Email: Data.employeeEmail,
                        ServiceLocation: Data.employeeAddress,
                        EmployeeZipcode: Data.employeeZipcode,
                        Active: Data.is_Active === 1 ? "1" : "2",
                        UserGroup: ug.length > 0 ? {
                            value: ug[0].value,
                            label: ug[0].label
                        } : null,
                        Service_Center: servicecent.length > 0 ? {
                            varlue: servicecent[0].value,
                            label: servicecent[0].label
                        } : null
                    });
                }
            }).catch(err => console.log(err));
    }

    AddDataEmployee = event => {
        event.preventDefault();
        const Tempdata = {
            //ID: parseInt(this.state.UserID),
            Username: this.state.Username,
            Password: this.state.Password,
            Employee_Code: this.state.EmployeeCode,
            Employee_Name: this.state.EmployeeName,
            Employee_Surname: this.state.EmployeeSurName,
            Employee_Tel: this.state.TelephoneNumber,
            Employee_Phone: this.state.MobileNumber,
            Employee_Email: this.state.Email,
            Employee_Address: this.state.ServiceLocation,
            Employee_ZIP_Code: this.state.EmployeeZipcode,
            UserGroup: this.state.UserGroup.value,
            ServiceCenter: this.state.Service_Center.value,
            Is_Active: 1
        };
        axios.post(`${APIUrl}Employee/AddDataEmployee`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    EditDataEmployee = event => {
        event.preventDefault();
        const Tempdata = {
            ID: parseInt(this.state.UserID),
            Username: this.state.Username,
            Password: this.state.Password,
            Employee_Code: this.state.EmployeeCode,
            Employee_Name: this.state.EmployeeName,
            Employee_Surname: this.state.EmployeeSurName,
            Employee_Tel: this.state.TelephoneNumber,
            Employee_Phone: this.state.MobileNumber,
            Employee_Email: this.state.Email,
            Employee_Address: this.state.ServiceLocation,
            Employee_ZIP_Code: this.state.EmployeeZipcode,
            Is_Active: parseInt(this.state.Active),
            UserGroup: this.state.UserGroup.value,
            ServiceCenter: this.state.Service_Center.value
        };
        axios.post(`${APIUrl}Employee/UpdateDataEmployee`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    async InActiveDataMenu() {
        var ID = parseInt(this.state.UserID);
        await axios.post(`${APIUrl}Employee/DeleteEmployee?ID=` + ID)
            .then(response => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
                else {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
    }

    ChangeCustomerData = data => {
        this.setState({ Service_Center: data });        
    };

    SetDataUserGroup = value => {
        this.setState({ UserGroup: value });    
    };

    SetInActiveID(val) {
        this.setState({ UserID: val });
    }

    SetDataUsername = event => {
        this.setState({ Username: event.target.value });
    };

    SetDataPassword = event => {
        this.setState({ Password: event.target.value });
    };

    SetDataEmployeeCode = event => {
        this.setState({ EmployeeCode: event.target.value });
    };

    SetDataEmployeeName = event => {
        this.setState({ EmployeeName: event.target.value });
    };

    SetDataEmployeeSurName = event => {
        this.setState({ EmployeeSurName: event.target.value });
    };

    SetDataTelephoneNumber = event => {
        this.setState({ TelephoneNumber: event.target.value });
    };

    SetDataMobileNumber = event => {
        this.setState({ MobileNumber: event.target.value });
    };

    SetDataEmail = event => {
        this.setState({ Email: event.target.value });
    };

    SetDataServiceLocation = event => {
        this.setState({ ServiceLocation: event.target.value });
    };

    SetDataEmployeeZipcode = event => {
        this.setState({ EmployeeZipcode: event.target.value });
    };

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }
    
    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetAllDataEmployeeList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllDataEmployeeList(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataEmployeeList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataEmployeeList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataEmployeeList(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

    render() {
        return (
            <Container fluid className="main-content-container container-boom px-0">
                <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div class="container">
                        <div class="page-header-content pt-4">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto mt-4">
                                    <h1 class="page-header-title">
                                        <div class="page-header-icon"><Activity /></div>
                                Manage Employee
                            </h1>
                                    <div class="page-header-subtitle">จัดการข้อมูลพนักงาน</div>
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
                                        <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button> : 
                                        <button class="btn btn-block btn-success" disabled type="button" style={{ width: '25%' }} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button>}
                                    </div>
                                    <div className="col-md-6">
                                        <div class="float-right">
                                                {this.state.Permission === "W" ? 
                                                    <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }} onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}><Download />&nbsp; Export Excel</button> : 
                                                    <button class="btn btn-outline-info" disabled type="button" style={{ width: '100%' }}><Download />&nbsp; Export Excel</button>
                                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <MDBCardBody>
                                    <div className="row">
                                        <div className="form-group col-md-1">
                                            <div class="float-left">
                                                <select className="custom-select custom-select-sm form-control form-control-sm" style={{ width: '5rem'}}
                                                    value={this.state.PerPage}
                                                    onChange={this.ChangePerPage}
                                                >
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="15">15</option>
                                                    <option value="20">20</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3">
                                            </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2rem'}}>
                                            <label className="small mb-1" style={{ whiteSpace: 'nowrap'}} >วันเดือนปีที่ลงทะเบียน</label>
                                            <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem'}}>
                                            <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem'}}>
                                            <input
                                                class="form-control form-control-sm"
                                                type="text"
                                                placeholder="Search"
                                                aria-label="Search"
                                                value={this.state.Search}
                                                onChange={this.ChangeSearch}
                                                onKeyPress={this.EnterSearch}
                                            />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem'}} >
                                        <div className="row">
                                                    <div className="col-md-5">
                                            <button className="btn btn-success" onClick={() => this.GetAllDataEmployeeList(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                        
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
                                    <form class="responsefrm" onSubmit={this.AddDataEmployee}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสพนักงาน</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeCode}
                                                    onChange={this.SetDataEmployeeCode}
                                                />
                                            </div>                                           
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อพนักงาน</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeName}
                                                    onChange={this.SetDataEmployeeName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">นามสกุล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeSurName}
                                                    onChange={this.SetDataEmployeeSurName}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">เบอร์โทรศัพท์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.TelephoneNumber}
                                                    onChange={this.SetDataTelephoneNumber}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">มือถือ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.MobileNumber}
                                                    onChange={this.SetDataMobileNumber}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">อีเมล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Email}
                                                    onChange={this.SetDataEmail}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ที่อยู่</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ServiceLocation}
                                                    onChange={this.SetDataServiceLocation}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสไปรษณีย์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeZipcode}
                                                    onChange={this.SetDataEmployeeZipcode}
                                                />
                                            </div>
                                            
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">UserGroup</label>
                                                {/* <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.UserGroup}
                                                    onChange={this.SetDataUserGroup}
                                                /> */}
                                                <Select
                                                    value={this.state.UserGroup}
                                                    onChange={this.SetDataUserGroup}
                                                    options={this.state.ListDataUserGroup}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    value={this.state.Service_Center}
                                                    onChange={this.ChangeCustomerData}
                                                    options={this.state.ListDataCareCenter}
                                                />
                                            </div>                                           
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">UserName</label>
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
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
                                                <button type="submit" className="btn btn-warning" style={{ float: 'right' }}>บันทึก</button>
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
                                    <form class="responsefrm" onSubmit={this.EditDataEmployee}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสพนักงาน</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeCode}
                                                    onChange={this.SetDataEmployeeCode}
                                                />
                                            </div>                                           
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อพนักงาน</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeName}
                                                    onChange={this.SetDataEmployeeName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">นามสกุล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeSurName}
                                                    onChange={this.SetDataEmployeeSurName}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">เบอร์โทรศัพท์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.TelephoneNumber}
                                                    onChange={this.SetDataTelephoneNumber}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">มือถือ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.MobileNumber}
                                                    onChange={this.SetDataMobileNumber}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">อีเมล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Email}
                                                    onChange={this.SetDataEmail}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ที่อยู่</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ServiceLocation}
                                                    onChange={this.SetDataServiceLocation}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสไปรษณีย์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.EmployeeZipcode}
                                                    onChange={this.SetDataEmployeeZipcode}
                                                />
                                            </div>
                                            
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">UserGroup</label>
                                                {/* <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.UserGroup}
                                                    onChange={this.SetDataUserGroup}
                                                /> */}
                                                <Select
                                                    value={this.state.UserGroup}
                                                    onChange={this.SetDataUserGroup}
                                                    options={this.state.ListDataUserGroup}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ศูนย์บริการ</label>
                                                <Select
                                                    value={this.state.Service_Center}
                                                    onChange={this.ChangeCustomerData}
                                                    options={this.state.ListDataCareCenter}
                                                />
                                            </div>                                           
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">UserName</label>
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
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
                                                <button type="submit" className="btn btn-warning" style={{ float: 'right' }}>อัพเดต</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="modal" id="InActiveDataModalPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ต้องการที่จะลบหรือไม่ ?</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="form-group col-md6">
                                            <button type="button" className="btn btn-success" style={{ marginLeft: '361px' }} onClick={() => this.InActiveDataMenu()}>ตกลง</button>
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

        );
    }
}
export default Employee;
