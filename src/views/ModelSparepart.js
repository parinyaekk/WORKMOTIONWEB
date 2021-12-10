import React from "react";
import axios from "axios";
import { Container, Row } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
// import Select from 'react-select';
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
const APIImagePath = global.config.variable.ImagePath;
class ModelSparepart extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetDataModel(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }

    constructor(props) {
        super(props);
        this.state = {
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Model Sparepart',
            Permission: "",

            DataTableModel: [],
            LangID: null,
            ModelName: null,
            Order: 0,
            Link: null,
            PathFile: null,
            Status: null,
            TempID: null,

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
                    label: "ภาษา",
                    field: "lang",
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
        await axios.post(`${APIUrl}SparePart/GetModelSparePartById`, temp)
            .then((response) => {
                if (response.data.status == 0) {
                    var Data = response.data.data;
                    this.setState({
                        TempID: Data.id,
                        LangID: Data.lang_id,
                        ModelName: Data.model_name,
                        Order: Data.order,
                        PathFile: Data.path_file,
                        Link: Data.link,
                        Status: Data.is_active,
                    });
                }
            }).catch(err => console.log(err));
    }

    async ClearDataFrom() {
        this.setState({
            TempID: null,
            LangID: null,
            ModelName: null,
            Order: 0,
            PathFile: null,
            Link: null,
            Status: null,
        });
        document.getElementById("form-input").reset();
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: ''});
        window.location.reload();
    }

    async GetDataModel(Page, PerPage, Search, StartDate, EndDate) {
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Sparepart/GetAllModelSparePart`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            lang: item.lang == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ",
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
                                :<button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditDataProduct" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
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
                                :<button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
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
                    this.setState({ DataTableModel: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err));
    }

    async InActiveDataModel() {
        var ID = parseInt(this.state.TempID);
        await axios.post(`${APIUrl}SparePart/InActiveModelSparePartById?ID=` + ID)
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

    async SaveFile(file) {
        const data = new FormData();
        data.append('File', file);
        await axios.post(`${APIUrl}Sparepart/UploadFileModel`, data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
        if (response.data.status === 0) {
            this.setState({ PathFile: response.data.data });
            $('#file').val('');
            this.forceUpdate();
        }
        })
        .catch((err) => {
            alert(err);
        });
    };

    SetInActiveID(val) {
        this.setState({ TempID: val });
    }

    SetDataOrder = event => {
        this.setState({ Order: event.target.value });
    };

    onFileChange = event => {
        this.SaveFile(event.target.files[0]);
    };

    SetDataLink = event => {
        this.setState({ Link: event.target.value });
    };

    SetDataModelName = event => {
        this.setState({ ModelName: event.target.value });
    }

    setDataLangID = event => {
        this.setState({ LangID: event.target.value });
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
            this.GetDataModel(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetDataModel(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataModel(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataModel(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataModel(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
                if (this.state.Page == (i + 1)) 
                {
                    page.push(
                        <li class="page-item active" aria-current="page">
                            <a class="page-link" >{i + 1}<span class="visually-hidden"></span></a>
                        </li>
                    )
                }
                else if (this.state.Page == (i + 2) || this.state.Page == (i + 3)) 
                {
                    if(this.state.Page == (i + 3) && i > 0)
                    {
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
                else if (this.state.Page == i || this.state.Page == (i - 1)) 
                {
                    page.push(
                        <li class="page-item">
                            <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
                        </li>
                    )
                    if(this.state.Page == (i - 1) && (i + 1) < this.state.AllPage)
                    {
                        page.push(
                            <li class="page-item">
                                <a class="page-link">...</a>
                            </li>
                        )
                    }
                }
                else if ((i + 1) == 1) 
                {
                    page.push(
                        <li class="page-item">
                            <a class="page-link" onClick={() => this.onPaginationNumber(i + 1)}>{i + 1}</a>
                        </li>
                    )
                }
                else if ((i + 1) == this.state.AllPage) 
                {
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

    AddDataModel(){
        const Tempdata = {
            Lang_ID: this.CheckNull(this.state.LangID),
            Model_Name: this.CheckNull(this.state.ModelName),
            Order: this.CheckNull(this.state.Order),
            PathFile: this.CheckNull(this.state.PathFile),
            Link: this.CheckNull(this.state.Link),
        };

        axios.post(`${APIUrl}SparePart/SaveAddModelSparePart`, Tempdata)
        .then((response) => {
            if (response.data.status == 0) {
                alert(response.data.message);
                window.location.reload();
            }
        })
        .catch((err) => alert(err));
    }

    SaveEditDataModel(){
        const Tempdata = {
            ID: this.CheckNull(this.state.TempID),
            Lang_ID: this.CheckNull(this.state.LangID),
            Model_Name: this.CheckNull(this.state.ModelName),
            Order: this.CheckNull(this.state.Order),
            PathFile: this.CheckNull(this.state.PathFile),
            Link: this.CheckNull(this.state.Link),
            Is_Active: this.CheckNull(this.state.Status),
        };

        axios.post(`${APIUrl}SparePart/SaveEditModelSparePart`, Tempdata)
        .then((response) => {
            if (response.data.status == 0) {
                alert(response.data.message);
                window.location.reload();
            }
        })
        .catch((err) => alert(err));
    }

    CheckNull(value){
        if(value != undefined && value != null){
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
                                        Manage Model Sparepart
                            </h1>
                                    <div class="page-header-subtitle">ข้อมูลรุ่นอะไหล่</div>
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
                                        <div className="form-group col-md-2" style={{ marginTop: '-2rem'}}>
                                            <label className="small mb-1">วันเดือนปีที่ลงทะเบียน</label>
                                            <input className="form-control py-1" type="date" value={this.state.StartDateSearch} placeholder="dd/mm/yyyy" onChange={this.setStateStartDateSearch} />
                                        </div>
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.3rem'}}>
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
                                                    <button className="btn btn-success" onClick={() => this.GetDataModel(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                    &nbsp;
                                                </div>
                                                <div className="col-md-5">
                                                    <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <MDBTable responsive hover>
                                        <MDBTableHead columns={this.state.DataTableModel.columns} />
                                        <MDBTableBody rows={this.state.DataTableModel.rows} />
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
                                            <div className="form-group col-md-2" style={{paddingTop:'3px'}} >
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
                                                <label className="small mb-1">ชื่อโมเดล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ModelName}
                                                    onChange={this.SetDataModelName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลำดับ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="Number"
                                                    value={this.state.Order}
                                                    onChange={this.SetDataOrder}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div style={{ marginTop: '25px' }} className="form-group col-md-6">
                                                <input type="file" id="file" class="form-control-file" onChange={this.onFileChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลิ้งค์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Link}
                                                    onChange={this.SetDataLink}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="button" onClick={() => this.AddDataModel()} className="btn btn-success" style={{ float: 'right' }}>เพิ่มข้อมูล</button>
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
                                            <div className="form-group col-md-2" style={{paddingTop:'3px'}} >
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
                                                <label className="small mb-1">ชื่อโมเดล</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ModelName}
                                                    onChange={this.SetDataModelName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลำดับ</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="Number"
                                                    value={this.state.Order}
                                                    onChange={this.SetDataOrder}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div style={{ marginTop: '25px' }} className="form-group col-md-6">
                                                <input type="file" id="file" class="form-control-file" onChange={this.onFileChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ลิ้งค์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.Link}
                                                    onChange={this.SetDataLink}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                {this.state.PathFile == null ? "" : <img class="card-img-top" src={APIImagePath + this.state.PathFile} alt="Card Cover Image"/>}
                                            </div>
                                            <div className="form-group col-md-2" style={{paddingTop:'3px'}} >
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
                                                <button type="button" onClick={() => this.SaveEditDataModel()} className="btn btn-warning" style={{ float: 'right' }}>อัพเดต</button>
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
                                            <button type="button" className="btn btn-success" style={{ marginLeft: '361px' }} onClick={() => this.InActiveDataModel()}>ตกลง</button>
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
export default ModelSparepart;
