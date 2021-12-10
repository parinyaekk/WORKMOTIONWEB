import React from "react";
import axios from "axios";
import Select from "react-select";
import { Container, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
import "../MainConfig";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;

class Content extends React.Component {
  async componentWillMount() {
    var ID = this.props.location.state.id;
    var type = this.props.location.state.type;
    // console.log(this.props.location.state);
    await this.SetTypeMenuId(ID, type);
    await this.GetMenuOptions();
    if (ID != null || ID != undefined) {
      if (type == "edit") {
        await this.GetDataContentById(ID);
      } else {
        await this.GetMenuById(ID);
      }
    }
  }

  ChangeMenuInput = event => {
    this.setState({ Menu: event.target.value });
  };

  ChangeContent_TitleInput = event => {
    this.setState({ Content_Title: event.target.value });
  };

  ChangeContent_DescInput = event => {
    this.setState({ Content_Desc: event.target.value });
  };

  ChangeContent_BodyInput = event => {
    this.setState({ Content_Body: event.target.value });
  };

  ChangeContent_TypeInput = event => {
    this.setState({ Menu_Name: event.target.value });
  };

  ChangeHref_LinkInput = event => {
    this.setState({ Href_Link: event.target.value });
  };

  ChangeContent_Col1Input = event => {
    this.setState({ Content_Col1: event.target.value });
  };

  ChangeContent_Col2Input = event => {
    this.setState({ Content_Col2: event.target.value });
  };

  ChangeContent_Col3Input = event => {
    this.setState({ Content_Col3: event.target.value });
  };

  ChangeContent_Col4Input = event => {
    this.setState({ Content_Col4: event.target.value });
  };

  ChangeContent_Col5Input = event => {
    this.setState({ Content_Col5: event.target.value });
  };

  ChangeContent_Col6Input = event => {
    this.setState({ Content_Col6: event.target.value });
  };

  setStateMenuLangID = event => {
    this.setState({ MenuLangID: event.target.value });
  };

  handleChangeContent_Type = Content_Type => {
    this.setState({ Content_Type: Content_Type });
    // console.log(`Option selected:`, ContentHeader);
  };

  handleChangeContent_Col = Content_Col => {
    this.setState({ Content_Col: Content_Col });
    // console.log(`Option selected:`, ContentHeader);
  };

  handleChangeMenu = Menu => {
    this.setState({ Menu: Menu });
    // console.log(`Option selected:`, ContentHeader);
  };

  ChangeDescription_ImageInput = event => {
    this.setState({ Description_Image: event.target.value });
  };

  ChangeLink_DownloadInput = event => {
    this.setState({ Link_Download: event.target.value });
  };

  ChangeFile_OrderInput = event => {
    this.setState({ File_Order: event.target.value });
  };

  ChangeStatus_Image = event => {
    this.setState({ Status_Image: event.target.value });
  };

  ChangeLine_Status = event => {
    this.setState({ Line_Status: event.target.value });
  };

  ChangeContent_Order = event => {
    this.setState({ Content_Order: event.target.value });
  };

  ChangeFormatStringBR(value) {
    if (value != "" && value != null) {
      return value.split("<br>").join("\n");
    }
    return "";
  }

  SetTypeMenuId(id, type) {
    this.setState({
      type: type,
      IdMenu: id
    });
  }

  async GetMenuOptions() {
    await axios
      .post(`${APIUrl}Content/GetMenuOptions`)
      .then(response => {
        if (response.data.status === 0) {
          var data = response.data.data;
          this.setState({ optionsMenu: data });
          // this.state.ArrFile.push(data.file);
          this.forceUpdate();
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  async GetDataContentById(val) {
    var temp = {
      id: val
    };
    await axios
      .post(`${APIUrl}Content/GetDataContentByID`, temp)
      .then(response => {
        if (response.data.status === 0) {
          var data = response.data.data;
          var type = this.state.optionsType.filter(
            x => x.value == data.content_type
          );
          var col = this.state.optionsCol.filter(
            x => x.value == data.content_col
          );
          var txteditorState = null;
          const contentBlock = htmlToDraft(this.ChangeFormatStringBR(data.content_body));
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            txteditorState = EditorState.createWithContent(contentState);
          }
          this.setState({
            MenuLangID: data.lang_id,
            Line_Status: data.line_status,
            // IdMenu: data.menu_id,
            Menu: { value: data.menu_id, label: data.menu_name },
            Content_ID: data.id,
            Content_Title:
              data.content_title == "null" ? "" : data.content_title,
            Content_Desc: data.content_desc == "null" ? "" : data.content_desc,
            Content_Type: type[0],
            Content_Col: col[0],
            Content_Body: txteditorState,
            // editorState: this.ChangeFormatStringBR(htmlToDraft(convertToRaw(data.content_body))),
            Content_Col1: data.content_col1 == "null" ? "" : data.content_col1,
            Content_Col2: data.content_col2 == "null" ? "" : data.content_col2,
            Content_Col3: data.content_col3 == "null" ? "" : data.content_col3,
            Content_Col4: data.content_col4 == "null" ? "" : data.content_col4,
            Content_Col5: data.content_col5 == "null" ? "" : data.content_col5,
            Content_Col6: data.content_col6 == "null" ? "" : data.content_col6,
            Content_Order: data.content_order,
            ArrFile: data.file,
            disabled: true
          });
          // this.state.ArrFile.push(data.file);
          this.forceUpdate();
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  async GetMenuById(val) {
    await axios
      .post(`${APIUrl}Content/GetMenuById?id=` + val)
      .then(response => {
        if (response.data.status === 0) {
          var data = response.data.data;
          this.setState({
            Menu: {
              value: data.id,
              label: data.menu_Name
            },
            disabled: true,
            IdMenu: data.id
          });
          // this.state.ArrFile.push(data.file);
          this.forceUpdate();
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      Content_Body: EditorState.createEmpty(),
      optionsType: [
        { value: 0, label: "Body Text" },
        { value: 1, label: "Card" },
        { value: 2, label: "Banner" },
        { value: 3, label: "Picture" },
        { value: 4, label: "PDF" },
        { value: 5, label: "Video" },
        { value: 6, label: "Audio" },
        // { value: 7, label: 'Other File(Download)' },
        { value: 8, label: "Carousel" }
      ],
      optionsCol: [
        { value: 1, label: "1-Col" },
        { value: 2, label: "2-Col" },
        { value: 3, label: "3-Col" },
        { value: 4, label: "4-Col" },
        { value: 5, label: "5-Col" }
        // { value: 6, label: '6-Col' },
      ],
      optionsMenu: [],
      Menu: null,
      Content_ID: null,
      Content_Title: null,
      Content_Desc: null,
      Content_Body: null,
      Content_Type: null,
      Content_Col: null,
      Content_Col1: null,
      Content_Col2: null,
      Content_Col3: null,
      Content_Col4: null,
      Content_Col5: null,
      Content_Col6: null,
      Content_Order: null,
      IndexFile: null,
      IDFile: null,
      Line_Status: null,
      Href_Link: null,
      Description_Image: null,
      Link_Download: null,
      File_Order: null,
      status_Image: null,
      FileNow: null,
      CoverImage: null,
      PreviewCoverImage: null,
      ArrFile: [],
      ArrFileID: [],
      MenuLangID: null,
      disabled: false,
      IdMenu: 0,
      type: null
    };
    this.AddFileContent = this.AddFileContent.bind(this);
  }

  async AddDataContent() {
    if (this.state.ArrFile.length > 0) {
      var Tempdata = {
        LangID: this.state.MenuLangID,
        Line_Status: this.state.Line_Status,
        Menu: this.state.Menu.value,
        Content_ID: this.state.Content_ID,
        Content_Title: this.state.Content_Title,
        Content_Desc: this.state.Content_Desc,
        Content_Type:
          this.state.Content_Type == null
            ? null
            : this.state.Content_Type.value,
        Content_Col: this.state.Content_Col == null ? null : this.state.Content_Col.value,            
        Content_Body: draftToHtml(convertToRaw(this.state.Content_Body.getCurrentContent())),
        Content_Col1: this.state.Content_Col1,
        Content_Col2: this.state.Content_Col2,
        Content_Col3: this.state.Content_Col3,
        Content_Col4: this.state.Content_Col4,
        Content_Col5: this.state.Content_Col5,
        Content_Col6: this.state.Content_Col6,
        Content_Order: this.state.Content_Order,
        File: this.state.ArrFile
      };
    } else {
      var Tempdata = {
        LangID: this.state.MenuLangID,
        Line_Status: this.state.Line_Status,
        Menu: this.state.Menu.value,
        Content_ID: this.state.Content_ID,
        Content_Title: this.state.Content_Title,
        Content_Desc: this.state.Content_Desc,
        Content_Type:
          this.state.Content_Type == null
            ? null
            : this.state.Content_Type.value,
        Content_Col:
          this.state.Content_Col == null ? null : this.state.Content_Col.value,            
        Content_Body: draftToHtml(convertToRaw(this.state.Content_Body.getCurrentContent())),
        Content_Col1: this.state.Content_Col1,
        Content_Col2: this.state.Content_Col2,
        Content_Col3: this.state.Content_Col3,
        Content_Col4: this.state.Content_Col4,
        Content_Col5: this.state.Content_Col5,
        Content_Col6: this.state.Content_Col6,
        Content_Order: this.state.Content_Order,
        File: []
      };
    }
    // console.log(JSON.stringify(Tempdata));
    await axios
      .post(`${APIUrl}Content/AddDataContent`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          //console.log(response.data.data);
          alert("Success !");
          // this.ClearAll();
          window.history.back();
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  ClearAll = event => {
    this.setState({
      Menu: null,
      Content_ID: null,
      Content_Title: null,
      Content_Desc: null,
      Content_Body: null,
      Content_Type: null,
      Content_Col1: null,
      Content_Col2: null,
      Content_Col3: null,
      Content_Col4: null,
      Content_Col5: null,
      Content_Col6: null,
      LineStatus: null,
      Content_Order: null,
      Href_Link: null,
      FileNow: null,
      Description_Image: null,
      Status_Image: null,
      File_Order: null,
      Link_Download: null,
      ArrFile: [],
      ArrFileID: [],
      MenuLangID: null,
      disabled: false
    });
  };

  async onFileEdit(index) {
    var Temp = this.state.ArrFile[index];

    this.setState({ IndexFile: index });
    this.setState({ IDFile: Temp.id });
    this.setState({ Href_Link: Temp.link == "null" ? null : Temp.link });
    this.setState({
      Description_Image: Temp.description == "null" ? null : Temp.description
    });
    this.setState({
      Link_Download: Temp.link_download == "null" ? null : Temp.link_download
    });
    this.setState({ File_Order: Temp.file_order });
    this.setState({ Status_Image: Temp.flag_button });
    $("#file").val("");
    this.forceUpdate();
  }

  onFileChange = event => {
    this.setState({ FileNow: event.target.files[0] });
  };

  // onCoverImage = event => {
  //   this.setState({ CoverImage: event.target.files[0] });
  // };

  onCoverImage = event => {
    let files = event.target.files;
    this.setState({ CoverImage: event.target.files[0] });
    // console.log(files);
    let reader = new FileReader();
    reader.onload = r => {
      // console.log(r.target.result);
      this.setState({ PreviewCoverImage: r.target.result });
    };
    reader.readAsDataURL(files[0]);
  };

  async AddFileContent() {
    // console.log(this.state.IndexFile);
    // if(this.state.FileNow != null){
    const data = new FormData();
    data.append("id", this.state.IDFile);
    data.append("CoverImage", this.state.CoverImage);
    data.append("HrefLink", this.state.Href_Link);
    data.append("Description_Image", this.state.Description_Image);
    data.append("Link_Download", this.state.Link_Download);
    data.append("Order", this.state.File_Order);
    data.append("Status_Image", this.state.Status_Image);
    data.append("files", this.state.FileNow);
    await axios
      .post(`${APIUrl}Content/UploadFile`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        if (response.data.status === 0) {
          // console.log(this.state.IndexFile);
          if (this.state.IndexFile != null) {
            this.state.ArrFile.splice(this.state.IndexFile, 1);
          }
          var Temp = {
            id: response.data.data.id,
            name: response.data.data.file_name,
            type: response.data.data.file_type,
            path: response.data.data.file_path,
            link: response.data.data.link,
            description: response.data.data.description,
            link_download: response.data.data.link_download,
            file_order: response.data.data.file_order,
            flag_button: response.data.data.flag_button,
            coverimage_path: response.data.data.coverimage_path
          };
          this.state.ArrFile.push(Temp);
          // console.log(this.state.ArrFile);
          this.setState({ FileNow: null });
          this.setState({ CoverImage: null });
          this.setState({ PreviewCoverImage: null });
          this.setState({ Href_Link: null });
          this.setState({ Description_Image: null });
          this.setState({ Link_Download: null });
          this.setState({ File_Order: 0 });
          this.setState({ Status_Image: null });
          // console.log(this.state.File_Order);
          document.getElementById("form-file").reset();
          $("#file").val("");
          this.forceUpdate();
        }
      })
      .catch(err => {
        alert(err);
      });
    // }
  }

  ClaerDataFile() {
    this.setState({ FileNow: null });
    this.setState({ CoverImage: null });
    this.setState({ PreviewCoverImage: null });
    this.setState({ Href_Link: null });
    this.setState({ Description_Image: null });
    this.setState({ Link_Download: null });
    this.setState({ File_Order: 0 });
    this.setState({ Status_Image: null });
    this.setState({ IndexFile: null });
    document.getElementById("form-file").reset();
    $("#file").val("");
    this.forceUpdate();
  }

  onFileDelete(value) {
    this.state.ArrFile.splice(value, 1);
    this.forceUpdate();
  }

  GoToPage(value) {
    window.location.href = value;
  }

  BackToPage() {
    window.history.back();
  }

  // previewFile() {
  //   const preview = document.querySelector('img');
  //   const file = this.state.CoverImage;
  //   const reader = new FileReader();

  //   reader.addEventListener("load", function () {
  //     // convert image file to base64 string
  //     preview.src = reader.result;
  //   }, false);

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // }

  renderTableFile() {
    return this.state.ArrFile.map((item, index) => {
      // console.log(item.name);
      return (
        <tr key={index}>
          <td>
            {item.type.includes("image") ? (
              <img class="table-img" src={`${APIImagePath}` + item.path} />
            ) : (
              "No Image"
            )}
          </td>
          <td>
            {item.coverimage_path != null ? (
              <img
                class="table-img"
                src={`${APIImagePath}` + item.coverimage_path}
              />
            ) : (
              "No Image"
            )}
          </td>
          <td>{item.name}</td>
          <td onClick={() => this.onFileEdit(index)}>
            <input
              type="button"
              value="แก้ไข"
              onClick={() => this.onFileEdit(index)}
              className="btn btn-warning"
            />
          </td>
          <td onClick={() => this.onFileDelete(index)}>
            <input type="button" value="ลบ" className="btn btn-danger" />
          </td>
        </tr>
      );
    });
  }

  // onFileChange = event => {
  //   this.setState({ FileNow: event.target.files[0] });
  // };
  onEditorStateChange = (Content_Body) => {
    this.setState({
      Content_Body,
    });
  };

  render() {
    return (
      <Container fluid className="main-content-container container-boom px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            // title="เพิ่มข้อมูล"
            subtitle=""
            className="text-sm-left"
          />
        </Row>
        <Row>
          <Col>
            <div>
              <div className="card mb-4 responsive">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 style={{ fontSize: "25px" }}>
                      {this.state.type == "edit" ? "อัพเดท" : "เพิ่มข้อมูล"}
                    </h3>
                    <button
                      type="button"
                      style={{ float: "right" }}
                      class="btn btn-primary"
                      onClick={() => this.BackToPage()}
                    >
                      ย้อนกลับ
                    </button>
                  </div>
                  {/* <br></br> */}
                  <div className="modal-body">
                    <form>
                      <div className="row">
                        <div className="form-group col-md-8">
                          <label className="small mb-1">เมนู</label>
                          <Select
                            value={this.state.Menu}
                            onChange={this.handleChangeMenu}
                            options={this.state.optionsMenu}
                          />
                          {/* <input className="form-control py-1" type="text" disabled = {this.state.disabled} value={this.state.Menu} onChange={this.ChangeMenuInput} /> */}
                        </div>
                      </div>
                      <br></br>
                      <div className="row">
                        <div
                          className="form-group col-md-1"
                          style={{ paddingTop: "3px" }}
                        >
                          <label className="small mb-1">เลือกภาษา</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="Thai"
                            value={1}
                            checked={this.state.MenuLangID == "1"}
                            onChange={this.setStateMenuLangID}
                          />
                          &nbsp;&nbsp;
                          <label className="small mb-1">ภาษาไทย</label>
                          &nbsp;&nbsp;
                          <input
                            type="radio"
                            name="English"
                            value={2}
                            checked={this.state.MenuLangID == "2"}
                            onChange={this.setStateMenuLangID}
                          />
                          &nbsp;&nbsp;
                          <label className="small mb-1">ภาษาอังกฤษ</label>
                        </div>
                        <div className="form-group col-md-1"></div>
                        <div className="form-group col-md-1">
                          <label
                            className="small mb-1"
                            style={{ paddingTop: "3px" }}
                          >
                            สถานะเส้น
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="OpenLine"
                            value={1}
                            checked={this.state.Line_Status == "1"}
                            onChange={this.ChangeLine_Status}
                          />
                          &nbsp;&nbsp;
                          <label className="small mb-1">เปิดเส้น</label>
                          &nbsp;&nbsp;
                          <input
                            type="radio"
                            name="CloseLine"
                            value={0}
                            checked={this.state.Line_Status == "0"}
                            onChange={this.ChangeLine_Status}
                          />
                          &nbsp;&nbsp;
                          <label className="small mb-1">ปิดเส้น</label>
                        </div>
                        <div className="form-group col-md-1"></div>
                        <div className="form-group col-md-3">
                          <label className="small mb-1">ลำดับ</label>
                          <input
                            className="form-control py-1"
                            type="number"
                            value={this.state.Content_Order}
                            onChange={this.ChangeContent_Order}
                          />
                        </div>
                      </div>
                      <br></br>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label className="small mb-1">หัวข้อหลัก</label>
                          {/* <input className="form-control py-1" type="text" value={this.state.Content_Title} onChange={this.ChangeContent_TitleInput} /> */}
                          <textarea
                            class="form-control"
                            value={this.state.Content_Title}
                            onChange={this.ChangeContent_TitleInput}
                            rows="3"
                          ></textarea>
                        </div>
                        <div className="form-group col-md-6">
                          <label className="small mb-1">หัวข้อรอง</label>
                          {/* <input className="form-control py-1" type="text" value={this.state.Content_Desc} onChange={this.ChangeContent_DescInput} /> */}
                          <textarea
                            class="form-control"
                            value={this.state.Content_Desc}
                            onChange={this.ChangeContent_DescInput}
                            rows="3"
                          ></textarea>
                        </div>
                      </div>
                      <br></br>
                      <div className="row">
                        <div className="form-group col-md-12">
                          <label className="small mb-1">รายละเอียด</label>
                          {/* <input className="form-control py-1" type="text" /> */}
                          {/* <textarea class="form-control" value={this.state.Content_Body} onChange={this.ChangeContent_BodyInput}  rows="3"></textarea> */}
                          <div
                            style={{
                              display: "block",
                              border: "1px solid black",
                              padding: "2px",
                              // maxHeight: "300px"
                            }}
                          >
                            <Editor
                              editorState={this.state.Content_Body}
                              onEditorStateChange={this.onEditorStateChange}
                            />
                          </div>
                        </div>
                        {/* <div className="form-group col-md-12">
                          <label className="small mb-1">ทดสอบ รายละเอียด</label>
                          <div
                            style={{
                              display: "table",
                              border: "1px solid black",
                              padding: "2px",
                              maxHeight: "300px"
                            }}
                          >
                          <textarea
                            disabled
                            value={draftToHtml(
                              convertToRaw(editorState.getCurrentContent())
                            )}
                          />
                          </div>
                        </div> */}
                      </div>
                      {/* <br></br>
                      <div className="row">
                        <div className="form-group col-md-12">
                            <input
                              type="button"
                              value="ทดสอบ"
                              className="btn btn-success"
                              onClick={() => alert(draftToHtml(
                                convertToRaw(editorState.getCurrentContent())
                              ))}
                            />
                        </div>
                      </div> */}
                      <br></br>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์</label>
                          <Select
                            value={this.state.Content_Col}
                            onChange={this.handleChangeContent_Col}
                            options={this.state.optionsCol}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="small mb-1">ประเภท</label>
                          <Select
                            value={this.state.Content_Type}
                            onChange={this.handleChangeContent_Type}
                            options={this.state.optionsType}
                          />
                        </div>
                      </div>
                      <br></br>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 1</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col1}
                            onChange={this.ChangeContent_Col1Input}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 2</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col2}
                            onChange={this.ChangeContent_Col2Input}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 3</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col3}
                            onChange={this.ChangeContent_Col3Input}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 4</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col4}
                            onChange={this.ChangeContent_Col4Input}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 5</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col5}
                            onChange={this.ChangeContent_Col5Input}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="small mb-1">คอลัมน์ที่ 6</label>
                          <input
                            className="form-control py-1"
                            type="text"
                            value={this.state.Content_Col6}
                            onChange={this.ChangeContent_Col6Input}
                          />
                        </div>
                      </div>
                      <br></br>
                      <hr></hr>
                      <form id="form-file">
                        <div className="row">
                          <div className="form-group col-md-3">
                            <label className="small mb-1">รูปโควเวอร์</label>
                            <input
                              type="file"
                              id="file"
                              class="form-control-file"
                              onChange={this.onCoverImage}
                            />
                          </div>
                          {/* <div className="form-group col-md-3" style={{paddingTop:'20px'}} >
                        <button type="button" class="btn btn-success" onClick={() => this.AddCoverImage()} >เพิ่มรูป</button>
                      </div> */}
                        </div>
                        <div className="row">
                          <div className="form-group col-md-3">
                            {this.state.PreviewCoverImage == null ? (
                              ""
                            ) : (
                              <img
                                class="card-img-top"
                                src={this.state.PreviewCoverImage}
                                alt="Card Cover Image"
                              />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-4">
                            <label className="small mb-1">ลิงก์</label>
                            <input
                              className="form-control py-1"
                              type="text"
                              value={this.state.Href_Link}
                              onChange={this.ChangeHref_LinkInput}
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label className="small mb-1">ไฟล์</label>
                            <input
                              type="file"
                              id="file"
                              class="form-control-file"
                              onChange={this.onFileChange}
                            />
                          </div>
                          <div className="form-group col-md-5">
                            <label className="small mb-1">
                              เพิ่มข้อความใต้ภาพ
                            </label>
                            <input
                              className="form-control py-1"
                              type="text"
                              value={this.state.Description_Image}
                              onChange={this.ChangeDescription_ImageInput}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-3">
                            <label className="small mb-1">ลิงค์ดาวน์โหลด</label>
                            <input
                              className="form-control py-1"
                              type="text"
                              value={this.state.Link_Download}
                              onChange={this.ChangeLink_DownloadInput}
                            />
                          </div>
                          <div className="form-group col-md-3">
                            <label className="small mb-1">ลำดับ</label>
                            <input
                              className="form-control py-1"
                              type="number"
                              value={this.state.File_Order}
                              onChange={this.ChangeFile_OrderInput}
                            />
                          </div>
                          <div
                            className="form-group col-md-2"
                            style={{ paddingTop: "20px" }}
                          >
                            <label className="small mb-1">สถานะปุ่ม</label>
                            <input
                              type="radio"
                              name="Open"
                              value={1}
                              checked={this.state.Status_Image == "1"}
                              onChange={this.ChangeStatus_Image}
                            />
                            &nbsp;&nbsp;
                            <label className="small mb-1">เปิดปุ่ม</label>
                            &nbsp;&nbsp;
                            <input
                              type="radio"
                              name="Close"
                              value={0}
                              checked={this.state.Status_Image == "0"}
                              onChange={this.ChangeStatus_Image}
                            />
                            &nbsp;&nbsp;
                            <label className="small mb-1">ปิดปุ่ม</label>
                          </div>
                          <div
                            className="form-group col-md-4"
                            style={{ paddingTop: "20px" }}
                          >
                            <button
                              type="button"
                              class="btn btn-success"
                              onClick={() => this.AddFileContent()}
                              style={{ margin: "5px" }}
                            >
                              เพิ่มไฟล์
                            </button>
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={() => this.ClaerDataFile()}
                              style={{ margin: "5px" }}
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      </form>
                      <hr></hr>
                      <div className="row">
                        <div className="form-group col-md-12">
                          <table
                            className="table table-bordered table-hover"
                            width="100%"
                            cellSpacing="0"
                          >
                            <thead>
                              <tr>
                                <th>รูปตัวอย่าง</th>
                                <th>รูปโควเวอร์</th>
                                <th>ชื่อไฟล์</th>
                                <th>Edit</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            <tbody>{this.renderTableFile()}</tbody>
                          </table>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <input
                            type="button"
                            value={
                              this.state.type == "edit"
                                ? "อัพเดท"
                                : "เพิ่มข้อมูล"
                            }
                            className="btn btn-success"
                            onClick={() => this.AddDataContent()}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row></Row>
        <style>
          {
            "\
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
        // img {\
        //   border: 1px solid #ddd;\
        //   border-radius: 4px;\
        //   padding: 5px;\
        // }\
        // img:hover {\
        //   box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);\
        // }\
        .rdw-editor-main {\
          height: 300px;\
          overflow: auto;\
          box-sizing: border-box;\
        }\
      "
          }
        </style>
      </Container>
    );
  }
}
export default Content;
