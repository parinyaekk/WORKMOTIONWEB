import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import { Activity } from 'react-feather';
import "react-table/react-table.css";
import "../MainConfig";
import $ from "jquery";
import Select from 'react-select';
// import PDFPic from "../images/PDF.png"

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class Installation extends React.Component {

    async componentWillMount() {
        await this.GetAllDataModel();
        await this.GetAllDataProductClassified();
        await this.GetAllDataInstallation();
    }

    constructor(props) {
        super(props);
        this.state = {
            InsID: null,
            ListData: [],
            LangID: 1,
            Active: 1,
            Model: null,
            Classified: null,
            ProductCode: '',
            ProductName: '',
            FileInstall: [],
            ListModel: [],
            ListDataClassified: []
        };
    }

    setStateMenuLangID = event => {
        this.setState({ LangID: event.target.value });
    }
    SetActive = event => {
        this.setState({ Active: event.target.value });
    }
    SetDataClassified = event => {
        this.setState({ Classified: event.target.value });
    }
    SetDataProductCode = event => {
        this.setState({ ProductCode: event.target.value });
    }
    SetDataProductName = event => {
        this.setState({ ProductName: event.target.value });
    }

    handleChangeModel = Model => {
        this.setState({ Model });
    };
    handleChangeClassified = Classified => {
        this.setState({ Classified });
    };

    async GetAllDataModel() {
        await axios.post(`${APIUrl}Installation/GetAllDataModel`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var Obj = {
                            value: index.id,
                            label: index.model_Name
                        };
                        Temp.push(Obj);
                    });
                    this.setState({ ListModel: Temp });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err));
    }

    async GetAllDataProductClassified() {
        await axios.post(`${APIUrl}Installation/GetAllDataProductClassified`)
            .then(response => {
                if (response.data.status == 0) {
                    var Temp = [];
                    Array.prototype.forEach.call(response.data.data, function (index) {
                        var Obj = {
                            value: index.id,
                            label: index.classified_Name
                        };
                        Temp.push(Obj);
                    });
                    this.setState({ ListDataClassified: Temp });
                    this.forceUpdate();
                }
            })
            .catch(err => console.log(err));
    }

    async GetAllDataInstallation() {
        const temp = {
            SearchValue: '',
            Page: 1,
            Perpage: 10
        };
        // await axios.post(`${APIUrl}Installation/GetAllDataInstallationList`, temp)
        await axios.post(`${APIUrl}Installation/GetAllDataInstallation`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ ListData: response.data.data });
                }
            }).catch(err => console.log(err));
    }

    async InActiveDataMenu() {
        var ID = parseInt(this.state.InsID);
        await axios.post(`${APIUrl}Installation/InActiveDataInstallation?ID=` + ID)
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

    async BindingDataEditPopup(id) {
        var data = id;
        await axios.post(`${APIUrl}Installation/GetDataInstallationByID?ID=` + data)
            .then((response) => {
                if (response.data.status == 0) {
                    var Data = response.data.data;

                    var tempClassified = {
                        value: Data[0].classified_ID,
                        label: Data[0].classified_Name
                    };
                    var tempModel = {
                        value: Data[0].model_ID,
                        label: Data[0].model_Name
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
                    this.setState({ FileInstall: Temp });

                    this.setState({
                        InsID: Data[0].id,
                        LangID: Data[0].langID,
                        Active: Data[0].is_Active === 1 ? "1" : "2",
                        Model: tempModel,
                        Classified: tempClassified,
                        ProductCode: Data[0].productCode,
                        ProductName: Data[0].productName
                    });
                }
            }).catch(err => console.log(err));
    }

    ShowModelName(val) {
        var data = this.state.ListModel.filter(x => x.value == val).length == 0 ? "" : this.state.ListModel.filter(x => x.value == val)[0].label;
        return data;
    }

    ShowClassified(val) {
        var data = this.state.ListDataClassified.find(x => x.value == val).length == 0 ? "" : this.state.ListDataClassified.filter(x => x.value == parseInt(val))[0].label;
        return data;
    }

    AddDataInstallation = event => {
        event.preventDefault();
        var temp = [];
        Array.prototype.forEach.call(this.state.FileInstall, function (index) {
            if (index.Type == "Old") {
                temp.push(index.File);
            }
        });

        const Tempdata = {
            LangID: this.state.LangID == undefined ? null : this.state.LangID,
            Active: this.state.Active == undefined ? null : this.state.Active,
            Model: this.state.Model.value == undefined ? null : this.state.Model.value,
            Classified: this.state.Classified.value == undefined ? null : this.state.Classified.value,
            ProductCode: this.state.ProductCode == undefined ? null : this.state.ProductCode,
            ProductName: this.state.ProductName == undefined ? null : this.state.ProductName,
            File: temp
        };

        const data = new FormData();
        Array.prototype.forEach.call(this.state.FileInstall, function (index) {
            if (index.Type == "New") {
                data.append('files', index.File);
            }
        });

        data.append('datas', JSON.stringify(Tempdata));
        axios.post(`${APIUrl}Installation/AddDataInstallation`, data,
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

    UpdateDataInstallation = event => {
        event.preventDefault();
        var temp = [];
        Array.prototype.forEach.call(this.state.FileInstall, function (index) {
            if (index.Type == "Old") {
                temp.push(index.File);
            }
        });

        const Tempdata = {
            ID: this.state.InsID == undefined ? null : this.state.InsID,
            LangID: this.state.LangID == undefined ? null : this.state.LangID,
            Active: this.state.Active == undefined ? null : this.state.Active,
            Model: this.state.Model.value == undefined ? null : this.state.Model.value,
            Classified: this.state.Classified.value == undefined ? null : this.state.Classified.value,
            ProductCode: this.state.ProductCode == undefined ? null : this.state.ProductCode,
            ProductName: this.state.ProductName == undefined ? null : this.state.ProductName,
            File: temp
        };

        const data = new FormData();
        Array.prototype.forEach.call(this.state.FileInstall, function (index) {
            if (index.Type == "New") {
                data.append('files', index.File);
            }
        });

        data.append('datas', JSON.stringify(Tempdata));
        axios.post(`${APIUrl}Installation/UpdateDataInstallation`, data,
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

    onFileChange = event => {
        if (event.target.length != 0) {
            var FileObj = {
                File: event.target.files[0],
                Type: "New"
            };
            this.state.FileInstall.push(FileObj);
            // console.log(this.state.FileInstall);
            this.forceUpdate();
        }
    };

    SetInActiveID(val) {
        this.setState({ InsID: val });
    }

    onFileDelete(value) {
        this.state.FileInstall.splice(value, 1);
        this.forceUpdate();
    };

    ClearDataBinding() {
        this.setState({
            Model: null,
            Classified: null,
            ProductCode: '',
            ProductName: '',
            FileInstall: []
        });
    }

    async EditDataInstallation() {
        const Tempdata = {
            ID: parseInt(this.state.MenuID),
            Lang_ID: parseInt(this.state.MenuLangID == null ? 1 : this.state.MenuLangID),
            MenuName: this.state.MenuName,
            MainMenuName: this.state.MainMenuName.length > 0 ? parseInt(this.state.MainMenuName.value == null ? this.state.MainMenuName[0].value == null ? 1 : this.state.MainMenuName[0].value : this.state.MainMenuName.value) : 1,
            DescriptionMenu: this.state.DescriptionMenu,
            LinkMenu: this.state.LinkMenu,
            OrderMenu: parseInt(this.state.OrderMenu),
            Active: parseInt(this.state.Active),
        };
        await axios.post(`${APIUrl}Master/AddDataMenu`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    alert('อัพเดตสำเร็จ');
                    window.location.reload();
                }
            })
            .catch((err) => alert(err));
    }

    renderTable() {
        return this.state.ListData.map((item, index) => {
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >
                        {item.image == null && "No Image"}
                        {item.image != null && <img className="table-img" style={{width: '90px', height: '90px'}} src={item.imageType.includes("pdf") == true ? require("../images/PDF.png") : item.imageType.includes("xlsx") == true ? 
                            require("../images/Excel.png") : item.imageType.includes("mp4") == true ? require("../images/File.png") : `${APIImagePath}` + item.image} />}
                    </td>
                    <td >{this.ShowModelName(item.model_ID)}</td>
                    <td >{this.ShowClassified(item.classifiedID)}</td>
                    <td >{item.productCode}</td>
                    <td >{item.productName}</td>
                    <td >{item.is_Active === 1 ? "Active" : "InActive"}</td>
                    <td>
                        <button type="button" class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.BindingDataEditPopup(item.id)}>
                            <img
                                style={{ maxWidth: "20px" }}
                                src={require("../images/editor.png")}
                                alt=""
                            />
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-datatable" data-toggle="modal" data-target="#InActiveDataModalPopup" data-backdrop="static" onClick={() => this.SetInActiveID(item.id)}>
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

    renderTableFile() {
        return this.state.FileInstall.map((item, index) => {
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
                        {item.Type == "New" && <td> {item.File.name.includes("pdf") == true ? <img style={{width: '70px', height: '70px'}} src={require("../images/PDF.png")} class="table-img"></img> 
                            : item.File.name.includes("xlsx") == true ? <img style={{width: '70px', height: '70px'}} src={require("../images/Excel.png")} class="table-img"></img> 
                            : item.File.name.includes("mp4") == true ? <img style={{width: '70px', height: '70px'}} src={require("../images/File.png")} class="table-img"></img> 
                            : <img style={{width: '70px', height: '70px'}} id={"tblImg" + index} src={item.File.name} class="table-img"></img>}  </td>}  

                        {item.Type == "Old" && <td> <img style={{width: '70px', height: '70px'}} class="table-img" src={item.File.name.includes("pdf") == true ? require("../images/PDF.png") :
                            item.File.name.includes("xlsx") == true ? require("../images/Excel.png") : item.File.name.includes("mp4") == true ? <img style={{width: '70px', height: '70px'}} src={require("../images/File.png")} class="table-img"></img> 
                            : `${APIImagePath}` + item.File.path}></img></td>}

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
            <Container fluid className="main-content-container container-boom px-0">
                <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div class="container">
                        <div class="page-header-content pt-4">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto mt-4">
                                    <h1 class="page-header-title">
                                        <div class="page-header-icon"><Activity /></div>
                                Manage Installation
                            </h1>
                                    <div class="page-header-subtitle">จัดการข้อมูลการติดตั้ง</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Installation"
                        subtitle=""
                        className="text-sm-left"
                    />
                </Row> */}
                <Row>
                    <Col>
                        <div>
                            <div className="card mb-0 responsive">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {this.state.Permission === "W" ?
                                                <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static" onClick={() => this.ClearDataBinding()}>เพิ่มข้อมูล</button> :
                                                <button class="btn btn-block btn-success" disabled type="button" style={{ width: '25%' }}>เพิ่มข้อมูล</button>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="datatable">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>ลำดับ</th>
                                                    <th>รูปสินค้า</th>
                                                    <th>รุ่นสินค้า</th>
                                                    <th>ประเภทสินค้า</th>
                                                    <th>รหัสสินค้า</th>
                                                    <th>ชื่อสินค้า</th>
                                                    <th>สถานะ</th>
                                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }} colSpan="2">จัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody> {this.renderTable()} </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <div className="modal" id="AddModalPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>เพิ่มข้อมูล</h3>
                                    <button type="button" className="close" data-dismiss="modal" onClick={() => this.ClearDataBinding()}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form class="responsefrm" onSubmit={this.AddDataInstallation}>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.LangID == "1"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาไทย</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.LangID == "2"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาอังกฤษ</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รุ่นสินค้า</label>
                                                <Select
                                                    value={this.state.Model}
                                                    onChange={this.handleChangeModel}
                                                    options={this.state.ListModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภท</label>
                                                <Select
                                                    value={this.state.Classified}
                                                    onChange={this.handleChangeClassified}
                                                    options={this.state.ListDataClassified}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
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
                                                <label className="small mb-1">ชื่อสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductName}
                                                    onChange={this.SetDataProductName}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">แนบไฟล์</label>
                                                <br></br>
                                                <input
                                                    className="py-1"
                                                    type="file"
                                                    onChange={this.onFileChange}
                                                    multiple="multiple"
                                                />
                                            </div>
                                        </div>
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
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
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
                    <div className="modal" id="EditModalPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '17%', width: '80%', marginTop: '3%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>จัดการข้อมูล</h3>
                                    <button type="button" className="close" data-dismiss="modal" onClick={() => this.ClearDataBinding()}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form class="responsefrm" onSubmit={this.UpdateDataInstallation}>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.LangID == "1"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาไทย</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.LangID == "2"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">ภาษาอังกฤษ</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">รุ่นสินค้า</label>
                                                <Select
                                                    value={this.state.Model}
                                                    onChange={this.handleChangeModel}
                                                    options={this.state.ListModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ประเภท</label>
                                                <Select
                                                    value={this.state.Classified}
                                                    onChange={this.handleChangeClassified}
                                                    options={this.state.ListDataClassified}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
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
                                                <label className="small mb-1">ชื่อสินค้า</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductName}
                                                    onChange={this.SetDataProductName}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">แนบไฟล์</label>
                                                <br></br>
                                                <input
                                                    className="py-1"
                                                    type="file"
                                                    onChange={this.onFileChange}
                                                    multiple="multiple"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
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
                                        </div>
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
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal" onClick={() => this.ClearDataBinding()}>ยกเลิก</button>
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
                  .modal-dialog{\
                    width: 500px;\
                  }\
                  .modal{\
                    z-index: 9999\
                  }\
                  .table-img{\
                    width: 200px\
                  }\
                  .responsefrm {\
                    max-width: 1250px;\
                    min-width: 720px;\
                  }\
                "}</style>
            </Container>
        );
    }
}
export default Installation;