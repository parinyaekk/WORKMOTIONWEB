import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import "../MainConfig";
import "../css/styles.css";
import { Link } from "react-router-dom";
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
class ContentDetail extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        this.setState({ ContentID: this.props.location.state.id });
        var Name = this.props.location.state.name;
        await this.SetMenuIDFromContent(this.state.ContentID, Name);
        await this.GetAllDataListPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);

    }

    constructor(props) {
        super(props);
        this.state = {
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Content',
            Permission: "",
            ContentID: 1,
            LangID: 1,
            Menu: null,
            MenuID: null,
            ListData: [],
            Page: 1,
            AllPage: 0,
            PerPage: 10,
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
                    width: 150
                },
                {
                    label: "ภาพตัวอย่าง",
                    field: "image",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "หัวข้อคอนเทนต์",
                    field: "content_title",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รายละเอียด",
                    field: "content_detail",
                    sort: "asc",
                    width: 300
                },
                {
                    label: 'ภาษา',
                    field: 'lang',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'สถานะ',
                    field: 'status',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'ลบ',
                    field: 'delete',
                    sort: 'asc',
                    width: 150
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

    SetMenuIDFromContent(value, value2) {
        this.setState({ MenuID: value, Menu: value2 });
        // console.log(value2);
    }

    SplitBR(value) {
        if (value != "" && value != null) {
            return value.split("<br>").join("\n");
        }
        return "";
    }

    GotoContentPage() {
        window.location.href = "content";
    }

    async GetAllDataListPerPage(Page, PerPage, Search, ID, StartDate, EndDate) {
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            ID: ID,
            Start: StartDate,
            End: EndDate,
        };

        await axios.post(`${APIUrl}Content/GetAllDataContentPaging`, temp)
            .then(response => {
                if (response.data.status === 0) {
                    // console.log(response.data.data);
                    let all_page = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
                    this.setState({ AllPage: all_page });
                    let TempData = [];
                    let no_ran = ((this.state.Page - 1) * this.state.PerPage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (no_ran + (index + 1)),
                            image: item.file == null ? "No Image" : item.file.type.includes("image") ? <img class="table-img" src={`${APIImagePath}` + item.file.path} /> : "No Image",
                            content_title: item.content_title,
                            content_detail: item.content_detail,
                            lang: item.lang == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ",
                            status: item.product_active === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <Link to={{
                                    pathname: "/AddContent",
                                    state: {
                                        id: item.id,
                                        type: "edit"
                                    }
                                }}>
                                    <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable">
                                        <img
                                            class="img-manage"
                                            src={require("../images/editor.png")}
                                            alt="Edit"
                                        />
                                    </button>
                                </Link>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable">
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>,
                            delete: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteContentById(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/DeleteIcon.png")}
                                        alt="Delete"
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" onClick={() => this.DeleteContentById(item.id)}>
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
            .catch(err => console.log(err));
    };

    ClearSearch() {
        this.setState({ Page: 1, PerPage: 10, Search: '', StartDateSearch: '', EndDateSearch: '' });
        window.location.reload();
    }

    async DeleteContentById(val) {
        var temp = {
            ID: val
        }
        await axios.post(`${APIUrl}Content/DeleteContentById`, temp)
            .then((response) => {
                if (response.data.status === 0) {
                    alert("Delete Success");
                    // this.state.ArrFile.push(data.file);
                    this.forceUpdate();
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

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
            this.GetAllDataListPerPage(1, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    };

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    };

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllDataListPerPage(this.state.Page, event.target.value, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataListPerPage(page, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataListPerPage(page, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllDataListPerPage(page, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch);
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

    renderTableMenu() {
        return this.state.ListData.map((item, index) => {
            // console.log(item.id);
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >
                        {item.image == null && "No Image"}
                        {item.image != null && <img class="table-img" src={`${APIImagePath}` + item.image} />}
                    </td>
                    <td >{item.contentTitle}</td>
                    <td >{this.SplitBR(item.detail)}</td>
                    {/* <td >{item.detail}</td> */}
                    <td >{item.lang == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ"}</td>
                    <td >{item.is_Active === 1 ? "Active" : "InActive"}</td>
                    <td style={{ width: '15%' }}>
                        <Link to={{
                            pathname: "/AddContent",
                            state: {
                                id: item.id,
                                type: "edit"
                            }
                        }}>
                            <button type="button" style={{ marginTop: '-9px' }} class="btn btn-datatable">
                                <img
                                    style={{ maxWidth: "20px" }}
                                    src={require("../images/editor.png")}
                                    alt=""
                                />
                            </button>
                        </Link>
                        <button style={{ marginTop: '-9px' }} class="btn btn-datatable" onClick={() => this.DeleteContentById(item.id)}>
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

    render() {
        const data = {
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Surname',
                    field: 'surname',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Position',
                    field: 'position',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Office',
                    field: 'office',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Age',
                    field: 'age',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Start date',
                    field: 'date',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Salary',
                    field: 'salary',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Extn.',
                    field: 'extn',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: "E-mail",
                    field: 'email',
                    sort: 'asc',
                    width: 300
                }
            ],
            rows: [
                {
                    name: 'Tiger',
                    surname: 'Nixon',
                    position: 'System Architect',
                    office: 'Edinburgh',
                    age: '61',
                    date: '2011/04/25',
                    salary: '$320,800',
                    extn: 5421,
                    email: 't.nixon@datatables.net'
                },
                {
                    name: 'Garrett',
                    surname: 'Winters',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '63',
                    date: '2011/07/25',
                    salary: '$170,750',
                    extn: 8422,
                    email: 'q.winters@datatables.net'
                },
                {
                    name: 'Ashton',
                    surname: 'Cox',
                    position: 'Junior Technical Author',
                    office: 'San Francisco',
                    age: '66',
                    date: '2009/01/12',
                    salary: '$86,000',
                    extn: 1562,
                    email: 'a.cox@datatables.net'
                },
                {
                    name: 'Cedric',
                    surname: 'Kelly',
                    position: 'Senior Javascript Developer',
                    office: 'Edinburgh',
                    age: '22',
                    date: '2012/03/29',
                    salary: '$433,060',
                    extn: 6224,
                    email: 'c.kelly@datatables.net'
                },
                {
                    name: 'Airi',
                    surname: 'Satou',
                    position: 'Accountant',
                    office: 'Tokyo',
                    age: '33',
                    date: '2008/11/28',
                    salary: '$162,700',
                    extn: 5407,
                    email: 'a.satou@datatables.net'
                },
                {
                    name: 'Brielle',
                    surname: 'Williamson',
                    position: 'Integration Specialist',
                    office: 'New York',
                    age: '61',
                    date: '2012/12/02',
                    salary: '$372,000',
                    extn: 4804,
                    email: 'b.williamson@datatables.net'
                },
            ]
        };

        const data1 = {
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ภาพตัวอย่าง",
                    field: "image",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "หัวข้อคอนเทนต์",
                    field: "content_title",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รายละเอียด",
                    field: "content_detail",
                    sort: "asc",
                    width: 20
                },
                {
                    label: 'ภาษา',
                    field: 'lang',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'สถานะ',
                    field: 'status',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows: [
                {
                    no: 1,
                    image: 'No Image',
                    content_title: 'ทดสอบ',
                    content_detail: '<p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p><p><strong>ทดสอบตัวหนา</strong></p>',
                    lang: 'ภาษาไทย',
                    status: 'InActive'
                }
            ]
        };
        return (
            <Container fluid className="main-content-container container-boom px-0">
                <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div class="container">
                        <div class="page-header-content pt-4">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto mt-4">
                                    <h1 class="page-header-title">
                                        <div class="page-header-icon"><Activity /></div>
                                        Content
                                    </h1>
                                    <div class="page-header-subtitle">ข้อมูลเนื้อหา</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <MDBContainer className='mt-3' fluid responsive>
                    <MDBRow className='py-3'>
                        <MDBCol md='12'>
                            <MDBCard>
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {this.state.Permission === "W" ?
                                                <Link to={{
                                                    pathname: "/AddContent",
                                                    state: {
                                                        id: this.state.MenuID,
                                                        type: "add"
                                                    }
                                                }}
                                                >
                                                    <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }}>เพิ่มข้อมูล</button>
                                                </Link> :
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
                                        <div className="form-group col-md-2" style={{ marginTop: '-0.7rem' }}>
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
                                                    <button className="btn btn-success" onClick={() => this.GetAllDataListPerPage(1, this.state.PerPage, this.state.Search, this.state.ContentID, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                </div>
                                                <div className="col-md-5">
                                                    <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <MDBDataTable
                                    hover
                                    paging={false}
                                    sorting={false}
                                    searching={false}
                                    data={this.state.ListData}
                                /> */}
                                    {/* <MDBDataTable responsive btn striped bordered hover data={this.state.ListData}></MDBDataTable> */}
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
export default ContentDetail;