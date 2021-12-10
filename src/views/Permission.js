import React from "react";
import axios from "axios";
import { Container, Row } from "shards-react";
import { Activity } from 'react-feather';
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
const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class Permission extends React.Component {

    async componentWillMount() {
        await this.GetDataPermissionPerPage(this.state.Page, this.state.PerPage, this.state.Search);
    }

    constructor(props) {
        super(props);
        this.state = {
            GroupID: null,
            GroupName: "",
            PermissionWarranty: null,
            PermissionMenu: null,
            PermissionContent: null,
            PermissionSparepartAndInstallation: null,
            PermissionModelSparepart: null,
            PermissionClassifiedSparepart: null,
            PermissionModelInstallation: null,
            PermissionClassifiedInstallation: null,
            PermissionManageProduct: null,
            PermissionMembershipRegistration: null,
            PermissionManageMembership: null,
            PermissionMembershipRenew: null,
            PermissionServiceMembershipInformation: null,
            PermissionManageEmployee: null,
            PermissionManageSatisfaction: null,

            MenuList: [],
            ListData: [],
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
                    label: "GroupName",
                    field: "groupname",
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
                },
                // {
                //     label: "ลบ",
                //     field: "",
                //     sort: "asc",
                //     width: 150
                // },
            ],
        };
    }

    async GetDataPermissionPerPage(Page, PerPage, Search) {
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search
        };
        await axios.post(`${APIUrl}Permission/GetDataPermissionList`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            groupame: item.groupName,
                            is_Active: item.is_Active === 1 ? "Active" : "InActive",
                            edit:
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id, item.groupName)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>,
                            // delete: <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.pro.id)}>
                            //     <img
                            //         class="img-manage"
                            //         src={require("../images/DeleteIcon.png")}
                            //         alt="Delete"
                            //     />
                            // </button>
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

    async OpenEditPopup(id, name) {
        var data = id;
        await this.GetAllMenu();
        this.setState({ GroupName: name });
        this.setState({ GroupID: id });
        await axios.post(`${APIUrl}Permission/GetDataPermissionByID?ID=` + data)
            .then((response) => {
                if (response.data.status === 0) {
                    // this.setState({ MenuList: response.data.data });
                    var Data = response.data.data;

                    response.data.data.forEach((item,index) => 
                    {
                        this.setState({ [item.fk_Menu_ID]: item.permission});
                        console.log(this.state);
                    })
                    // this.setState({ PermissionWarranty: (Data[0].permission == "W" ? "3" : Data[0].permission == "R" ? "2" : 1) });
                    // this.setState({ PermissionMenu: (Data[1].permission == "W" ? "3" : Data[1].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionContent: (Data[2].permission == "W" ? "3" : Data[2].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionSparepartAndInstallation: (Data[3].permission == "W" ? "3" : Data[3].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionModelSparepart: (Data[4].permission == "W" ? "3" : Data[4].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionClassifiedSparepart: (Data[5].permission == "W" ? "3" : Data[5].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionModelInstallation: (Data[6].permission == "W" ? 3 : Data[6].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionClassifiedInstallation: (Data[7].permission == "W" ? 3 : Data[7].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionManageProduct: (Data[8].permission == "W" ? 3 : Data[8].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionMembershipRegistration: (Data[9].permission == "W" ? 3 : Data[9].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionManageMembership: (Data[10].permission == "W" ? 3 : Data[10].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionMembershipRenew: (Data[11].permission == "W" ? 3 : Data[11].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionServiceMembershipInformation: (Data[12].permission == "W" ? 3 : Data[12].permission == "R" ? 2 : 1) });
                    // this.setState({ PermissionManageEmployee: (Data[13].permission == "W" ? "3" : Data[13].permission == "R" ? "2" : "1") });
                    // this.setState({ PermissionManageSatisfaction: (Data[14].permission == "W" ? "3" : Data[14].permission == "R" ? "2" : "1") });
                }
            }).catch(err => console.log(err));

    }

    async GetAllMenu() {
        await axios.post(`${APIUrl}Permission/GetAllMenu`)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ MenuList: response.data.data });
                }
            }).catch(err => console.log(err));
    }

    async AddPermissionToMenu() {
        // var test = [];
        var jsondata = '';
        this.state.MenuList.forEach((item,index) => 
        {
            // test.push({[item.id] : this.state[item.id]});
            if(typeof this.state[item.id] != 'undefined') 
            jsondata += [item.id] + "," + this.state[item.id] + "|";
        })
        // alert(test);
        await axios.post(`${APIUrl}Permission/AddPermissionMenu?GroupID=` + this.state.GroupID + `&jsondata=` + jsondata)
            .then(response => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
                else {
                    alert(response.data.message);
                    window.location.reload();
                }
            }).catch(err => console.log(err));
    }

    EditDataPermission = event => {
        event.preventDefault();
        const Tempdata = {
            ID: parseInt(this.state.GroupID),
            PermissionWarranty: (this.state.PermissionWarranty == "3" ? "W" : this.state.PermissionWarranty == "2" ? "R" : "-"),
            PermissionMenu: (this.state.PermissionMenu == "3" ? "W" : this.state.PermissionMenu == "2" ? "R" : "-"),
            PermissionContent: (this.state.PermissionContent == "3" ? "W" : this.state.PermissionContent == "2" ? "R" : "-"),
            PermissionSparepartAndInstallation: (this.state.PermissionSparepartAndInstallation == "3" ? "W" : this.state.PermissionSparepartAndInstallation == "2" ? "R" : "-"),
            PermissionModelSparepart: (this.state.PermissionModelSparepart == "3" ? "W" : this.state.PermissionModelSparepart == "2" ? "R" : "-"),
            PermissionClassifiedSparepart: (this.state.PermissionClassifiedSparepart == "3" ? "W" : this.state.PermissionClassifiedSparepart == "2" ? "R" : "-"),
            PermissionModelInstallation: (this.state.PermissionModelInstallation == "3" ? "W" : this.state.PermissionModelInstallation == "2" ? "R" : "-"),
            PermissionClassifiedInstallation: (this.state.PermissionClassifiedInstallation == "3" ? "W" : this.state.PermissionClassifiedInstallation == "2" ? "R" : "-"),
            PermissionManageProduct: (this.state.PermissionManageProduct == "3" ? "W" : this.state.PermissionManageProduct == "2" ? "R" : "-"),
            PermissionMembershipRegistration: (this.state.PermissionMembershipRegistration == "3" ? "W" : this.state.PermissionMembershipRegistration == "2" ? "R" : "-"),
            PermissionManageMembership: (this.state.PermissionManageMembership == "3" ? "W" : this.state.PermissionManageMembership == "2" ? "R" : "-"),
            PermissionMembershipRenew: (this.state.PermissionMembershipRenew == "3" ? "W" : this.state.PermissionMembershipRenew == "2" ? "R" : "-"),
            PermissionServiceMembershipInformation: (this.state.PermissionServiceMembershipInformation == "3" ? "W" : this.state.PermissionServiceMembershipInformation == "2" ? "R" : "-"),
            PermissionManageEmployee: (this.state.PermissionManageEmployee == "3" ? "W" : this.state.PermissionManageEmployee == "2" ? "R" : "-"),
            PermissionManageSatisfaction: (this.state.PermissionManageSatisfaction == "3" ? "W" : this.state.PermissionManageSatisfaction == "2" ? "R" : "-")
        };
        axios.post(`${APIUrl}Permission/UpdateDataPermission`, Tempdata)
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

    SetInActiveID(val) {
        this.setState({ UserID: val });
    }

    SetDataGroupName = event => {
        this.setState({ GroupName: event.target.value });
    };

    SetDataPermissionWarranty = event => {
        this.setState({ PermissionWarranty: event.target.value });
    };

    SetDataPermissionMenu = event => {
        this.setState({ PermissionMenu: event.target.value });
    };

    SetDataPermissionContent = event => {
        this.setState({ PermissionContent: event.target.value });
    };

    SetDataPermissionSparepartAndInstallation = event => {
        this.setState({ PermissionSparepartAndInstallation: event.target.value });
    };

    SetDataPermissionModelSparepart = event => {
        this.setState({ PermissionModelSparepart: event.target.value });
    };

    SetDataPermissionClassifiedSparepart = event => {
        this.setState({ PermissionClassifiedSparepart: event.target.value });
    };

    SetDataPermissionModelInstallation = event => {
        this.setState({ PermissionModelInstallation: event.target.value });
    };

    SetDataPermissionClassifiedInstallation = event => {
        this.setState({ PermissionClassifiedInstallation: event.target.value });
    };

    SetDataPermissionManageProduct = event => {
        this.setState({ PermissionManageProduct: event.target.value });
    };

    SetDataPermissionMembershipRegistration = event => {
        this.setState({ PermissionMembershipRegistration: event.target.value });
    };

    SetDataPermissionManageMembership = event => {
        this.setState({ PermissionManageMembership: event.target.value });
    };

    SetDataPermissionMembershipRenew = event => {
        this.setState({ PermissionMembershipRenew: event.target.value });
    };

    SetDataPermissionServiceMembershipInformation = event => {
        this.setState({ PermissionServiceMembershipInformation: event.target.value });
    };

    SetDataPermissionManageEmployee = event => {
        this.setState({ PermissionManageEmployee: event.target.value });
    };

    SetDataPermissionManageSatisfaction = event => {
        this.setState({ PermissionManageSatisfaction: event.target.value });
    };



    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetDataPermissionPerPage(1, this.state.PerPage, this.state.Search);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetDataPermissionPerPage(this.state.Page, event.target.value, this.state.Search);
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
        this.GetDataPermissionPerPage(page, this.state.PerPage, this.state.Search);
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
        this.GetDataPermissionPerPage(page, this.state.PerPage, this.state.Search);
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
        this.GetDataPermissionPerPage(page, this.state.PerPage, this.state.Search);
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
                                        Manage Permission
                                    </h1>
                                    <div class="page-header-subtitle">จัดการสิทธิ์การใช้งาน</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <MDBContainer className='mt-0' fluid responsive>
                    <MDBRow className='py-3'>
                        <MDBCol md='12'>
                            <MDBCard>
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
                                        {/* <div className="form-group col-md-9">
                                        </div>
                                        <div className="form-group col-md-2">
                                            <input
                                                class="form-control form-control-sm ml-0 my-1"
                                                type="text"
                                                placeholder="Search"
                                                aria-label="Search"
                                                value={this.state.Search}
                                                onChange={this.ChangeSearch}
                                                onKeyPress={this.EnterSearch}
                                            />
                                        </div> */}
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
                    <div className="modal" id="EditModalPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>แก้ไขข้อมูล</h3>
                                    <button type="button" className="close" data-dismiss="modal" onClick={() => window.location.reload()}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    {/* <form class="responsefrm" onSubmit={this.EditDataPermission}> */}
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">GroupName</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    disabled
                                                    value={this.state.GroupName}
                                                    onChange={this.SetDataGroupName}
                                                />
                                            </div>
                                        </div>
                                        <br></br>                                        
                                        {/* <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Warranty</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionWarranty}
                                                    onChange={this.SetDataPermissionWarranty}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Menu</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionMenu}
                                                    onChange={this.SetDataPermissionMenu}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Content</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionContent}
                                                    onChange={this.SetDataPermissionContent}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Sparepart & Installation</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionSparepartAndInstallation}
                                                    onChange={this.SetDataPermissionSparepartAndInstallation}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Model Sparepart</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionModelSparepart}
                                                    onChange={this.SetDataPermissionModelSparepart}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Classified Sparepart</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionClassifiedSparepart}
                                                    onChange={this.SetDataPermissionClassifiedSparepart}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Model Installation</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionModelInstallation}
                                                    onChange={this.SetDataPermissionModelInstallation}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Classified Installation</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionClassifiedInstallation}
                                                    onChange={this.SetDataPermissionClassifiedInstallation}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Product</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionManageProduct}
                                                    onChange={this.SetDataPermissionManageProduct}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Membership Registration</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionMembershipRegistration}
                                                    onChange={this.SetDataPermissionMembershipRegistration}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Membership</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionManageMembership}
                                                    onChange={this.SetDataPermissionManageMembership}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Membership Renew</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionMembershipRenew}
                                                    onChange={this.SetDataPermissionMembershipRenew}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Service Membership Information</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionServiceMembershipInformation}
                                                    onChange={this.SetDataPermissionServiceMembershipInformation}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Employee</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionManageEmployee}
                                                    onChange={this.SetDataPermissionManageEmployee}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>
                                        
                                        <div className="row"> 
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Manage Satisfaction</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.PermissionManageSatisfaction}
                                                    onChange={this.SetDataPermissionManageSatisfaction}
                                                >
                                                    <option value="1">-</option>
                                                    <option value="2">Read</option>
                                                    <option value="3">Write</option>
                                                </select>
                                            </div>

                                        </div>*/}
                                        {this.state.MenuList.map((item, index) => (
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">{item.menu_Name}</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select 
                                                    className="custom-select custom-select-sm form-control form-control-sm" 
                                                    value={this.state[item.id]}
                                                    onChange={(event) => this.setState({ [item.id]: event.target.value })}
                                                >
                                                    <option value="-">-</option>
                                                    <option value="R">Read</option>
                                                    <option value="W">Write</option>
                                                </select>
                                            </div>
                                        </div>
                                        ))}
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal" onClick={() => window.location.reload()}>ยกเลิก</button>
                                                <button type="submit" className="btn btn-warning" style={{ float: 'right' }} onClick={() => this.AddPermissionToMenu()}>อัพเดต</button>
                                            </div>
                                        </div>
                                    {/* </form> */}
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
export default Permission;
