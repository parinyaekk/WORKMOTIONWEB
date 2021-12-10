import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import Select from 'react-select';
import { Activity } from 'react-feather';
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

const APIUrl = global.config.variable.Url;
// const APIImagePath = global.config.variable.ImagePath;
class ClassifiedInstallation extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetOptionModel();
        await this.GetOptionClassified();
        await this.GetDataClassified(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }

    constructor(props) {
        super(props);
        this.state = {
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Classified Installation',
            Permission: "",

            DataTableClassified: [],
            LangID: null,
            Model: null,
            Classified: null,
            Sub_Classified: null,
            Order: 0,
            Status: null,
            TempID: null,

            optionsModel: [],
            optionsClassified: [],
            ListAllClassified: [],

            Page: 1,
            PerPage: 10,
            AllPage: 0,
            Search: "",
            StartDateSearch: '',
            EndDateSearch: '',
            Previous_Status: "page-item disabled",
            Next_Status: "page-item ",
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc",
                },
                {
                    label: "ชื่อประเภท",
                    field: "classified_name",
                    sort: "asc",
                },
                {
                    label: "ชื่อประเภทย่อย",
                    field: "sub_classified_name",
                    sort: "asc",
                },
                {
                    label: "ชื่อโมเดล",
                    field: "model_name",
                    sort: "asc",
                },
                {
                    label: "สถานะ",
                    field: "is_Active",
                    sort: "asc",
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                },
                {
                    label: 'ลบ',
                    field: 'delete',
                    sort: 'asc',
                }
            ],
        };
        //  this.handleChangeModel = this.handleChangeModel.bind(this);
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

    async BindingDataEditPopup(id) {
        let temp = {
            ID: id
        };
        await axios.post(`${APIUrl}Installation/GetClassifiedInstallationById`, temp)
            .then((response) => {
                if (response.data.status == 0) {
                    var Data = response.data.data;
                    this.setState({
                        TempID: Data.classified_id1,
                        LangID: Data.lang_id,
                        Model: {
                            value: Data.model_id,
                            label: Data.model_name,
                        },
                        Classified: {
                            value: Data.classified_id2,
                            label: Data.classified_name2,
                        },
                        Sub_Classified: Data.classified_name1,
                        Order: Data.order,
                        Status: Data.is_active,
                    });
                    this.forceUpdate();
                }
            }).catch(err => console.log(err));
    }

    async ClearDataFrom() {
        this.setState({
            TempID: null,
            LangID: null,
            ModelName: null,
            Order: 0,
            Status: null,
        });
        document.getElementById("form-input").reset();
    }

    async GetOptionModel() {
        await axios.post(`${APIUrl}Installation/GetOptionModelSparePart`)
            .then((response) => {
                if (response.data.status == 0) {
                    this.setState({ optionsModel: response.data.data });
                }
            }).catch(err => console.log(err));
    }

    async GetOptionClassified() {
        await axios.post(`${APIUrl}Installation/GetOptionClassifiedSparePart`)
            .then((response) => {
                if (response.data.status == 0) {
                    this.setState({ optionsClassified: response.data.data });
                    this.setState({ ListAllClassified: response.data.data });
                }
            }).catch(err => console.log(err));
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: ''});
        window.location.reload();
    }

    async GetDataClassified(Page, PerPage, Search, StartDate, EndDate) {
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Installation/GetAllClassifiedInstallation`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            classified_name: item.classified_name,
                            sub_classified_name: item.sub_classified_name,
                            model_name: item.model_name,
                            is_active: item.is_active === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditDataProduct" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditDataProduct" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>,
                            delete: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/DeleteIcon.png")}
                                        alt="Delete"
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
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
                    this.setState({ DataTableClassified: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err));
    }

    async InActiveDataClassified() {
        var ID = parseInt(this.state.TempID);
        await axios.post(`${APIUrl}Installation/InActiveClassifiedInstallationById?ID=` + ID)
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

    handleChangeModel = Model => {
        this.setState({ Model: Model });
        let Temp = [];
        Temp = this.state.ListAllClassified.filter(x => x.model_id == Model.value);
        this.setState({ optionsClassified: Temp });
        // console.log(`Option selected:`, Model);
    };

    handleChangeClassified = Classified => {
        this.setState({ Classified: Classified });
        // console.log(`Option selected:`, Classified);
    };

    SetInActiveID(val) {
        this.setState({ TempID: val });
    }

    SetDataSub_Classified = event => {
        this.setState({ Sub_Classified: event.target.value });
    }

    setDataLangID = event => {
        this.setState({ LangID: event.target.value });
    }

    setDataOrder = event => {
        this.setState({ Order: event.target.value });
    }

    setDataStatus = event => {
        this.setState({ Status: event.target.value });
    }

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    ChangeSort() {
        // console.log(this.state.ListDataProduct_SparepartTest);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetDataClassified(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetDataClassified(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataClassified(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataClassified(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataClassified(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

    AddDataClassified() {
        const Tempdata = {
            Lang_ID: this.CheckNull(this.state.LangID),
            FK_Model_ID: this.CheckNull(this.state.Model == null ? null : this.state.Model.value),
            FK_Classified_ID: this.CheckNull(this.state.Classified == null ? null : this.state.Classified.value),
            Classified_Name: this.CheckNull(this.state.Sub_Classified),
            Order: this.CheckNull(this.state.Order),
        };

        axios.post(`${APIUrl}Installation/SaveAddClassifiedInstallation`, Tempdata)
            .then((response) => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    SaveEditDataClassified() {
        const Tempdata = {
            ID: this.CheckNull(this.state.TempID),
            Lang_ID: this.CheckNull(this.state.LangID),
            FK_Model_ID: this.CheckNull(this.state.Model == null ? null : this.state.Model.value),
            FK_Classified_ID: this.CheckNull(this.state.Classified == null ? null : this.state.Classified.value),
            Classified_Name: this.CheckNull(this.state.Sub_Classified),
            Order: this.CheckNull(this.state.Order),
            Is_Active: this.CheckNull(this.state.Status),
        };

        axios.post(`${APIUrl}Installation/SaveEditClassifiedInstallation`, Tempdata)
            .then((response) => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    CheckNull(value) {
        if (value != undefined && value != null) {
            return value;
        }
        return null;
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
                                        Manage Classified Installation
                                    </h1>
                                    <div class="page-header-subtitle">ข้อมูลประเภทการติดตั้ง</div>
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
                                                <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} onClick={() => this.ClearDataFrom()} data-toggle="modal" data-target="#AddProductPopup" data-backdrop="static">เพิ่มข้อมูล</button> :
                                                <button class="btn btn-block btn-success" disabled type="button" style={{ width: '25%' }}>เพิ่มข้อมูล</button>}
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
                                        <div className="form-group col-md-3">
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-2rem' }}>
                                            <label className="small mb-1">วันเดือนปีที่ลงทะเบียน</label>
                                            <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem' }}>
                                            <input className="form-control py-1" type="date" value={this.state.EndDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateEndDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.7rem'}}>
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
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem'}} >
                                        <div className="row">
                                                    <div className="col-md-5">
                                            <button className="btn btn-success" onClick={() => this.GetDataClassified(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                        &nbsp;
                                                    </div>
                                                    <div className="col-md-5">
                                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <MDBTable responsive hover>
                                        <MDBTableHead columns={this.state.DataTableClassified.columns} />
                                        <MDBTableBody rows={this.state.DataTableClassified.rows} />
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
                    <div className="modal" id="AddProductPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูลข้อมูลโมเดล</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form id="form-input">
                                        <div className="row">
                                            <div className="form-group col-md-2" style={{ paddingTop: '3px' }} >
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.LangID == "1"}
                                                    onChange={this.setDataLangID} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาไทย</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.LangID == "2"}
                                                    onChange={this.setDataLangID} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาอังกฤษ</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">โมเดล</label>
                                                <Select
                                                    value={this.state.Model}
                                                    onChange={this.handleChangeModel}
                                                    options={this.state.optionsModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภทหลัก</label>
                                                <Select
                                                    value={this.state.Classified}
                                                    onChange={this.handleChangeClassified}
                                                    options={this.state.optionsClassified}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อประเภท</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Sub_Classified}
                                                    onChange={this.SetDataSub_Classified}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลำดับ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="number"
                                                    value={this.state.Order}
                                                    onChange={this.setDataOrder}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="button" onClick={() => this.AddDataClassified()} className="btn btn-success" style={{ float: 'right' }}>เพิ่มข้อมูล</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="modal" id="EditDataProduct" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>จัดการข้อมูลโมเดล</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="form-group col-md-2" style={{ paddingTop: '3px' }} >
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.LangID == "1"}
                                                    onChange={this.setDataLangID} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาไทย</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.LangID == "2"}
                                                    onChange={this.setDataLangID} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาอังกฤษ</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">โมเดล</label>
                                                <Select
                                                    value={this.state.Model}
                                                    onChange={this.handleChangeModel}
                                                    options={this.state.optionsModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภทหลัก</label>
                                                <Select
                                                    value={this.state.Classified}
                                                    onChange={this.handleChangeClassified}
                                                    options={this.state.optionsClassified}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อประเภท</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Sub_Classified}
                                                    onChange={this.SetDataSub_Classified}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลำดับ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="number"
                                                    value={this.state.Order}
                                                    onChange={this.setDataOrder}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-2" style={{ paddingTop: '3px' }} >
                                                <label className="small mb-1">สถานะ</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Close"
                                                    value={0}
                                                    checked={this.state.Status == "0"}
                                                    onChange={this.setDataStatus} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">ปิด</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="Open"
                                                    value={1}
                                                    checked={this.state.Status == "1"}
                                                    onChange={this.setDataStatus} />
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">เปิด</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="button" onClick={() => this.SaveEditDataClassified()} className="btn btn-warning" style={{ float: 'right' }}>อัพเดต</button>
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
                            <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ต้องการที่จะลบหรือไม่ ?</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="form-group col-md6">
                                            <button type="button" className="btn btn-success" style={{ marginLeft: '361px' }} onClick={() => this.InActiveDataClassified()}>ตกลง</button>
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
                    .center-th {\
                        text-align: center;\
                        vertical-align: middle;\
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
export default ClassifiedInstallation;
