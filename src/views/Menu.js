import React from "react";
import axios from "axios";
import Select from 'react-select';
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import { Activity } from 'react-feather';
import "react-table/react-table.css";
import "../MainConfig";
import $ from "jquery";
import "../css/styles.css";
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

class Menu extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetAllMenulink();
        await this.GetAllDataMenu();
        await this.GetAllMenuPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            per_menu_name: 'Manage Menu',
            Permission: "",
            ArrMenu: [],
            LangID: 1,
            MenuID: 0,
            MenuLangID: null,
            MenuName: '',
            MainMenuName: null,
            DescriptionMenu: '',
            LinkMenu: '',
            OrderMenu: null,
            Active: null,
            optionsMenu: [],
            Link_Menu: null,
            LinkoptionsMenu: [],
            mnlinkData: [],
            ID_menuLink: null,
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
                    label: "ชื่อเมนู",
                    field: "menu_Name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "เมนูหลัก",
                    field: "fk_menu_name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ลิงก์เมนู",
                    field: "menu_Link",
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
                    var Permission = temp.filter(x => x.user_group == this.state.User_Group && x.menu_name == this.state.per_menu_name.toLowerCase());
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

    async GetAllDataMenu() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios.post(`${APIUrl}Master/GetAllMenuAdmin`)
            // await axios.post(`${APIUrl}Master/GetAllDataMenu`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    // this.setState({ ArrMenu: response.data.data });
                    var ArrTemp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var Obj = {
                            value: index.id,
                            label: index.menu_Name,
                            langID: index.lang_ID
                        };
                        ArrTemp.push(Obj);
                    });
                    this.setState({ optionsMenu: ArrTemp });
                }
            })
            .catch(err => console.log(err));
    }

    async GetAllMenulink() {
        await axios.post(`${APIUrl}Master/GetAllMenulink`)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ mnlinkData: response.data.data });
                }
            })
            .catch(err => console.log(err));
    }

    async GetAllMenuPerPage(Page, PerPage, Search, StartDate, EndDate) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Master/GetAllMenuPerPage`, temp)
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
                            menu_Name: item.menu_Name,
                            fk_menu_name: item.fk_menu_name,
                            menu_Link: item.menu_Link,
                            is_Active: item.is_Active === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>
                                : <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
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
                    this.setState({ ArrMenu: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err))
            .finally(function () {
                _this.setState({ loading: false });
            });
    }
    
    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: ''});
        window.location.reload();
    }

    SetLinkMenu = event => {
        this.setState({ Link_Menu: event });
    }

    setStateMenuLangID = event => {
        this.setState({ MenuLangID: event.target.value, Link_Menu: null });
        this.CheckLangSeleted(event.target.value);
    }

    SetDataMenuName = event => {
        this.setState({ MenuName: event.target.value });
    }

    SetDataLinkMenu = event => {
        this.setState({ LinkMenu: event.target.value });
    }

    SetActive = event => {
        this.setState({ Active: event.target.value });
    }

    SetMainMenuName = event => {
        this.setState({ MainMenuName: event });
    }

    SetDescriptionMenu = event => {
        this.setState({ DescriptionMenu: event.target.value });
    }

    SetOrderMenu = event => {
        this.setState({ OrderMenu: event.target.value });
    }

    SetActive = event => {
        this.setState({ Active: event.target.value });
    }

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }

    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    handleEntailmentRequest(e) {
        e.preventDefault();

        // console.log("handle request ");
    }

    SetInActiveID(ID) {
        this.setState({ MenuID: ID });
    }

    CheckLangSeleted(value, value2) {
        if (value != null) {
            this.setState({ LinkoptionsMenu: [] });
            this.state.LinkoptionsMenu = [];
            var Data = this.state.optionsMenu.filter(x => x.langID != (parseInt(value).length > 0 ? parseInt(value[0].langID) : parseInt(value)));
            this.setState({ LinkoptionsMenu: Data });
            if (value2 != null) {
                this.setState({ Link_Menu: this.state.LinkoptionsMenu.filter(x => x.value == parseInt(value2)) });
            }
            // console.log(this.state.Link_Menu);
        }
    }

    ClearFieldInput() {
        this.setState({
            MenuID: 0,
            MenuLangID: null,
            MenuName: '',
            MainMenuName: null,
            DescriptionMenu: '',
            LinkMenu: '',
            OrderMenu: 0,
            Link_Menu: null,
            ID_menuLink: null
        });
        $('input:checkbox').prop('checked', false);
        this.setState({ MenuLangID: 1 });
        this.CheckLangSeleted(1);
    }

    async AddDataMenu() {
        // const mainmenu = this.state.MainMenuName;
        const Tempdata = {
            Lang_ID: parseInt(this.state.MenuLangID == null ? 1 : this.state.MenuLangID),
            MenuName: this.state.MenuName,
            MainMenuName: this.state.MainMenuName != null ? parseInt(this.state.MainMenuName.value == null ? 1 : this.state.MainMenuName.value) : this.state.MainMenuName,
            DescriptionMenu: this.state.DescriptionMenu,
            LinkMenu: this.state.LinkMenu,
            OrderMenu: this.state.OrderMenu,
            Status: "Add",
            HeaderStatus: $("#HeaderDataAdd").is(':checked') == true ? 1 : 0,
            FooterStatus: $("#FooterDataAdd").is(':checked') == true ? 1 : 0,
            Link_Menu: this.state.Link_Menu != null ? parseInt(this.state.Link_Menu.value == null ? 1 : this.state.Link_Menu.value) : this.state.Link_Menu
        };
        // console.log(this.state.MainMenuName.length);
        // console.log(Tempdata);
        await axios.post(`${APIUrl}Master/AddDataMenu`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    alert('บันทึกสำเร็จ');
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    async EditDataMenu() {
        // console.log(this.state.Link_Menu)
        const Tempdata = {
            ID: parseInt(this.state.MenuID),
            Lang_ID: parseInt(this.state.MenuLangID == null ? 1 : this.state.MenuLangID),
            MenuName: this.state.MenuName,
            MainMenuName: this.state.MainMenuName.length > 0 ? parseInt(this.state.MainMenuName.value == null ? this.state.MainMenuName[0].value == null ? 1 : this.state.MainMenuName[0].value : this.state.MainMenuName.value) : this.state.MainMenuName.value,
            DescriptionMenu: this.state.DescriptionMenu,
            LinkMenu: this.state.LinkMenu,
            OrderMenu: parseInt(this.state.OrderMenu),
            Active: parseInt(this.state.Active),
            Status: "Edit",
            HeaderStatus: $("#HeaderData").is(':checked') == true ? 1 : 0,
            FooterStatus: $("#FooterData").is(':checked') == true ? 1 : 0,
            Link_Menu: this.state.Link_Menu == null ? null : this.state.Link_Menu.length > 0 ? this.state.Link_Menu[0].value : this.state.Link_Menu.value
        };
        //console.log(this.state.Link_Menu.value)
        await axios.post(`${APIUrl}Master/AddDataMenu`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    alert('อัพเดตสำเร็จ');
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    async InActiveDataMenu() {
        var ID = parseInt(this.state.MenuID);
        await axios.post(`${APIUrl}Master/InActiveDataMenu?ID=` + ID)
            .then(response => {
                if (response.data.status === 0) {
                    alert('ยกเลิกสำเร็จ');
                    window.location.reload();
                }
                else {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
    }

    async OpenEditPopup(id) {
        var data = id;
        await axios.post(`${APIUrl}Master/GetDataMenuByID?ID=` + data)
            .then((response) => {
                if (response.data.status === 0) {
                    // console.log(response.data.data);
                    var Data = response.data.data;
                    var Menu = this.state.optionsMenu.filter(x => x.value == parseInt(Data.fK_Menu_ID));
                    this.setState({
                        MenuID: Data.id,
                        MenuName: Data.menu_Name,
                        LinkMenu: Data.menu_Link,
                        MainMenuName: Menu,
                        OrderMenu: Data.menu_Order,
                        DescriptionMenu: Data.menu_Desc,
                        MenuLangID: Data.lang_ID.toString(),
                        ID_menuLink: Data.menulink,
                        Active: Data.is_Active === 1 ? "1" : "2"
                    });

                    //console.log(this.state.mnlinkData.filter(x => x.fK_MENU_EN_ID == Data.menulink).fK_MENU_EN_ID);
                    Data.hide_Header == 1 ? $("#HeaderData").prop('checked', true) : $("#HeaderData").prop('checked', false);
                    Data.hide_Footer == 1 ? $("#FooterData").prop('checked', true) : $("#FooterData").prop('checked', false);
                    this.CheckLangSeleted(Data.lang_ID.toString(), Data.menulink);
                }
            }).catch(err => console.log(err));
    }

    ChangeSort() {
        // console.log(this.state.ListDataProduct_SparepartTest);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetAllMenuPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllMenuPerPage(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllMenuPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllMenuPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllMenuPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        return this.state.ArrMenu.map((item, index) => {
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >{item.menu_Name}</td>
                    <td >{item.fk_menu_name}</td>
                    <td >{item.menu_Link}</td>
                    <td >{item.is_Active === 1 ? "Active" : "InActive"}</td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                            <img
                                style={{ maxWidth: "20px" }}
                                src={require("../images/editor.png")}
                                alt=""
                            />
                        </button>
                    </td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
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
                                            Manage Menu
                                        </h1>
                                        <div class="page-header-subtitle">จัดการเมนู</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    {/* <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Menu"
                        subtitle=""
                        className="text-sm-left"
                    />
                </Row> */}
                    <MDBContainer className='mt-0' fluid responsive>
                        <MDBRow className='py-3'>
                            <MDBCol md='12'>
                                <MDBCard>
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                                {this.state.Permission === "W" ?
                                                    <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} onClick={() => this.ClearFieldInput()} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button> :
                                                    <button class="btn btn-block btn-success" disabled type="button" style={{ width: '25%' }} >เพิ่มข้อมูล</button>}
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
                                                        <button className="btn btn-success" onClick={() => this.GetAllMenuPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ArrMenu.columns} />
                                            <MDBTableBody rows={this.state.ArrMenu.rows} />
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

                    {/* <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Menu"
                        subtitle=""
                        className="text-sm-left"
                    />
                </Row>
                <Row>
                    <Col>
                        <div>
                            <div className="card mb-4 responsive">
                                <div className="card-header"></div>
                                <button class="btn btn-block btn-success col-md-1" type="button" onClick={() => this.ClearFieldInput()} style={{ marginLeft: '2%', width: '100%' }} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button>
                                <div className="card-body">
                                    <div className="datatable">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>ลำดับ</th>
                                                    <th>ชื่อเมนู</th>
                                                    <th>เมนูหลัก</th>
                                                    <th>ลิงก์เมนู</th>
                                                    <th>สถานะ</th>
                                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }} colSpan="2">จัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody> {this.renderTableMenu()} </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row> */}

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
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">เลือกภาษา</label>
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        type="radio" name="Thai"
                                                        value={1}
                                                        checked={this.state.MenuLangID == "1"}
                                                        onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ภาษาไทย</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio" name="English"
                                                        value={2}
                                                        checked={this.state.MenuLangID == "2"}
                                                        onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">ภาษาอังกฤษ</label>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เชื่อมเมนู</label>
                                                    <Select
                                                        value={this.state.Link_Menu}
                                                        onChange={this.SetLinkMenu}
                                                        options={this.state.LinkoptionsMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ชื่อเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.MenuName}
                                                        onChange={this.SetDataMenuName}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เมนูหลัก</label>
                                                    <Select
                                                        value={this.state.MainMenuName}
                                                        onChange={this.SetMainMenuName}
                                                        options={this.state.optionsMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ลิ้งค์เมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.LinkMenu}
                                                        onChange={this.SetDataLinkMenu}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ลำดับเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="number"
                                                        value={this.state.OrderMenu}
                                                        onChange={this.SetOrderMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รายละเอียดเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.DescriptionMenu}
                                                        onChange={this.SetDescriptionMenu}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">สถานะเมนู</label>
                                                    <br></br>
                                                    <input type="checkbox" id="HeaderDataAdd" name="Header" />
                                                    <label className="small mb-1" style={{ marginLeft: '2%' }}>Header</label>
                                                    &nbsp;&nbsp;
                                                    <input type="checkbox" id="FooterDataAdd" name="Footer" />
                                                    <label className="small mb-1" style={{ marginLeft: '2%' }}>Footer</label>
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <button type="button" className="btn btn-success" onClick={() => this.AddDataMenu()}>เพิ่มข้อมูล</button>
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
                                        <h3 style={{ fontSize: '25px' }}>จัดการเมนู</h3>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form class="responsefrm">
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">เลือกภาษา</label>
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <input
                                                        id="Thai"
                                                        type="radio" name="Thai"
                                                        value={1}
                                                        checked={this.state.MenuLangID === "1"}
                                                        onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1" for="Thai">ภาษาไทย</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        id="English"
                                                        type="radio" name="English"
                                                        value={2}
                                                        checked={this.state.MenuLangID === "2"}
                                                        onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1" for="English">ภาษาอังกฤษ</label>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เชื่อมเมนู</label>
                                                    <Select
                                                        value={this.state.Link_Menu}
                                                        onChange={this.SetLinkMenu}
                                                        options={this.state.LinkoptionsMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ชื่อเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.MenuName}
                                                        onChange={this.SetDataMenuName}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">เมนูหลัก</label>
                                                    <Select
                                                        value={this.state.MainMenuName}
                                                        onChange={this.SetMainMenuName}
                                                        options={this.state.optionsMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ลิ้งค์เมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.LinkMenu}
                                                        onChange={this.SetDataLinkMenu}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">ลำดับเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.OrderMenu}
                                                        onChange={this.SetOrderMenu}
                                                    />
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label className="small mb-1">รายละเอียดเมนู</label>
                                                    <input
                                                        className="form-control py-1"
                                                        type="text"
                                                        value={this.state.DescriptionMenu}
                                                        onChange={this.SetDescriptionMenu}
                                                    />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">สถานะ</label>
                                                    <br></br>
                                                    <input
                                                        type="radio"
                                                        value={1}
                                                        checked={this.state.Active === "1"}
                                                        onChange={this.SetActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">Active</label>
                                                    &nbsp;&nbsp;
                                                    <input
                                                        type="radio"
                                                        value={2}
                                                        checked={this.state.Active === "2"}
                                                        onChange={this.SetActive} />
                                                    &nbsp;&nbsp;
                                                    <label className="small mb-1">InActive</label>
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">สถานะเมนู</label>
                                                    <br></br>
                                                    <input type="checkbox" id="HeaderData" name="Header" />
                                                    <label className="small mb-1" style={{ marginLeft: '5%' }}>Header</label>
                                                    &nbsp;&nbsp;
                                                    <input type="checkbox" id="FooterData" name="Footer" />
                                                    <label className="small mb-1" style={{ marginLeft: '5%' }}>Footer</label>
                                                </div>
                                            </div>
                                            <br></br>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <button type="button" className="btn btn-warning" onClick={() => this.EditDataMenu()}>อัพเดต</button>
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
                                <div className="modal-content">
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
            </LoadingOverlay>
        );
    }
}
export default Menu;