import React from "react";
import axios from "axios";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import "../MainConfig";
//import Select from 'react-select';
const APIUrl = global.config.variable.Url;
class ContentHead extends React.Component {

    async componentWillMount() {
        await this.GetAllDataContentHead();
    }

    constructor(props) {
        super(props);
        this.state = {
            ContentHeadList: [],
            LangID: 1,

            ContentHeadID: 0,
            MenuLangID: null,
            MenuName: '',
            Active: null
        };
    }

    async GetAllDataContentHead() {
        const Tempdata = {
            Lang_ID: this.state.LangID
        };
        await axios.post(`${APIUrl}Master/GetAllDataContentHead`, Tempdata)
            .then(response => {
                if (response.data.status === 0) {
                    this.setState({ ContentHeadList: response.data.data });
                    // console.log(response.data.data);
                }
            })
            .catch(err => console.log(err));
    }


    setStateMenuLangID = event => {
        this.setState({ MenuLangID: event.target.value });
    }

    SetDataContentHeadName = event => {
        this.setState({ ContentHeadName: event.target.value });
    }

    SetActive = event => {
        this.setState({ Active: event.target.value });
    }

    ClearFieldInput() {
        this.setState({
            ContentHeadID: 0,
            ContentHeadName: '',
            MenuLangID: null
        });
    }

    AddDataContentHead() {
        const Tempdata = {
            ID: parseInt(this.state.ContentHeadID),
            Lang_ID: parseInt(this.state.MenuLangID),
            MenuName: this.state.ContentHeadName,
            Status: "Add"
        };
        axios.post(`${APIUrl}Master/AddDataMenu`, Tempdata)
            .then((response) => {
                if (response.data.status == 0) {
                    alert('บันทึกสำเร็จ');
                    window.location.reload();
                }
            }).catch(err => console.log(err));
    }

    EditDataContentHead() {
        const Tempdata = {
            ID: parseInt(this.state.ContentHeadID),
            Lang_ID: parseInt(this.state.MenuLangID),
            MenuName: this.state.ContentHeadName,
            Active: parseInt(this.state.Active),
            Status: "Edit"
        };
        axios.post(`${APIUrl}Master/AddDataMenu`, Tempdata)
            .then((response) => {
                if (response.data.status == 0) {
                    alert('บันทึกสำเร็จ');
                    window.location.reload();
                }
            }).catch(err => console.log(err));
    }

    OpenEditPopup(id) {
        var data = id;
        axios.post(`${APIUrl}Master/GetDataContentHeadByID?ID=` + data)
            .then((response) => {
                if (response.data.status == 0) {
                    var Data = response.data.data;
                    this.setState({
                        ContentHeadID: Data.id,
                        ContentHeadName: Data.content_Head_Name,
                        MenuLangID: Data.lang_ID.toString(),
                        Active: Data.is_Active == 1 ? "1" : "2"
                    });
                    //console.log(Data);
                }
            }).catch(err => console.log(err));
    }


    renderTableMenu() {
        return this.state.ContentHeadList.map((item, index) => {
            // console.log(item);
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >{item.content_Head_Name}</td>
                    <td >{item.is_Active == 1 ? "Active" : "InActive"}</td>
                    <td>
                        <button style={{ marginTop: '-5px' }} class="btn btn-datatable" data-toggle="modal" data-target="#EditModalPopup" data-backdrop="static" onClick={() => this.OpenEditPopup(item.id)}>
                            <img
                                style={{ maxWidth: "20px" }}
                                src={require("../images/editor.png")}
                                alt=""
                            />
                        </button>
                        {/* <button class="btn btn-datatable">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'red' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button> */}
                    </td>
                </tr>
            );
        });
    }

    render() {
        return (
            <Container fluid className="main-content-container container-boom px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage ContentHead"
                        subtitle=""
                        className="text-sm-left"
                    />
                </Row>
                <Row>
                    <Col>
                        <div>
                            <div className="card mb-4 responsive">
                                <div className="card-header"></div>
                                <button class="btn btn-warning col-md-1" onClick={() => this.ClearFieldInput()} style={{ marginLeft: '2%' }} data-toggle="modal" data-target="#AddModalPopup" data-backdrop="static">Add Data</button>
                                <div className="card-body">
                                    <div className="datatable">
                                        <table className="table table-bordered table-hover" id="dataTable" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>ลำดับ</th>
                                                    <th>ชื่อหัวข้อคอนเทนต์</th>
                                                    <th>สถานะ</th>
                                                    <th>จัดการ</th>
                                                </tr>
                                            </thead>
                                            <tbody> {this.renderTableMenu()} </tbody>
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
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>Add ContentHead</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.MenuLangID === "1"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">Thai</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.MenuLangID === "2"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">English</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อหัวข้อคอนเทนต์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ContentHeadName}
                                                    onChange={this.SetDataContentHeadName}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <button className="btn btn-success" onClick={() => this.AddDataContentHead()}>AddData</button>
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
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 style={{ fontSize: '25px' }}>Edit ContentHead</h3>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label className="small mb-1">เลือกภาษา</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio" name="Thai"
                                                    value={1}
                                                    checked={this.state.MenuLangID === "1"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">Thai</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="English"
                                                    value={2}
                                                    checked={this.state.MenuLangID === "2"}
                                                    onChange={this.setStateMenuLangID} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">English</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label className="small mb-1">ชื่อหัวข้อคอนเทนต์</label>
                                                <input
                                                    className="form-control py-1"
                                                    type="text"
                                                    value={this.state.ContentHeadName}
                                                    onChange={this.SetDataContentHeadName}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div style={{ marginLeft: '2%' }}>
                                                <input
                                                    type="radio" name="Active"
                                                    value={1}
                                                    checked={this.state.Active === "1"}
                                                    onChange={this.SetActive} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">Active</label>
                                                &nbsp;&nbsp;
                                                <input
                                                    type="radio" name="InActive"
                                                    value={2}
                                                    checked={this.state.Active === "2"}
                                                    onChange={this.SetActive} />
                                                    &nbsp;&nbsp;
                                                <label className="small mb-1">InActive</label>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <button className="btn btn-success" onClick={() => this.EditDataContentHead()}>EditData</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>

        );
    }
}
export default ContentHead;