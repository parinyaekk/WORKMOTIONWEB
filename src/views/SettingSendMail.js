import React from "react";
import axios from "axios";
import Select from "react-select";
import {
    Container,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    Collapse,
    FormInput
} from "shards-react";
import { Activity, Download, Search } from "react-feather";
import "react-table/react-table.css";
import "../MainConfig";
import LoadingOverlay from "react-loading-overlay";
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
} from "mdbreact";
import Cookies from "js-cookie";
import moment from "moment";

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class SettingSendMail extends React.Component {
    async componentWillMount() {
        await this.GetDataPermission();
        await this.GetDataCareCenter();
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usernames: Cookies.get('username'),
            User_Group: localStorage.getItem("User_Group"),
            ListData: [],
            ListEmailData: [],
            CareCenterCode: "",
            search: "",
            addemail: "",
            popSelect: false,
            collapse: false,
            Permission: "",
            columns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "Care Center Code",
                    field: "Care_Center_Code",
                    sort: "asc"
                },
                {
                    label: "",
                    field: "edit",
                    sort: "asc",
                    width: 150
                }
            ],
            emailcolumns: [
                {
                    label: "ลำดับ",
                    field: "no",
                    sort: "asc"
                },
                {
                    label: "อีเมล",
                    field: "Email",
                    sort: "asc"
                },
                {
                    label: "แก้ไขวันที่",
                    field: "Update_Date",
                    sort: "asc"
                },
                {
                    label: "แก้ไขโดย",
                    field: "Update_By",
                    sort: "asc"
                },
                // {
                //     label: "",
                //     field: "edit",
                //     sort: "asc",
                //     width: 150
                // },
                {
                    label: "",
                    field: "del",
                    sort: "asc",
                    width: 150
                }
            ]
        };
    }


    async GetDataCareCenter() {
        var _this = this;
        _this.setState({ loading: true });
        await axios
            .post(`${APIUrl}Employee/GetDataCareCenter`)
            .then(response => {
                if (response.data.status === 0) {
                    var TempData = [];
                    response.data.data.map((item, index) => {
                        let TempSubData = {
                            no: index + 1,
                            Care_Center_Code: item.code,
                            edit: (
                                <button
                                    style={{ marginTop: "-9px" }}
                                    type="button"
                                    class="btn btn-datatable"
                                    onClick={() => this.OpenEditPopup(item.code)}
                                >
                                    <i
                                        class="large material-icons"
                                        style={{ fontSize: "30px", color: "green" }}
                                    >
                                        add_box
                                    </i>
                                </button>
                            )
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
            })
            .finally(function () {
                _this.setState({ loading: false });
            });
    }

    toggle = () => {
        this.setState({
            popSelect: !this.state.popSelect,
            search: ""
        });
    };

    CollapseAdd = () => {
        this.setState({
            collapse: !this.state.collapse
        });
    };

    async GetDataPermission() {
        await axios
            .post(`${APIUrl}Permission/GetDataPermission`)
            .then(response => {
                if (response.data.status == 0) {
                    var temp = response.data.data;
                    var Permission = temp.filter(
                        x =>
                            x.SettingSendMailID == this.state.User_Group &&
                            x.menu_ID == this.state.GroupMenu_ID
                    );
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

    async GetAllDataSettingEmailByCareCenterCode(val) {
        var _this = this;
        console.log(val);
        _this.setState({ loading: true });
        await axios
            .post(
                `${APIUrl}Master/GetAllDataSettingEmailByCareCenterCode?CareCenterCode=` +
                val +
                `&Search=` +
                _this.state.search
            )
            .then(response => {
                if (response.data.status === 0) {
                    var TempEmailData = [];
                    response.data.data.map((item, index) => {
                        let TempSubData = {
                            no: index + 1,
                            Email: item.email,
                            Update_Date: item.update_Date,
                            Update_By: item.update_By,
                            // edit: (
                            //     <a>
                            //         <i
                            //             class="large material-icons"
                            //             style={{
                            //                 fontSize: "25px",
                            //                 color: "#feb301",
                            //                 cursor: "pointer"
                            //             }}
                            //         >
                            //             create
                            //         </i>
                            //     </a>
                            // ),
                            del: (
                                <a onClick={() => this.AddorDeleteDataSettingSendMail(item.id,2)}>
                                    <i
                                        class="large material-icons"
                                        style={{
                                            fontSize: "25px",
                                            color: "red",
                                            cursor: "pointer"
                                        }}
                                    >
                                        delete_forever
                                    </i>
                                </a>
                            )
                        };
                        TempEmailData.push(TempSubData);
                    });
                    var dataTable = {
                        rows: TempEmailData,
                        columns: this.state.emailcolumns
                    };
                    this.setState({ ListEmailData: dataTable });
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

    OpenEditPopup(carecentercode) {
        var _this = this;
        if (
            carecentercode &&
            carecentercode !== null &&
            typeof carecentercode !== "undefined"
        ) {
            this.setState({ popSelect: true });
            this.setState({ CareCenterCode: carecentercode });
            this.forceUpdate();
            this.GetAllDataSettingEmailByCareCenterCode(carecentercode);
        }
    }

    async AddorDeleteDataSettingSendMail(id,type) {
        // this.setState({ loading: true });
        const Tempdata = {
            ID: id,
            Care_Center_Code: this.state.CareCenterCode,
            Email: this.state.addemail,
            Type: type,
            Create_By: this.state.usernames,
        };
        axios
            .post(`${APIUrl}Master/AddorDeleteDataSettingSendMail`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    this.GetAllDataSettingEmailByCareCenterCode(this.state.CareCenterCode);
                    this.setState({ addemail: '' });
                    // window.location.reload();
                }
                else
                {
                    alert(response.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(function () {
                // this.setState({ loading: false });
            });
    };

    async InActiveDataMenu() {
        var ID = parseInt(this.state.UserID);
        await axios
            .post(`${APIUrl}SettingSendMail/DeleteSettingSendMail?ID=` + ID)
            .then(response => {
                if (response.data.status == 0) {
                    alert(response.data.message);
                    window.location.reload();
                } else {
                    window.location.reload();
                }
            })
            .catch(err => console.log(err));
    }

    ChangeSearch = event => {
        this.setState({ search: event.target.value });
    };

    ChangeAddEmail = event => {
        this.setState({ addemail: event.target.value });
    };

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
                                            <div class="page-header-icon">
                                                <Activity />
                                            </div>
                                            Manage SettingSendMail
                                        </h1>
                                        <div class="page-header-subtitle">
                                            จัดการข้อมูลการส่งอีเมล
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <MDBContainer className="mt-0" fluid responsive>
                        <MDBRow className="py-3">
                            <MDBCol md="12">
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBTable responsive hover>
                                            <MDBTableHead columns={this.state.ListData.columns} />
                                            <MDBTableBody rows={this.state.ListData.rows} />
                                        </MDBTable>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                    <Modal
                        size="lg"
                        open={this.state.popSelect}
                        toggle={this.toggle}
                        className="popTable"
                    >
                        <ModalHeader>
                            ศูนย์บริการสาขา {this.state.CareCenterCode}
                        </ModalHeader>
                        <ModalBody>
                            <div class="container">
                                <div class="row">
                                    <div class="col-6">
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={this.CollapseAdd}
                                        >
                                            { this.state.collapse ? <i class="large material-icons">expand_less</i> : <i class="large material-icons">expand_more</i> }
                                            &nbsp; เพิ่มข้อมูล
                                        </button>
                                    </div>
                                    <div class="col-4">
                                        <input
                                            class="form-control"
                                            type="text"
                                            placeholder="Search"
                                            aria-label="Search"
                                            value={this.state.search}
                                            onChange={this.ChangeSearch}
                                        />
                                    </div>
                                    <div class="col-2" style={{ padding: "0" }}>
                                        <button
                                            className="btn btn-info"
                                            onClick={() =>
                                                this.GetAllDataSettingEmailByCareCenterCode(this.state.CareCenterCode)
                                            }
                                        >
                                            <i class="large material-icons">search</i>
                                            &nbsp; ค้นหา
                                        </button>
                                    </div>
                                    <div class="col-12">
                                        <Collapse open={this.state.collapse}>
                                            <div className="p-3 mt-3 border rounded">
                                                <h5>
                                                    เพิ่มข้อมูลอีเมลในศูนย์บริการสาขา{" "}
                                                    {this.state.CareCenterCode}
                                                </h5>
                                                <div class="row">
                                                    <div class="col-9">
                                                        <FormInput
                                                            id="AddEmail"
                                                            type='email'
                                                            placeholder="Fill Email Here ..."
                                                            className="mb-2"
                                                            value={this.state.addemail}
                                                            onChange={this.ChangeAddEmail} />
                                                    </div>
                                                    <div class="col-3" style={{ padding: "0" }}>
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() =>
                                                            this.AddorDeleteDataSettingSendMail(0,1)
                                                            }
                                                        >
                                                            <i class="large material-icons">add</i>
                                                            &nbsp; เพิ่มข้อมูล
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                    <div class="col-12">&nbsp;</div>
                                    <div class="col-12">
                                        <MDBTable responsive hover>
                                            <MDBTableHead
                                                columns={this.state.ListEmailData.columns}
                                            />
                                            <MDBTableBody rows={this.state.ListEmailData.rows} />
                                        </MDBTable>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                    <style>
                        {
                            "\
        table.dataTable {\
          display: inline-table;\
        }\
        .popimg{\
          max-width:100%;\
        }\
        .popTable{\
          width:100% !important;\
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
      "
                        }
                    </style>
                </Container>
            </LoadingOverlay>
        );
    }
}
export default SettingSendMail;
