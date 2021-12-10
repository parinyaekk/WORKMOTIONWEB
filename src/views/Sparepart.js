import React from "react";
import axios from "axios";
import Select from 'react-select';
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import moment from 'moment';
import { Activity, Download, Search,Settings } from 'react-feather';
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
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
// import BounceLoader from 'react-spinners/BounceLoader'
import Cookies from "js-cookie";
import LoadingOverlay from "react-loading-overlay";

const APIImagePath = global.config.variable.ImagePath;
const APIUrl = global.config.variable.Url;
class ManageProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            menu_name: 'Manage Sparepart & Installation',
            Permission: "",
            loading: false,
            ListDataProduct_Sparepart: [],
            ArrFile: [],
            ArrSparepart: [],
            ArrInstallation: [],
            optionsSpareModelMaster: [],
            optionsInstallationModelMaster: [],
            optionsSpareModel: [],
            optionsInstallationModel: [],
            optionsSpareClassified: [],
            optionsSpareSubClassified: [],
            optionsInstallationClassified: [],
            optionsInstallationSubClassified: [],
            optionsSpareType: [],
            optionsSpareSubType: [],
            optionsInstallationType: [],
            optionsInstallationSubType: [],
            FileIndex: null,
            EditSpareid: null,
            EditInstallid: null,
            Product_SpaID: null,
            LangID: 0,
            Model: '',
            SpareModel: '',
            InstallationModel: '',
            SpareType: '',
            InstallationType: '',
            SpareSubType: '',
            InstallationSubType: '',
            ProductName: '',
            SpareCode: '',
            SpareName: '',
            SparePrice: 0,
            ProductOldCode: '',
            OldProductOldCode: '',
            EditProductOldCode: '',
            EditLangID: 0,
            Action: 'add',
            AddType: 0, //0 = ทั้งสอง, 1 = เฉพาะอะไหล่, 2 = เฉพาะติดตั้ง
            AddFileType: 0, //0 = ทั้งสอง, 1 = เฉพาะอะไหล่, 2 = เฉพาะติดตั้ง
            IsEdit: false,
            HaveFile: false,
            Sparepart_id: null,
            IDFile: null,
            FileNow: null,
            SpareFile: null,
            InstallFile: null,
            PreviewImage: null,
            PreviewSpareImage: null,
            PreviewInstallImage: null,
            CoverImage: null,
            PreviewCoverImage: null,
            Href_Link: '',
            SpareHref: '',
            InstallationHref: '',
            ListDataProduct_SparepartTest: [],
            Page: 1,
            AllPage: 0,
            PerPage: 10,
            Status: 1,
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
                    field: "picture",
                    sort: "asc",
                    width: 150
                },
                {
                    label: 'ตัวเลือก',
                    field: 'type',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: "model",
                    field: "product_model",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "classified",
                    field: "product_class",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "sub classified",
                    field: "product_sub_class",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "รหัสสินค้า",
                    field: "product_Old_Code",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "ชื่อสินค้า",
                    field: "product_Name",
                    sort: "asc",
                    width: 150
                },
                {
                    label: 'ภาษา',
                    field: 'lang_ID',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'สถานะ',
                    field: 'is_Continue',
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
    
    async componentWillMount() {
        // this.GetAllProduct_SparepartList();
        this.GetDataPermission();
        this.GetAllProductModel();
        this.GetAllClassified();
        this.GetAllSubClassified();
        this.GetAllInstallationModel();
        this.GetAllInstallationClassified();
        this.GetAllInstallationSubClassified();
        this.GetAllProduct_SparepartListPerPage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

    async GetAllProduct_SparepartList() {
        await axios
            .post(`${APIUrl}Sparepart/GetAllProduct_SparepartList`)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ ListDataProduct_Sparepart: response.data.data });
                    this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async GetAllProduct_SparepartListPerPage(Page, PerPage, Search, StartDate, EndDate) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Page: Page,
            PerPage: PerPage,
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios
            .post(`${APIUrl}Sparepart/GetAllProduct_SparepartListPerPage`, temp)
            .then(response => {
                if (response.data.status == 0) {
                    let all_page = Math.ceil(parseInt(response.data.data_count) / parseInt(_this.state.PerPage));
                    _this.setState({ AllPage: all_page });
                    let TempData = [];
                    let no_ran = ((_this.state.Page - 1) * _this.state.PerPage);
                    response.data.data.map((item, index) => {
                        let TempSubData = {
                            no: (no_ran + (index + 1)),
                            picture: item.picture == null ? "No Image" : <img class="table-img" src={`${APIImagePath}` + item.picture} />,
                            type: item.type == 0 ? 'อะไหล่และติดตั้ง' : item.type == 1 ? 'เฉพาะอะไหล่' : 'เฉพาะติดตั้ง',
                            product_model: item.product_model,
                            product_class: item.product_class,
                            product_sub_class: item.product_sub_class == null ? '-' : item.product_sub_class,
                            product_Old_Code: item.product_Old_Code,
                            product_Name: item.product_Name,
                            lang_ID: item.lang_ID == 1 ? 'ภาษาไทย' : 'ภาษาอังกฤษ',
                            is_Continue: item.is_Continue === 1 ? "Active" : "Discontinued",
                            edit: this.state.Permission === "W" ?
                            <button style={{ marginTop: '-9px' }} type="button" onClick={() => _this.EditManageProduct(item.product_Old_Code, item.type)} class="btn btn-datatable" data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">
                                <img
                                    class="img-manage"
                                    src={require("../images/editor.png")}
                                    alt="Edit"
                                />
                            </button>
                            :
                            <button disabled style={{ marginTop: '-9px' }} type="button" onClick={() => _this.EditManageProduct(item.product_Old_Code, item.type)} class="btn btn-datatable" data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">
                                <img
                                    class="img-manage"
                                    src={require("../images/editor.png")}
                                    alt="Edit"
                                />
                            </button>,
                            delete: this.state.Permission === "W" ?
                            <button style={{ marginTop: '-9px' }} type="button" onClick={() => this.SetDeleteProductCode(item.product_Old_Code, item.lang_ID)} class="btn btn-datatable" data-toggle="modal" data-target="#PopDeleteProduct" data-backdrop="static">
                                <img
                                    class="img-manage"
                                    src={require("../images/DeleteIcon.png")}
                                    alt="Delete"
                                />
                            </button>
                            :
                            <button disabled style={{ marginTop: '-9px' }} type="button" onClick={() => this.SetDeleteProductCode(item.product_Old_Code, item.lang_ID)} class="btn btn-datatable" data-toggle="modal" data-target="#PopDeleteProduct" data-backdrop="static">
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
                        columns: _this.state.columns
                    };
                    _this.setState({ ListDataProduct_SparepartTest: dataTable });
                    _this.forceUpdate();
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    ClearSearch() {
        this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '' });
        window.location.reload();
    }

    async ExportExcel(Search, StartDate, EndDate) {
        var _this = this;
        _this.setState({ loading: true });
        let temp = {
            Search: Search,
            Start: StartDate,
            End: EndDate,
        };
        await axios.post(`${APIUrl}Sparepart/SparepartExport`, temp,
            {
                responseType: 'blob',
            }).then(response => {
                if (response.data != null) {
                    const url = URL.createObjectURL(new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', moment(Date()).format("yyyyMMDDHHmm") + "_DataSparepartExport.xlsx")
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

    async GetAllProductModel() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Sparepart/GetAllProductModel`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            value: index.id,
                            label: index.name,
                            lang_id: index.lang_id
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsSpareModelMaster: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async GetAllClassified() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Sparepart/GetAllClassified`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            fk_model_id: index.fk_model_id,
                            fk_classifi_id: index.fk_classifi_id,
                            value: index.classi_id,
                            label: index.classi_name
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsSpareClassified: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async GetAllSubClassified() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Sparepart/GetAllSubClassified`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            fk_model_id: index.fk_model_id,
                            fk_classifi_id: index.fk_classifi_id,
                            value: index.classi_id,
                            label: index.classi_name
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsSpareSubClassified: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async GetAllInstallationModel() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Installation/GetAllInstallationModel`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            value: index.id,
                            label: index.name,
                            lang_id: index.lang_id
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsInstallationModelMaster: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async GetAllInstallationClassified() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Installation/GetAllInstallationClassified`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            fk_model_id: index.fk_model_id,
                            fk_classifi_id: index.fk_classifi_id,
                            value: index.classi_id,
                            label: index.classi_name
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsInstallationClassified: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async GetAllInstallationSubClassified() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Installation/GetAllInstallationSubClassified`)
            .then(response => {
                if (response.data.status == 0) {
                    var data = response.data.data;
                    var ListTemp = [];
                    Array.prototype.forEach.call(data, function (index) {
                        var Obj = {
                            fk_model_id: index.fk_model_id,
                            fk_classifi_id: index.fk_classifi_id,
                            value: index.classi_id,
                            label: index.classi_name
                        };
                        ListTemp.push(Obj);
                    });
                    _this.setState({ optionsInstallationSubClassified: ListTemp });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async EditManageProduct(product_Old_Code, datatype) {
        var _this = this;
        _this.setState({ loading: true });
        let Temp = {
            Product_Old_Code: product_Old_Code,
        };
        await axios
            .post(`${APIUrl}Sparepart/GetProductByCode`, Temp)
            .then(response => {
                if (response.data.status == 0) {
                    var TempData = response.data.data;
                    var subTempData = response.data.subData;
                    _this.EditsetDataLangID(TempData != null ? TempData.lang_id : subTempData == null ? 1 : subTempData.lang_id);
                    var spareModel = null;
                    var classified = null;
                    var subclassified = null;
                    var insModel = null;
                    var insclassified = null;
                    var inssubclassified = null;
                    if (TempData != null) {
                        //spare
                        spareModel = _this.state.optionsSpareModel.filter(x => x.value == (TempData.sparepart_model == null ? 0 : TempData.sparepart_model.value));
                        _this.EdithandleChangeSpareModel(spareModel[0]);
                        if (spareModel.length > 0) {
                            classified = _this.state.optionsSpareType.filter(x => x.value == (TempData.sparepart_classified == null ? 0 : TempData.sparepart_classified.value));
                            _this.handleChangeSpareType(classified[0]);
                            if (classified.length > 0) {
                                subclassified = _this.state.optionsSpareSubType.filter(x => x.value == (TempData.sparepart_sub_classified == null ? 0 : TempData.sparepart_sub_classified.value));
                            }
                        }
                    }
                    //install
                    if (subTempData != null) {
                        insModel = _this.state.optionsInstallationModel.filter(x => x.value == (subTempData.installation_model == null ? 0 : subTempData.installation_model.value));
                        _this.handleChangeInstallationModel(insModel[0]);
                        if (insModel.length > 0) {
                            insclassified = _this.state.optionsInstallationType.filter(x => x.value == (subTempData.installation_classified == null ? 0 : subTempData.installation_classified.value));
                            _this.handleChangeInstallationType(insclassified[0]);
                            if (insclassified.length > 0) {
                                inssubclassified = _this.state.optionsInstallationSubType.filter(x => x.value == (subTempData.installation_sub_classified == null ? 0 : subTempData.installation_sub_classified.value));
                            }
                        }
                    }
                    // console.log(JSON.stringify(TempData));
                    _this.setState({
                        LangID: TempData != null ? TempData.lang_id : subTempData == null ? 1 : subTempData.lang_id,
                        ProductOldCode: TempData != null ? TempData.product_old_code : subTempData == null ? null : subTempData.product_old_code,
                        OldProductOldCode: TempData != null ? TempData.product_old_code : subTempData == null ? null : subTempData.product_old_code,
                        ProductName: TempData != null ? TempData.product_name : subTempData == null ? null : subTempData.product_name,
                        Status: TempData == null ? 1 : TempData.active,
                        SpareModel: spareModel == null ? null : spareModel[0],
                        SpareType: classified == null ? null : classified[0],
                        SpareSubType: subclassified == null ? null : subclassified[0],
                        InstallationModel: insModel == null ? null : insModel[0],
                        InstallationType: insclassified == null ? null : insclassified[0],
                        InstallationSubType: inssubclassified == null ? null : inssubclassified[0],
                        Action: "edit",
                        AddType: datatype,
                    });
                    var FileSpare = [];
                    _this.state.ArrFile = [];
                    if (TempData != null) {
                        for (let i = 0; i < TempData.sparepart_product_picture.length; i++) {
                            var Temp = {
                                spare_id: TempData.sparepart_product_picture[i].spare_id,
                                install_id: TempData.sparepart_product_picture[i].install_id,
                                name: TempData.sparepart_product_picture[i].name,
                                type: TempData.sparepart_product_picture[i].type,
                                path: TempData.sparepart_product_picture[i].path,
                                link: TempData.sparepart_product_picture[i].link,
                                coverimage_path: TempData.sparepart_product_picture[i].coverimage_path,
                            }
                            _this.state.ArrFile.push(Temp);
                        }

                        for (let i = 0; i < TempData.sparepart.length; i++) {
                            var res = {
                                SpareFile: {
                                    Type: 'Old',
                                    File: {
                                        id: TempData.sparepart[i].spareFile.length > 0 ? TempData.sparepart[i].spareFile[0].id : null,
                                        link: TempData.sparepart[i].spareFile.length > 0 ? TempData.sparepart[i].spareFile[0].link : null,
                                        name: TempData.sparepart[i].spareFile.length > 0 ? TempData.sparepart[i].spareFile[0].name : null,
                                        path: TempData.sparepart[i].spareFile.length > 0 ? TempData.sparepart[i].spareFile[0].path : null,
                                        type: TempData.sparepart[i].spareFile.length > 0 ? TempData.sparepart[i].spareFile[0].type : null,
                                    }
                                },
                                Sparepart_id: TempData.sparepart[i].sparepart_id,
                                SpareHref: TempData.sparepart[i].spareHref,
                                SpareCode: TempData.sparepart[i].spareCode,
                                SpareName: TempData.sparepart[i].spareName,
                                SparePrice: TempData.sparepart[i].sparePrice,
                                HaveFile: TempData.sparepart[i].spareFile.length > 0 ? 1 : 0,
                            };
                            FileSpare.push(res);
                        }
                    }
                    _this.setState({ ArrSparepart: FileSpare });

                    var FileInstall = [];
                    if (subTempData != null) {
                        for (let i = 0; i < subTempData.installation_product_picture.length; i++) {
                            var Temp = {
                                spare_id: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].spare_id : null,
                                install_id: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].install_id : null,
                                name: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].name : null,
                                type: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].type : null,
                                path: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].path : null,
                                link: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].link : null,
                                coverimage_path: subTempData.installation_product_picture.length > 0 ? subTempData.installation_product_picture[i].coverimage_path : null
                            }
                            _this.state.ArrFile.push(Temp);
                        }
                        for (let i = 0; i < subTempData.installation_file.length; i++) {
                            var res = {
                                InstallFile: {
                                    File: {
                                        id: subTempData.installation_file[i].id,
                                        link: subTempData.installation_file[i].link,
                                        name: subTempData.installation_file[i].name,
                                        path: subTempData.installation_file[i].path,
                                        type: subTempData.installation_file[i].type,
                                    }
                                },
                                InstallFile_ID: subTempData.installation_file[i].id,
                                PreviewInstallImage: subTempData.installation_file[i].path,
                                InstallationHref: subTempData.installation_file[i].spareHref,
                            };
                            FileInstall.push(res);
                        }
                    }
                    _this.setState({ ArrInstallation: FileInstall });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function()  {
                _this.setState({ loading: false });
            });
    }

    async SaveData() {
        var _this = this;
        _this.setState({ loading: true });
        const data = new FormData();
        var pass = true;
        var Temp = {};
        if (_this.state.ProductOldCode == '' || _this.state.ProductName == '') {
            alert('Please fill in required fields');
            document.getElementById("ProductOldCode").focus();
            pass = false;
            _this.setState({ loading: false });
        }
        else {
            if (_this.state.OldProductOldCode != _this.state.ProductOldCode) {
                await axios.post(`${APIUrl}Sparepart/CheckProductCode?ProductCode=` + _this.state.ProductOldCode + `&Lang_ID=` + _this.state.LangID + `&Type=` + _this.state.AddType)
                    .then(response => {
                        if (response.data.status == 0) {
                            pass = true;
                        }
                        else {
                            alert('Cannot use this product code.');
                            document.getElementById("ProductOldCode").focus();
                            pass = false;
                        }
                    })
                    .catch(err => {
                        alert(err);
                        document.getElementById("ProductOldCode").focus();
                        pass = false;
                    })
                    .finally(() => {
                        _this.setState({ loading: false });
                    });
            }
            if (_this.state.Action == 'add') {
                await axios.post(`${APIUrl}Sparepart/CheckProductCode?ProductCode=` + _this.state.ProductOldCode + `&Lang_ID=` + _this.state.LangID + `&Type=` + _this.state.AddType)
                    .then(response => {
                        if (response.data.status == 0) {
                            pass = true;
                        }
                        else {
                            alert('Cannot use this product code.');
                            document.getElementById("ProductOldCode").focus();
                            pass = false;
                        }
                    })
                    .catch(err => {
                        alert(err);
                        document.getElementById("ProductOldCode").focus();
                        pass = false;
                    })
                    .finally(() => {
                         _this.setState({ loading: false });
                    });
            }

            if (pass) {
                if (_this.state.ArrFile.length > 0) {
                    Temp = {
                        // BothSet
                        LangID: _this.state.LangID,
                        ProductName: _this.state.ProductName,
                        Product_Old_Code: _this.state.ProductOldCode,
                        Old_Product_Old_Code: _this.state.OldProductOldCode,
                        Status: _this.state.Status,
                        File: _this.state.ArrFile,
                        SpareModel: _this.state.SpareModel == null ? null : _this.state.SpareModel.value,
                        SpareType: _this.state.SpareType == null ? null : _this.state.SpareType.value,
                        SpareSubType: _this.state.SpareSubType == null ? null : _this.state.SpareSubType.value,
                        InstallationModel: _this.state.InstallationModel == null ? null : _this.state.InstallationModel.value,
                        InstallationType: _this.state.InstallationType == null ? null : _this.state.InstallationType.value,
                        InstallationSubType: _this.state.InstallationSubType == null ? null : _this.state.InstallationSubType.value,
                        // SpareSet
                        ArrSparepart: _this.state.ArrSparepart == null ? [] : _this.state.ArrSparepart,
                        // InstallationSet
                        ArrInstallation: _this.state.ArrInstallation == null ? [] : _this.state.ArrInstallation,
                        AddType: _this.state.AddType,
                        Action: _this.state.Action,
                    };
                } else {
                    Temp = {
                        // BothSet
                        LangID: _this.state.LangID,
                        ProductName: _this.state.ProductName,
                        Product_Old_Code: _this.state.ProductOldCode,
                        Old_Product_Old_Code: _this.state.OldProductOldCode,
                        Status: _this.state.Status,
                        File: [],
                        SpareModel: _this.state.SpareModel == null ? null : _this.state.SpareModel.value,
                        SpareType: _this.state.SpareType == null ? null : _this.state.SpareType.value,
                        SpareSubType: _this.state.SpareSubType == null ? null : _this.state.SpareSubType.value,
                        InstallationModel: _this.state.InstallationModel == null ? null : _this.state.InstallationModel.value,
                        InstallationType: _this.state.InstallationType == null ? null : _this.state.InstallationType.value,
                        InstallationSubType: _this.state.InstallationSubType == null ? null : _this.state.InstallationSubType.value,
                        // SpareSet
                        ArrSparepart: _this.state.ArrSparepart == null ? [] : _this.state.ArrSparepart,
                        // InstallationSet
                        ArrInstallation: _this.state.ArrInstallation == null ? [] : _this.state.ArrInstallation,
                        AddType: _this.state.AddType,
                        Action: _this.state.Action,
                    }
                }
                for (let i = 0; i < _this.state.ArrSparepart.length; i++) {
                    if (_this.state.ArrSparepart[i].SpareFile != null) {
                        data.append('ArrSparepart', _this.state.ArrSparepart[i].SpareFile.File);
                    }
                }
                for (let i = 0; i < _this.state.ArrInstallation.length; i++) {
                    if (_this.state.ArrInstallation[i].InstallFile != null) {
                        data.append('ArrInstallation', _this.state.ArrInstallation[i].InstallFile.File);
                    }
                }
                data.append('jsondata', JSON.stringify(Temp));
                // console.log(JSON.stringify(Temp));
                await axios.post(`${APIUrl}Sparepart/SaveDataSparepart`, data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(response => {
                    if (response.data.status == 0) {
                        alert("Save Success");
                        window.location.reload();
                    }
                    else {
                        alert(response.data.Message);
                    }
                })
                .catch(err => {
                    alert(err);
                })
                .finally(() => {
                    _this.setState({ loading: false });
                });
            }
        }
    }

    async DeleteProduct() {
        let Temp = {
            ID: this.state.Product_SpaID
        };
        await axios
            .post(`${APIUrl}Sparepart/DeleteProduct`, Temp)
            .then(response => {
                if (response.data.status == 0) {
                    this.setState({ Product_SpaID: null });
                    alert("Delete Success");
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    ClearSparepartData() {
        this.setState({ SpareCode: "", SpareName: "", SpareHref: "", SparePrice: 0, SpareFile: null, PreviewSpareImage: null, HaveFile: false, Sparepart_id: null });
        document.getElementById("sparefile").value = "";
    }

    AddSparepart() {
        var _this = this;
        var TempData = {
            SpareFile: _this.state.SpareFile,
            HaveFile: _this.state.HaveFile,
            SpareCode: _this.state.SpareCode,
            SpareName: _this.state.SpareName,
            SparePrice: _this.state.SparePrice,
            SpareHref: _this.state.SpareHref,
        }
        this.state.ArrSparepart.push(TempData);
        _this.ClearSparepartData();
    };

    async EditSparepart() {
        var _this = this;
        const data = new FormData();
        var Temp = {
            LangID: _this.state.LangID,
            Sparepart_id: this.state.Sparepart_id,
            SpareCode: this.state.SpareCode,
            SpareHref: this.state.SpareHref,
            SpareName: this.state.SpareName,
            SparePrice: this.state.SparePrice,
        }

        // var test = _this.state.ArrSparepart.findIndex(x => x.Sparepart_id == _this.state.Sparepart_id);
        // console.log(_this.state.ArrSparepart[test]);
        // if(test > -1)
        // {
        //     _this.state.ArrSparepart[test].SpareCode = _this.state.SpareCode;
        //     _this.state.ArrSparepart[test].SpareHref = _this.state.SpareHref;
        //     _this.state.ArrSparepart[test].SpareName = _this.state.SpareName;
        //     _this.state.ArrSparepart[test].SparePrice = _this.state.SparePrice;
        // }

        data.append('jsondata', JSON.stringify(Temp));
        data.append('ArrSparepart', _this.state.SpareFile == null ? null : _this.state.SpareFile.File);
        await axios.post(`${APIUrl}Sparepart/SaveSpareByID`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status === 0) {
                    document.getElementById("form-file").reset();
                    $('#file').val('');
                    _this.ClearSparepartData();
                    this.forceUpdate();
                    this.EditManageProduct(_this.state.ProductOldCode, _this.state.AddType);
                }
            })
            .catch((err) => {
                alert(err);
            });
    };



    onSpareFileDelete(value) {
        if (window.confirm("ยืนยันการลบข้อมูล?")) {
            this.state.ArrSparepart.splice(value, 1);
        }
        this.forceUpdate();
    };

    ClearInstalltData() {
        this.setState({ InstallationHref: "", InstallFile: null, PreviewInstallImage: null });
        document.getElementById("instfile").value = "";
    }

    AddInstallation() {
        var _this = this;
        var TempData = {
            PreviewInstallImage: _this.state.PreviewInstallImage,
            InstallFile: _this.state.InstallFile,
            InstallationHref: _this.state.InstallationHref,
        }
        this.state.ArrInstallation.push(TempData);
        _this.ClearInstalltData();
    };

    onInstallFileDelete(value) {
        if (window.confirm("ยืนยันการลบข้อมูล?")) {
            this.state.ArrInstallation.splice(value, 1);
        }
        this.forceUpdate();
    };

    async AddFileSparepart() {
        const data = new FormData();
        data.append('AddType', this.state.AddFileType);
        data.append('id', this.state.IDFile);
        data.append('HrefLink', this.state.Href_Link);
        data.append('files', this.state.FileNow);
        data.append('CoverImage', this.state.CoverImage);
        await axios.post(`${APIUrl}Sparepart/UploadFile`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status === 0) {
                    var Temp = {
                        spare_id: response.data.data.spare_id,
                        install_id: response.data.data.install_id,
                        name: response.data.data.file_name,
                        type: response.data.data.file_type,
                        path: response.data.data.file_path,
                        link: response.data.data.link,
                        coverimage_path: response.data.data.coverimage_path,
                    }
                    this.state.ArrFile.push(Temp);
                    this.setState({ FileNow: null });
                    this.setState({ Href_Link: null });
                    this.setState({ PreviewImage: null });
                    this.setState({ PreviewCoverImage: null });
                    document.getElementById("form-file").reset();
                    $('#file').val('');
                    this.forceUpdate();
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    async SetEditSpare(Value) {
        this.setState({
            IsEdit: true,
            SpareCode: Value.SpareCode,
            HaveFile: Value.HaveFile,
            Sparepart_id: Value.Sparepart_id,
            SpareHref: Value.SpareHref,
            SpareName: Value.SpareName,
            SparePrice: Value.SparePrice,
            SpareFile: Value.SpareFile,
            PreviewSpareImage: Value.SpareFile == null ? null : Value.SpareFile.File.path,
        });
        this.forceUpdate();
    };

    SetDeleteProductCode(value, value2) {
        this.setState({ EditProductOldCode: value, EditLangID: value2 });
    };

    DeleteProductByCode(product_old_code, type, langid) {
        if (window.confirm("ยืนยันการลบข้อมูล?")) {
            axios
                .post(`${APIUrl}Sparepart/DeleteProductByCode?product_old_code=` + product_old_code + `&Type=` + type + `&Lang_ID=` + langid)
                .then(response => {
                    if (response.data.status == 0) {
                        alert("Delete Success");
                        window.location.reload();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        this.forceUpdate();
    };

    onSpareDelete() {
        this.state.ArrFile.splice(this.state.FileIndex, 1);
        axios.post(`${APIUrl}Sparepart/DeleteProductPictureByCode?spare_id=` + this.state.EditSpareid + `&install_id=` + this.state.EditInstallid)
            .then(response => {
                if (response.data.status == 0) {
                    alert("Delete Success");
                }
            })
            .catch(err => {
                console.log(err);
            });
        $("#DeleteConfirmModalPopup").removeAttr("style").hide();
        this.forceUpdate();
    };

    async SetFileIndex(Index, spare_id, install_id) {
        this.setState({ FileIndex: Index, EditSpareid: spare_id, EditInstallid: install_id });
    }

    setDataLangID = event => {
        this.setState({ LangID: event.target.value });
        if (event != null && event != "") {
            var tempClassified = this.state.optionsSpareModelMaster.filter(x => x.lang_id == parseInt(event.target.value));
            var ListTemp = [];
            Array.prototype.forEach.call(tempClassified, function (index) {
                var Obj = {
                    value: index.value,
                    label: index.label,
                    lang_id: index.lang_id
                };
                ListTemp.push(Obj);
            });
            var tempClassified2 = this.state.optionsInstallationModelMaster.filter(x => x.lang_id == parseInt(event.target.value));
            var ListTemp2 = [];
            Array.prototype.forEach.call(tempClassified2, function (index2) {
                var Obj2 = {
                    value: index2.value,
                    label: index2.label,
                    lang_id: index2.lang_id
                };
                ListTemp2.push(Obj2);
            });

            this.setState({ optionsSpareModel: ListTemp });
            this.setState({ optionsInstallationModel: ListTemp2 });
        }
    }

    EditsetDataLangID = event => {
        this.setState({ LangID: event });
        if (event != null && event != "") {
            var tempClassified = this.state.optionsSpareModelMaster.filter(x => x.lang_id == parseInt(event));
            var ListTemp = [];
            Array.prototype.forEach.call(tempClassified, function (index) {
                var Obj = {
                    value: index.value,
                    label: index.label,
                    lang_id: index.lang_id
                };
                ListTemp.push(Obj);
            });
            var tempClassified2 = this.state.optionsInstallationModelMaster.filter(x => x.lang_id == parseInt(event));
            var ListTemp2 = [];
            Array.prototype.forEach.call(tempClassified2, function (index2) {
                var Obj2 = {
                    value: index2.value,
                    label: index2.label,
                    lang_id: index2.lang_id
                };
                ListTemp2.push(Obj2);
            });

            this.setState({ optionsSpareModel: ListTemp });
            this.setState({ optionsInstallationModel: ListTemp2 });
        }
    }

    handleChangeSpareModel = event => {
        this.setState({ SpareModel: event });
        this.setState({ SpareType: null });
        this.setState({ SpareSubType: null });
        if (event != null && event != "") {
            var test = this.state.optionsSpareClassified;
            var tempClassified = this.state.optionsSpareClassified.filter(x => x.fk_model_id == parseInt(event.value));
            var ArrTempClassified = [];
            Array.prototype.forEach.call(tempClassified, function (index) {
                var ClassifiedObj = {
                    fk_model_id: index.fk_model_id,
                    fk_classifi_id: index.fk_classifi_id,
                    value: index.value,
                    label: index.label
                };
                ArrTempClassified.push(ClassifiedObj);
            });
        }
        this.setState({ optionsSpareType: ArrTempClassified });
    };

    EdithandleChangeSpareModel = event => {
        this.setState({ SpareModel: event });
        this.setState({ SpareType: null });
        this.setState({ SpareSubType: null });
        if (event != null && event != "") {
            var test = this.state.optionsSpareClassified;
            var tempClassified = this.state.optionsSpareClassified.filter(x => x.fk_model_id == parseInt(event.value));
            var ArrTempClassified = [];
            Array.prototype.forEach.call(tempClassified, function (index) {
                var ClassifiedObj = {
                    fk_model_id: index.fk_model_id,
                    fk_classifi_id: index.fk_classifi_id,
                    value: index.value,
                    label: index.label
                };
                ArrTempClassified.push(ClassifiedObj);
            });
        }
        this.setState({ optionsSpareType: ArrTempClassified });
    };

    handleChangeInstallationModel = event => {
        this.setState({ InstallationModel: event });
        this.setState({ InstallationType: null });
        this.setState({ InstallationSubType: null });
        if (event != null && event != "") {
            var tempClassified = this.state.optionsInstallationClassified.filter(x => x.fk_model_id == parseInt(event.value));
            var ArrTempClassified = [];
            Array.prototype.forEach.call(tempClassified, function (index) {
                var ClassifiedObj = {
                    fk_model_id: index.fk_model_id,
                    fk_classifi_id: index.fk_classifi_id,
                    value: index.value,
                    label: index.label
                };
                ArrTempClassified.push(ClassifiedObj);
            });
        }
        this.setState({ optionsInstallationType: ArrTempClassified });
    };

    handleChangeSpareType = event => {
        this.setState({ SpareType: event });
        this.setState({ SpareSubType: null });
        if (event != null && event != "") {
            var tempClassified = this.state.optionsSpareSubClassified.filter(x => x.fk_classifi_id == parseInt(event.value));
            var ArrTempSubClassified = [];
            var SubClassifiedObj = {
                value: null,
                label: 'ไม่มีหัวข้อย่อย'
            };
            ArrTempSubClassified.push(SubClassifiedObj);
            Array.prototype.forEach.call(tempClassified, function (index) {
                SubClassifiedObj = {
                    fk_model_id: index.fk_model_id,
                    fk_classifi_id: index.fk_classifi_id,
                    value: index.value,
                    label: index.label
                };
                ArrTempSubClassified.push(SubClassifiedObj);
            });
        }
        this.setState({ optionsSpareSubType: ArrTempSubClassified });
    };

    handleChangeInstallationType = event => {
        this.setState({ InstallationType: event });
        this.setState({ InstallationSubType: null });
        var test = this.state.optionsInstallationSubClassified;
        if (event != null && event != "") {
            var tempClassified = this.state.optionsInstallationSubClassified.filter(x => x.fk_classifi_id == parseInt(event.value));
            var ArrTempSubClassified = [];
            var SubClassifiedObj = {
                value: null,
                label: 'ไม่มีหัวข้อย่อย'
            };
            ArrTempSubClassified.push(SubClassifiedObj);
            Array.prototype.forEach.call(tempClassified, function (index) {
                SubClassifiedObj = {
                    fk_model_id: index.fk_model_id,
                    fk_classifi_id: index.fk_classifi_id,
                    value: index.value,
                    label: index.label
                };
                ArrTempSubClassified.push(SubClassifiedObj);
            });
        }
        this.setState({ optionsInstallationSubType: ArrTempSubClassified });
    };

    handleChangeSpareSubType = event => {
        this.setState({ SpareSubType: event });
    };
    handleChangeInstallationSubType = event => {
        this.setState({ InstallationSubType: event });
    };

    SetDataProductName = event => {
        this.setState({ ProductName: event.target.value });
    }

    SetDataSpareCode = event => {
        this.setState({ SpareCode: event.target.value });
    }

    SetDataSpareName = event => {
        this.setState({ SpareName: event.target.value });
    }

    SetDataSparePrice = event => {
        this.setState({ SparePrice: event.target.value });
    }

    SetDataMaterialOldCode = event => {
        if (this.state.Action == 'add') {
            this.setState({ ProductOldCode: event.target.value });
            this.setState({ OldProductOldCode: event.target.value });
        }
        else if (this.state.Action == 'edit') {
            this.setState({ ProductOldCode: event.target.value });
        }
    }

    onFileChange = event => {
        let files = event.target.files;
        this.setState({ FileNow: event.target.files[0] });
        let reader = new FileReader();
        reader.onload = r => {
            // console.log(r.target.result);
            this.setState({ PreviewImage: r.target.result });
        };
        reader.readAsDataURL(files[0]);
    };

    onFileSpareChange = event => {
        if (event != '' || event != null) {
            let files = event.target.files;
            var FileObj = {
                File: event.target.files[0],
                Type: "New"
            };
            let reader = new FileReader();
            reader.onload = r => {
                this.setState({ PreviewSpareImage: r.target.result });
            };
            reader.readAsDataURL(files[0]);
            this.setState({ SpareFile: FileObj });
            this.setState({ HaveFile: true });
        }
    };

    onFileInstallChange = event => {
        if (event != '' || event != null) {
            let files = event.target.files;
            var FileObj = {
                File: event.target.files[0],
                Type: "New"
            };
            let reader = new FileReader();
            reader.onload = r => {
                this.setState({ PreviewInstallImage: r.target.result });
            };
            reader.readAsDataURL(files[0]);
            this.setState({ InstallFile: FileObj });
        }
    };

    onCoverImage = event => {
        let files = event.target.files;
        this.setState({ CoverImage: event.target.files[0] });
        let reader = new FileReader();
        reader.onload = r => {
            // console.log(r.target.result);
            this.setState({ PreviewCoverImage: r.target.result });
        };
        reader.readAsDataURL(files[0]);
    };

    SetDataHref_Link = event => {
        this.setState({ Href_Link: event.target.value });
    };

    SetDataSpareHref = event => {
        this.setState({ SpareHref: event.target.value });
    };

    SetDataInstallationHref = event => {
        this.setState({ InstallationHref: event.target.value });
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
            this.GetAllProduct_SparepartListPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        }
    }

    ChangeSearch = event => {
        this.setState({ Search: event.target.value });
    }

    ChangePerPage = event => {
        this.setState({ PerPage: event.target.value });
        this.GetAllProduct_SparepartListPerPage(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    };

    ChangeAddType = event => {
        this.setState({ AddType: event.target.value });
    };

    ChangeAddFileType = event => {
        this.setState({ AddFileType: event.target.value });
    };

    ChangeStatus = event => {
        this.setState({ Status: event.target.value });
    };

    ClearForAdd = event => {
        this.setState({
            optionsSpareModel: [],
            optionsSpareType: [],
            optionsSpareSubType: [],
            optionsInstallationMode: [],
            optionsInstallationType: [],
            optionsInstallationSubType: [],
            LangID: 0,
            ProductOldCode: '',
            OldProductOldCode: '',
            ProductName: '',
            Status: 1,
            SpareModel: '',
            SpareType: '',
            SpareSubType: '',
            InstallationModel: '',
            InstallationType: '',
            InstallationSubType: '',
            Action: 'add',
            ArrSparepart: [],
            ArrFile: [],
            ArrInstallation: [],
        });
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
        this.GetAllProduct_SparepartListPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllProduct_SparepartListPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
        this.GetAllProduct_SparepartListPerPage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
        this.forceUpdate();
    };

    renderPagination() {
        let page = []
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

    renderTableFile() {
        return this.state.ArrFile.map((item, index) => {
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >{(item.spare_id != 0 && item.install_id != 0) ? 'อะไหล่และติดตั้ง' : (item.spare_id == 0 && item.install_id != 0) ? 'เฉพาะติดตั้ง' : (item.spare_id != 0 && item.install_id == 0) ? 'เฉพาะอะไหล่' : '-'}</td>
                    <td>
                        {item.type.includes("image") ? <img className="table-img" src={`${APIImagePath}` + item.path} /> : "No Image"}
                    </td>
                    <td>
                        {item.coverimage_path != null ? <img className="table-img" src={`${APIImagePath}` + item.coverimage_path} /> : "No Image"}
                    </td>
                    <td >{item.name}</td>
                    <td >{item.link}</td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" onClick={() => this.SetFileIndex(index, item.spare_id, item.install_id)} class="btn btn-datatable" data-toggle="modal" data-target="#DeleteConfirmModalPopup" data-backdrop="static">
                            <img
                                class="img-manage"
                                src={require("../images/DeleteIcon.png")}
                                alt="Delete"
                            />
                        </button>
                    </td>
                </tr>
            );
        });
    };

    renderTableSparepart() {
        return this.state.ArrSparepart.map((item, index) => {
            if (item.SpareFile != null) {
                if (item.SpareFile.Type == "New") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#tblImg' + index).attr('src', e.target.result);
                    };
                    reader.readAsDataURL(item.SpareFile.File);
                }
            }
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    {item.SpareFile == null && <td> ไม่มีรูปภาพ </td>}
                    {(item.SpareFile != null && item.SpareFile.Type == "New") && <td> <img id={"tblImg" + index} src={item.SpareFile.File.name} class="table-img"></img></td>}
                    {(item.SpareFile != null && item.SpareFile.Type == "Old" && item.SpareFile.File.path != null) && <td> <img class="table-img" src={`${APIImagePath}` + item.SpareFile.File.path}></img></td>}
                    {(item.SpareFile != null && item.SpareFile.Type == "Old" && item.SpareFile.File.path == null) && <td>  ไม่มีรูปภาพ </td>}
                    <td >{item.SpareCode}</td>
                    <td >{item.SpareName}</td>
                    <td >{item.SparePrice}</td>
                    <td >{item.SpareHref}</td>
                    <td>
                        {item.Sparepart_id != null && <button style={{ marginTop: '-9px' }} type="button" onClick={() => this.SetEditSpare(item)} class="btn btn-datatable">
                            <img
                                class="img-manage"
                                src={require("../images/editor.png")}
                                alt="Edit"
                            />
                        </button>}
                        <button style={{ marginTop: '-9px' }} type="button" onClick={() => this.onSpareFileDelete(index)} class="btn btn-datatable">
                            <img
                                class="img-manage"
                                src={require("../images/DeleteIcon.png")}
                                alt="Delete"
                            />
                        </button>
                    </td>
                </tr>
            );
        });
    };

    renderTableInstalltion() {
        return this.state.ArrInstallation.map((item, index) => {
            return (
                <tr key={index} style={{ border: "1px solid #dee2e6" }}>
                    <td >{index + 1}</td>
                    {item.InstallFile != null &&
                        <img className="table-img" style={{ float: 'center', width: '10%', border: '0' }} alt="Card Image"
                            src={item.InstallFile.File.type.includes("application/pdf") == true ? require("../images/PDF.png") :
                                item.InstallFile.File.type.includes("pplication/vnd.openxmlformats-officedocument.wordprocessingml.document") == true ? require("../images/Word.webp") :
                                    item.InstallFile.File.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") == true ? require("../images/Excel.png") :
                                        item.InstallFile.File.type.includes("video/mp4") == true ? require("../images/File.png") :
                                            item.PreviewInstallImage} />} &nbsp; <a href={`${APIImagePath}` + item.InstallFile.File.path} target="_blank">{item.InstallFile.File.name}</a>
                    <td >{item.InstallationHref}</td>
                    <td>
                        <button style={{ marginTop: '-9px' }} type="button" onClick={() => this.onInstallFileDelete(index)} class="btn btn-datatable" >
                            <img
                                class="img-manage"
                                src={require("../images/DeleteIcon.png")}
                                alt="Delete"
                            />
                        </button>
                    </td>
                </tr>
            );
        });
    };

    // position: fixed;
    // z-index: 9999;
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
                                        <div class="page-header-icon"><Settings /></div>
                                        Manage Sparepart & Installation
                                    </h1>
                                    <div class="page-header-subtitle">จัดการข้อมูลอะไหล่ และข้อมูลการติดตั้ง</div>
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
                                                <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }} onClick={() => this.ClearForAdd()} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">เพิ่มข้อมูล</button> :
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
                                                    <button className="btn btn-success" onClick={() => this.GetAllProduct_SparepartListPerPage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                                                    &nbsp;
                                                </div>
                                                <div className="col-md-5">
                                                    <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <MDBTable responsive hover>
                                        <MDBTableHead columns={this.state.ListDataProduct_SparepartTest.columns} />
                                        <MDBTableBody rows={this.state.ListDataProduct_SparepartTest.rows} />
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
                                    <h3 style={{ fontSize: '25px' }}>{this.state.Action == 'add' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form class="responsefrm">
                                        <div className="form-group col-md-3">
                                            <label className="small mb-1" style={{ fontSize: '18px', color: '#58a7af' }}>ข้อมูลสินค้า</label>
                                        </div>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <label className="small mb-1">
                                                    <input
                                                        type="radio" name="Thai"
                                                        value={1}
                                                        checked={this.state.LangID == "1"}
                                                        onChange={this.setDataLangID} />
                                                    &nbsp;&nbsp;
                                                ภาษาไทย</label>
                                                &nbsp;&nbsp;
                                                <label className="small mb-1">
                                                    <input
                                                        type="radio" name="English"
                                                        value={2}
                                                        checked={this.state.LangID == "2"}
                                                        onChange={this.setDataLangID} />
                                                    &nbsp;&nbsp;
                                                ภาษาอังกฤษ</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-2">
                                                <label className="small mb-1">ประเภทการบันทึก</label>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.AddType}
                                                    onChange={this.ChangeAddType}
                                                >
                                                    <option value="0">อะไหล่และติดตั้ง</option>
                                                    <option value="1">เฉพาะอะไหล่</option>
                                                    <option value="2">เฉพาะติดตั้ง</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1" style={{ color: 'red' }}>*</label>
                                                <label className="small mb-1">Product Code</label>
                                                <input
                                                    className="form-control py-1"
                                                    id="ProductOldCode"
                                                    type="text"
                                                    value={this.state.ProductOldCode}
                                                    onChange={this.SetDataMaterialOldCode}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1" style={{ color: 'red' }}>*</label>
                                                <label className="small mb-1">Product Name</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ProductName}
                                                    onChange={this.SetDataProductName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Status</label>
                                                <select className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={this.state.Status}
                                                    onChange={this.ChangeStatus}>
                                                    <option value="1">Active</option>
                                                    <option value="0">Discontinued</option>
                                                </select>
                                            </div>
                                        </div>
                                        <br></br>
                                        <form id="form-file">
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">รูปโควเวอร์</label>
                                                    <input type="file" id="file" class="form-control-file" onChange={this.onCoverImage} />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">รูป</label>
                                                    <input type="file" id="file" class="form-control-file" onChange={this.onFileChange} />
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label className="small mb-1">ลิงก์</label>
                                                    <input className="form-control py-1" type="text" value={this.state.Href_Link} onChange={this.SetDataHref_Link} />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label className="small mb-1">ตัวเลือก</label>
                                                    <select className="custom-select custom-select-sm form-control form-control-sm"
                                                        value={this.state.AddFileType}
                                                        onChange={this.ChangeAddFileType}
                                                    >
                                                        <option value="0">อะไหล่และติดตั้ง</option>
                                                        <option value="1">เฉพาะอะไหล่</option>
                                                        <option value="2">เฉพาะติดตั้ง</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-1" style={{ paddingTop: '25px' }} >
                                                    {(this.state.FileNow == null && this.state.CoverImage == null) && <button type="button" class="btn btn-secondary" style={{ width: '100px' }}> เพิ่มรูป </button>}
                                                    {(this.state.FileNow != null || this.state.CoverImage != null) && <button type="button" class="btn btn-success" style={{ width: '100px' }} onClick={() => this.AddFileSparepart()} > เพิ่มรูป </button>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewCoverImage == null ? "" : <img class="card-img-top" src={this.state.PreviewCoverImage} alt="Card Cover Image" />}
                                                </div>
                                                <div className="form-group col-md-3">
                                                    {this.state.PreviewImage == null ? "" : <img class="card-img-top" src={this.state.PreviewImage} alt="Card Image" />}
                                                </div>
                                            </div>
                                        </form>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ลำดับ</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ตัวเลือก</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>รูปตัวอย่าง</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>รูปโควเวอร์</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ชื่อไฟล์</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ลิงค์</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ลบ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.renderTableFile()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="form-group col-md-3">
                                            <label className="small mb-1" style={{ fontSize: '18px', color: '#58a7af' }}>รายการอะไหล่</label>
                                        </div>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Model</label>
                                                <Select
                                                    value={this.state.SpareModel}
                                                    onChange={this.handleChangeSpareModel}
                                                    options={this.state.optionsSpareModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Classified</label>
                                                <Select
                                                    value={this.state.SpareType}
                                                    onChange={this.handleChangeSpareType}
                                                    options={this.state.optionsSpareType}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Sub Classified</label>
                                                <Select
                                                    value={this.state.SpareSubType}
                                                    onChange={this.handleChangeSpareSubType}
                                                    options={this.state.optionsSpareSubType}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Spare Code</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.SpareCode}
                                                    onChange={this.SetDataSpareCode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Spare Name</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.SpareName}
                                                    onChange={this.SetDataSpareName}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Spare Price</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="number"
                                                    value={this.state.SparePrice}
                                                    onChange={this.SetDataSparePrice}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">รูป</label>
                                                <input type="file" id="sparefile" class="form-control-file" onChange={this.onFileSpareChange} />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">ลิงก์</label>
                                                <input className="form-control py-1" type="text" value={this.state.SpareHref} onChange={this.SetDataSpareHref} />
                                            </div>
                                        </div>
                                        <form id="form-file">
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    {this.state.PreviewSpareImage == null ? "" : <img class="card-img-top" style={{ float: 'center', width: '20%' }} src={this.state.PreviewSpareImage} alt="Card Image" />}
                                                </div>
                                            </div>
                                        </form>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                {(this.state.SpareName == '') && <button type="button" class="btn btn-secondary" style={{ float: 'right', marginLeft: '2%' }}> เพิ่มข้อมูล </button>}
                                                {(this.state.SpareName != '' && !this.state.IsEdit) && <button type="button" class="btn btn-success" onClick={() => this.AddSparepart()} style={{ float: 'right', marginLeft: '2%' }}> เพิ่มข้อมูล </button>}
                                                {(this.state.SpareName != '' && this.state.IsEdit) && <button type="button" class="btn btn-success" onClick={() => this.EditSparepart()} style={{ float: 'right', marginLeft: '2%' }}> อัพเดตข้อมูล </button>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ลำดับ</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>รูปตัวอย่าง</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Sparepart Code</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Sparepart Name</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Sparepart Price</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Sparepart Link</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>จัดการ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.renderTableSparepart()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="form-group col-md-3">
                                            <label className="small mb-1" style={{ fontSize: '18px', color: '#58a7af' }}>รายการติดตั้ง</label>
                                        </div>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Model</label>
                                                <Select
                                                    value={this.state.InstallationModel}
                                                    onChange={this.handleChangeInstallationModel}
                                                    options={this.state.optionsInstallationModel}
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Classified</label>
                                                <Select
                                                    value={this.state.InstallationType}
                                                    onChange={this.handleChangeInstallationType}
                                                    options={this.state.optionsInstallationType}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">Sub Classified</label>
                                                <Select
                                                    value={this.state.InstallationSubType}
                                                    onChange={this.handleChangeInstallationSubType}
                                                    options={this.state.optionsInstallationSubType}
                                                />
                                            </div>
                                            <div className="form-group col-md-1">
                                                {this.state.PreviewInstallImage != null &&
                                                    <img className="card-img-top" style={{ float: 'center', width: '80%', border: '0' }} alt="Card Image"
                                                        src={this.state.PreviewInstallImage.includes("pdf;") == true ? require("../images/PDF.png") :
                                                            this.state.PreviewInstallImage.includes("document;") == true ? require("../images/Word.webp") :
                                                                this.state.PreviewInstallImage.includes("spreadsheetml.sheet;") == true ? require("../images/Excel.png") :
                                                                    this.state.PreviewInstallImage.includes("mp4;") == true ? require("../images/File.png") :
                                                                        this.state.PreviewInstallImage} />}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label className="small mb-1">แนบไฟล์</label>
                                                <input type="file" id="instfile" class="form-control-file" onChange={this.onFileInstallChange} />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">ลิงก์</label>
                                                <input className="form-control py-1" type="text" value={this.state.InstallationHref} onChange={this.SetDataInstallationHref} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                {(this.state.PreviewInstallImage == null) && <button type="button" class="btn btn-secondary" style={{ float: 'right', marginLeft: '2%' }}> เพิ่มข้อมูล </button>}
                                                {(this.state.PreviewInstallImage != null) && <button type="button" class="btn btn-success" onClick={() => this.AddInstallation()} style={{ float: 'right', marginLeft: '2%' }}> เพิ่มข้อมูล </button>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-12">
                                                <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>ลำดับ</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Installation File</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>Installation Link</th>
                                                            <th style={{ fontSize: '14px', color: '#3d5170' }}>จัดการ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.renderTableInstalltion()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="row">
                                            <div className="form-group col-md-11">
                                                <button type="button" className="btn btn-danger" style={{ float: 'right', marginLeft: '2%' }} data-dismiss="modal">ยกเลิก</button>
                                                <button onClick={() => this.SaveData()} type="button" className="btn btn-success" style={{ float: 'right' }} >บันทึก</button>
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
                                            <button type="button" onClick={() => this.DeleteProduct()} className="btn btn-success" style={{ marginLeft: '361px' }}>ตกลง</button>
                                                &nbsp;&nbsp;
                                                <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="modal" id="DeleteConfirmModalPopup" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ต้องการที่จะลบหรือไม่ ?</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="form-group col-md6">
                                            <button type="button" onClick={() => this.onSpareDelete()} className="btn btn-success" style={{ marginLeft: '361px' }}>ตกลง</button>
                                                &nbsp;&nbsp;
                                            <button type="button" className="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="modal" id="PopDeleteProduct" role="dialog" aria-hidden="true">
                        <div className="AddModal-dialog">
                            <div className="modal-content" style={{ marginLeft: '30%', width: '50%', marginTop: '15%' }}>
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>ต้องการที่จะลบหรือไม่ ? </h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="row centered">
                                        <div className="form-group col-md4">
                                            <button type="button" onClick={() => this.DeleteProductByCode(this.state.EditProductOldCode, 0,this.state.EditLangID)}  className="btn btn-success">ลบข้อมูลอะไหล่และการติดตั้ง</button>
                                        </div>
                                        <div className="form-group col-md4">
                                            <button type="button" onClick={() => this.DeleteProductByCode(this.state.EditProductOldCode, 1,this.state.EditLangID)}  className="btn btn-success" style={{ marginLeft: '10px' }}>ลบเฉพาะข้อมูลอะไหล่</button>
                                        </div>
                                        <div className="form-group col-md4">
                                            <button type="button" onClick={() => this.DeleteProductByCode(this.state.EditProductOldCode, 2,this.state.EditLangID)}  className="btn btn-success" style={{ marginLeft: '10px' }}>ลบเฉพาะข้อมูลการติดตั้ง</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md12 centered">
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
                        height: 200px;\
                        object-fit: contain;\
                    }\
                    .popimg{\
                        max-width:100%;\
                    }\
                    .modal-dialog{\
                        width: 500px;\
                    }\
                    .modal{\
                        z-index: 1800\
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
                    }\
                    .centered {\
                        width: 100vh !important;\
                        display: flex !important;\
                        justify-content: center !important;\
                        align-items: center !important;\
                    }\
                "}</style>
            </Container>
            </LoadingOverlay>
        );
    }
}
export default ManageProduct;