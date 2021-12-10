import React from "react";
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
import LoadingOverlay from "react-loading-overlay";
import moment from 'moment';
import { Activity, Download, Search } from 'react-feather';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;
class Product extends React.Component {

    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetDataProductType();
        // await this.GetDataProductModel();
        await this.GetDataProduct(this.state.Page, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Warranty Product',
            Permission: "",

            ProID: null,
            ProductData: [],
            LangID: 1,
            Page: 1,
            Perpage: 10,
            AllPage: 0,
            optionsProductType: [],
            // optionsProductModel: [],

            ProductCode: '',
            OldProductCode: '',
            ProductName: '',
            BarCode: '',
            ProductType: '',
            // ProductModel: '',
            FileProduct: [],

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
                    label: "รหัสสินค้า",
                    field: "productcode",
                    sort: "asc",
                },
                {
                    label: "รหัสสินค้าเก่า",
                    field: "productoldcode",
                    sort: "asc",
                },
                {
                    label: "บาร์โค้ด",
                    field: "productbarcode",
                    sort: "asc",
                },
                {
                    label: "ชื่อสินค้า",
                    field: "productname",
                    sort: "asc",
                },
                {
                    label: "ประเภทสินค้า",
                    field: "typename",
                    sort: "asc",
                },
                {
                    label: "สถานะ",
                    field: "isactive",
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

    async GetDataProductType() {
        await axios.post(`${APIUrl}Product/GetDataProductType`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var Obj = {
                            value: index.id +';'+index.lang_ID,
                            label: index.type_Name
                        };
                        Temp.push(Obj);
                    });
                    this.setState({ optionsProductType: Temp });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err));
    }


    async BindingDataEditPopup(id) {
        var data = id;
        await axios.post(`${APIUrl}Product/GetDataProductByID?ID=` + data)
            .then((response) => {
                if (response.data.status == 0) {
                    var Data = response.data.data;

                    var tempProductType = {
                        value: Data[0].type_ID + ';' + Data[0].langID,
                        label: Data[0].type_Name
                    };

                    var Temp = [];
                    Array.prototype.forEach.call(Data[0].file, function (index) {
                        var Obj = {
                            File: {
                                id: index.id,
                                name: index.name,
                                path: index.path
                            },
                            Type: "Old"
                        };
                        Temp.push(Obj);
                    });
                    this.setState({ FileProduct: Temp });

                    this.setState({
                        ProID: Data[0].id,
                        ProductCode: Data[0].product_Code,
                        OldProductCode: Data[0].product_Old_Code,
                        ProductName: Data[0].product_Name,
                        BarCode: Data[0].product_Barcode,
                        ProductType: tempProductType,
                        // ProductModel: tempProductModel,
                        LangID: Data[0].langID,
                        Active: Data[0].is_Active === 1 ? "1" : "2",
                    });
                }
            }).catch(err => console.log(err));
    }

    async ExportExcel(Search, StartDate, EndDate) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Product/WarrantyProductExcel`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataWarrantyProduct.xlsx")
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

    async ClearDataFrom() {
        this.setState({ FileProduct: [] });

        this.setState({
            ProID: null,
            ProductCode: null,
            OldProductCode: null,
            ProductName: null,
            BarCode: null,
            ProductType: null,
            // ProductModel: null,
            LangID: null,
            Active: null,
        });
        document.getElementById("form-input").reset();
    }

    async GetDataProduct(Page, PerPage, Search, StartDate, EndDate) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            Perpage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Product/GetAllDataProduct`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    var Total = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.Perpage));
                    this.setState({ AllPage: Total });
                    var TempData = [];
                    var Number = ((this.state.Page - 1) * this.state.Perpage);
                    response.data.data.result.map((item, index) => {
                        let TempSubData = {
                            no: (Number + (index + 1)),
                            productcode: item.productcode,
                            productoldcode: item.productoldcode,
                            productbarcode: item.productbarcode,
                            productname: item.productname,
                            typename: item.typename,
                            isactive: item.isactive === 1 ? "Active" : "InActive",
                            edit: this.state.Permission === "W" ?
                                <button style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditDataProduct" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
                                    <img
                                        class="img-manage"
                                        src={require("../images/editor.png")}
                                        alt="Edit"
                                    />
                                </button>
                                :
                                <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditDataProduct" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
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
                            :
                            <button disabled style={{ marginTop: '-9px' }} type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
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
                    this.setState({ ProductData: dataTable });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err))
            .finally(function () {
                _this.setState({ loading: false });
            });
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '' });
        window.location.reload();
    }

    async InActiveDataMenu() {
        var ID = parseInt(this.state.ProID);
        await axios.post(`${APIUrl}Product/InActiveDataProduct?ID=` + ID)
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
        this.setState({ ProID: val });
    }

    ChangeSort() {
        // console.log(this.state.ListDataProduct_SparepartTest);
    };

    EnterSearch = event => {
        if (event.key === 'Enter') {
            this.setState({ Page: 1 });
            this.GetDataProduct(1, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    SetDataProductCode = event => {
        this.setState({ ProductCode: event.target.value });
    }

    SetDataOldProductCode = event => {
        this.setState({ OldProductCode: event.target.value });
    }
    
    SetDataProductName = event => {
        this.setState({ ProductName: event.target.value });
    }

    SetDataBarCode = event => {
        this.setState({ BarCode: event.target.value });
    }

    SetDataProductType = event => {
        this.setState({ ProductType: event });
    }
    
    // SetDataProductModel = event => {
    //     this.setState({ ProductModel: event });
    // }

    setStateStartDateSearch = event => {
        this.setState({ StartDateSearch: event.target.value });
    }
    
    setStateEndDateSearch = event => {
        this.setState({ EndDateSearch: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ Perpage: event.target.value });
        this.GetDataProduct(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataProduct(page, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataProduct(page, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetDataProduct(page, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

    AddDataProduct = event => {
        event.preventDefault();
        var temp = [];
        Array.prototype.forEach.call(this.state.FileProduct, function (index) {
            if (index.Type == "Old") {
                temp.push(index.File);
            }
        });

        const Tempdata = {
            LangID: 1,
            ProductCode: this.CheckNull(this.state.ProductCode),
            OldProductCode: this.CheckNull(this.state.OldProductCode),
            ProductName: this.CheckNull(this.state.ProductName),
            BarCode: this.CheckNull(this.state.BarCode),
            ProductType: this.CheckNull(this.state.ProductType.value),
            // ProductModel: this.CheckNull(this.state.ProductModel.value),
            File: temp
        };

        const data = new FormData();
        Array.prototype.forEach.call(this.state.FileProduct, function (index) {
            if (index.Type == "New") {
                data.append('files', index.File);
            }
        });

        data.append('datas', JSON.stringify(Tempdata));
        axios.post(`${APIUrl}Product/AddDataProduct`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    UpdateDataProduct = event => {
        event.preventDefault();
        var temp = [];
        Array.prototype.forEach.call(this.state.FileProduct, function (index) {
            if (index.Type == "Old") {
                temp.push(index.File);
            }
        });

        const data = new FormData();
        Array.prototype.forEach.call(this.state.FileProduct, function (index) {
            if (index.Type == "New") {
                data.append('files', index.File);
            }
        });

        const Tempdata = {
            ID: this.CheckNull(this.state.ProID),
            LangID: 1,
            ProductCode: this.CheckNull(this.state.ProductCode),
            OldProductCode: this.CheckNull(this.state.OldProductCode),
            ProductName: this.CheckNull(this.state.ProductName),
            BarCode: this.CheckNull(this.state.BarCode),
            ProductType: this.CheckNull(this.state.ProductType.value),
            // ProductModel: this.CheckNull(this.state.ProductModel.value),
            File: temp
        };

        data.append('datas', JSON.stringify(Tempdata));
        axios.post(`${APIUrl}Product/UpdateDataProduct`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
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

    onFileChange = event => {
        if (event.target.length != 0) {
            var FileObj = {
                File: event.target.files[0],
                Type: "New"
            };
            this.state.FileProduct.push(FileObj);
            this.forceUpdate();
        }
    };

    onFileDelete(value) {
        this.state.FileProduct.splice(value, 1);
        this.forceUpdate();
    };

    renderTableFile() {
        return this.state.FileProduct.map((item, index) => {
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
                        {item.Type == "New" && <td><img style={{width: '70px', height: '70px'}} id={"tblImg" + index} src={item.File.name} class="table-img"></img> </td>}  

                        {item.Type == "Old" && <td> <img style={{width: '70px', height: '70px'}} class="table-img" src={`${APIImagePath}` + item.File.path}></img></td>}

                        <td>{item.File.name}</td>
                        <td onClick={() => this.onFileDelete(index)}>
                            <input type="button" value="Delete" className="btn btn-danger" />
                        </td>
                    </tr>
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
                                Manage Warranty Product
                            </h1>
                                    <div class="page-header-subtitle">ข้อมูลสินค้ารับประกัน</div>
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
                                        <div className="col-md-6">
                                            <div class="float-right">
                                                {this.state.Permission === "W" ?
                                                    <button class="btn btn-outline-info" type="button" style={{ width: '100%', cursor: 'pointer' }}
                                                        onClick={() => this.ExportExcel(this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}><Download />&nbsp; Export Excel</button> :
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
                                                value={this.state.Perpage}
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
                                        <div className="col-md-2" style={{ marginTop: '-0.4rem' }}>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <button className="btn btn-success" onClick={() => this.GetDataProduct(1, this.state.Perpage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button> &nbsp;
                                                </div>
                                                <div className="col-md-5">
                                                    <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <MDBTable responsive hover>
                                        <MDBTableHead columns={this.state.ProductData.columns} />
                                        <MDBTableBody rows={this.state.ProductData.rows} />
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
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูลสินค้ารับประกัน</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.AddDataProduct} id="form-input">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductCode}
                                                    onChange={this.SetDataProductCode}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสสินค้าเก่า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.OldProductCode}
                                                    onChange={this.SetDataOldProductCode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductName}
                                                    onChange={this.SetDataProductName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">บาร์โค้ด</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.BarCode}
                                                    onChange={this.SetDataBarCode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภทสินค้า</label>
                                                <Select
                                                    value={this.state.ProductType}
                                                    onChange={this.SetDataProductType}
                                                    options={this.state.optionsProductType}
                                                />
                                            </div>
                                            {/* <div className="form-group col-md-6">
                                                <label className="small mb-1">รุ่นของสินค้า</label>
                                                <Select
                                                    value={this.state.ProductModel}
                                                    onChange={this.SetDataProductModel}
                                                    options={this.state.optionsProductModel}
                                                />
                                            </div> */}
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รูปสินค้า</label>
                                                <br></br>
                                                <input
                                                    className="py-1"
                                                    type="file"
                                                    onChange={this.onFileChange}
                                                    multiple="multiple"
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
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="submit" className="btn btn-success" style={{ float: 'right' }}>เพิ่มข้อมูล</button>
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
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>จัดการข้อมูลสินค้ารับประกัน</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.UpdateDataProduct}>
                                    <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductCode}
                                                    onChange={this.SetDataProductCode}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รหัสสินค้าเก่า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.OldProductCode}
                                                    onChange={this.SetDataOldProductCode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductName}
                                                    onChange={this.SetDataProductName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">บาร์โค้ด</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.BarCode}
                                                    onChange={this.SetDataBarCode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภทสินค้า</label>
                                                <Select
                                                    value={this.state.ProductType}
                                                    onChange={this.SetDataProductType}
                                                    options={this.state.optionsProductType}
                                                />
                                            </div>
                                            {/* <div className="form-group col-md-6">
                                                <label className="small mb-1">รุ่นของสินค้า</label>
                                                <Select
                                                    value={this.state.ProductModel}
                                                    onChange={this.SetDataProductModel}
                                                    options={this.state.optionsProductModel}
                                                />
                                            </div> */}
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รูปสินค้า</label>
                                                <br></br>
                                                <input
                                                    className="py-1"
                                                    type="file"
                                                    onChange={this.onFileChange}
                                                    multiple="multiple"
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
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-11">
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
export default Product;
