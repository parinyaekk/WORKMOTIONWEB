import React from "react";
import axios from "axios";
// import Select from 'react-select';
import { Container, Row, Col } from "shards-react";
// import PageTitle from "../components/common/PageTitle";
import "react-table/react-table.css";
import $ from "jquery";
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
import LoadingOverlay from "react-loading-overlay";

const APIUrl = global.config.variable.Url;
const APIImagePath = global.config.variable.ImagePath;
class Content extends React.Component {

  async GetDataContentHead() {
    const Tempdata = {
      Lang_ID: this.state.LangID
    };
    await axios
      .post(`${APIUrl}Master/GetAllDataContentHead`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var Obj = {
              value: index.id,
              label: index.content_Head_Name
            };
            ArrTemp.push(Obj);
          });
          this.setState({ ArrContentHeader: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async GetDataMenu() {
    const Tempdata = {
      Lang_ID: this.state.LangID
    };
    await axios
      .post(`${APIUrl}Master/GetAllDataMenu`, Tempdata)
      .then(response => {
        if (response.data.status == 0) {
          var ArrTemp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var Obj = {
              value: index.id,
              label: index.menu_Name
            };
            ArrTemp.push(Obj);
          });
          this.setState({ ArrMenu: ArrTemp });
          // console.log(response.data.data);
          this.forceUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  OpenEditPopup(value) {
    var data = value;
    axios.post(`${APIUrl}Content/GetDataContentByID?ID=` + data)
      .then(response => {
        if (response.data.status === 0) {
          var Data = response.data.data;
          var ContentHeader = this.state.ArrContentHeader.filter(x => x.value == parseInt(Data[0].contentHead));
          var Menu = this.state.ArrMenu.filter(x => x.value == parseInt(Data[0].manuName));
          this.setState({
            ID: Data[0].id,
            Menu_Name: Menu,
            Content_Header: ContentHeader,
            // Href_Link: Data[0].link, 
            Header_Name: Data[0].headerName,
            Description: Data[0].description
          });
          var ArrTemp = [];
          Array.prototype.forEach.call(Data[0].subContent, function (index) {
            var TempObj = {
              id: index.id,
              subHeaderName: index.headerName,
              subContentBody: index.description,
              subFile: index.file,
              type: "Old",
            };
            ArrTemp.push(TempObj);
          });
          this.setState({ ArrSubContent: ArrTemp });
        }
      }).catch(err => {
        console.log(err)
      });

  }

  ClearFieldAdd() {
    this.setState({ Menu_Name: "", Content_Header: "", Href_Link: "", Header_Name: "", Description: "" });
    $("#Subset").hide();
  }

  async componentWillMount() {
    // await this.GetMenuAll();
    // await this.GetDataContentHead();
    // await this.GetDataMenu();
    await this.GetDataPermission();
    await this.GetMenuAllpage(this.state.Page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

  ShowSubSetInput() {
    $("#Subset").show();
  }

  ChangeHrefInput = event => {
    this.setState({ Href_Link: event.target.value });
  }

  ChangeHeaderNameInput = event => {
    this.setState({ Header_Name: event.target.value });
  }

  ChangeDescriptionInput = event => {
    this.setState({ Description: event.target.value });
  }

  ChangeContentHeadInput = event => {
    this.setState({ Content_Header: event.target.value });
  }

  ChangeMenuNameInput = event => {
    this.setState({ Menu_Name: event.target.value });
  }

  ChangeSubDescriptionInput = event => {
    this.setState({ SubDescription: event.target.value });
  }

  ChangeSubHeaderNameInput = event => {
    this.setState({ SubHeader_Name: event.target.value });
  }

  setStateStartDateSearch = event => {
    this.setState({ StartDateSearch: event.target.value });
  }

  setStateEndDateSearch = event => {
    this.setState({ EndDateSearch: event.target.value });
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      usernames: Cookies.get('username'),
      User_Group: localStorage.getItem("User_Group"),
      per_menu_name: 'Manage Content',
      Permission: "",

      ContentData: [],
      Menu: [],
      LangID: 1,
      ID: 0,
      Menu_Name: 0,
      Content_Header: 0,
      Image: '',
      Href_Link: '',
      Header_Name: '',
      Description: '',
      FileNow: null,
      ArrFile: [],
      ArrPreviewFile: [],
      ShowImage: '',
      ArrSubContent: [],
      SubHeader_Name: '',
      SubDescription: '',
      ArrContentHeader: [],
      ArrMenu: [],
      ShowSubset: false,
      MenuID: null,
      data: {},
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
          label: "ภาษา",
          field: "lang_ID",
          sort: "asc",
          width: 150
        },
        {
          label: "ชื่อเมนู",
          field: "menu",
          sort: "asc",
          width: 150
        },
        {
          label: "เมนูหลัก",
          field: "main_menu",
          sort: "asc",
          width: 150
        },
        {
          label: "จัดการ",
          field: "edit_button",
          sort: "asc",
          width: 150
        }
      ],
    };
    this.renderShowFile = this.renderShowFile.bind(this);
  }

  AddDataContent() {
    // var temp = [];

    // Array.prototype.forEach.call(this.state.ArrFile, function(index){
    //   if(index.Type == "Old"){
    //     temp.push(index.File);
    //   }
    // });

    const data = new FormData();
    var connectFile = [];
    var subContent = [];
    var x = 0;
    var i = 0;
    Array.prototype.forEach.call(this.state.ArrSubContent, function (index) {
      Array.prototype.forEach.call(index.subFile, function (index) {
        if (index.Type == "New") {
          data.append('files', index.File);
          // console.log(index.File);
          const tempConnectFile = {
            No: i,
            HrefLink: index.HrefLink,
          };
          connectFile.push(tempConnectFile);
          i++;
        }
      });
      const tempSubContent = {
        No: x,
        connectFile: connectFile,
        subHeaderName: index.subHeaderName,
        subContentBody: index.subContentBody,
      };
      subContent.push(tempSubContent);
      connectFile = [];
      x++;
    });
    // console.log(subContent);
    const Temp = {
      LangID: this.state.LangID,
      Menu: this.state.Menu_Name.value,
      ContentHeader: this.state.Content_Header.value,
      headerName: this.state.Header_Name,
      ContentBody: this.state.Description,
      subContent: subContent
    };

    data.append('datas', JSON.stringify(Temp));
    // console.log(JSON.stringify(Temp));
    axios.post(`${APIUrl}Content/AddDataContent`, data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status === 0) {
          alert('บันทึกสำเร็จ');
          window.location.reload();
        }
      })
      .catch((err) => {
        alert(err);
      });
    //console.log(Temp);
  }

  SaveEditContent() {
    var subConnectOld = [];
    Array.prototype.forEach.call(this.state.ArrSubContent, function (index) {
      if (index.type == "Old") {
        subConnectOld.push(index.id);
      }
    });

    const data = new FormData();
    var connectFile = [];
    var subContent = [];
    var x = 0;
    var i = 0;
    Array.prototype.forEach.call(this.state.ArrSubContent, function (index) {
      if (index.type != "Old") {
        Array.prototype.forEach.call(index.subFile, function (index) {
          if (index.Type == "New") {
            data.append('files', index.File);
            // console.log(index.File);
            const tempConnectFile = {
              No: i,
              HrefLink: index.HrefLink,
            };
            connectFile.push(tempConnectFile);
            i++;
          }
        });
        const tempSubContent = {
          No: x,
          connectFile: connectFile,
          subHeaderName: index.subHeaderName,
          subContentBody: index.subContentBody,
        };
        subContent.push(tempSubContent);
        connectFile = [];
        x++;
      }
    });
    // console.log(subContent);

    const Temp = {
      Id: this.state.ID,
      LangID: this.state.LangID,
      Menu: this.state.Menu_Name.value,
      ContentHeader: this.state.Content_Header.value,
      headerName: this.state.Header_Name,
      ContentBody: this.state.Description,
      subContent: subContent,
      subConnectOld: subConnectOld
    };

    data.append('datas', JSON.stringify(Temp));
    var test = null;
    test = JSON.stringify(Temp);
    // console.log(JSON.stringify(Temp));
    if (test != null) {
      axios.post(`${APIUrl}Content/EditDataContent`, data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.status === 0) {
            alert('บันทึกสำเร็จ');
            window.location.reload();
          }
        })
        .catch((err) => alert(err));
      // console.log(Temp);
    }
  }

  async GetMenuAll() {
    let temp = {
      Page: this.state.Page,
      PerPage: this.state.PerPage
    };
    await axios.post(`${APIUrl}Content/GetaAllDataMenuPagination`, temp)
      // await axios.post(`${APIUrl}Content/GetMenuAll?LangID=` + this.state.LangID)
      .then(response => {
        if (response.data.status === 0) {
          let all_page = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
          this.setState({ AllPage: all_page });
          // console.log(response.data.data);
          var ArrTemp = [];
          let dataTable = [];
          dataTable = {
            rows: response.data.data.result,
            columns: this.state.columns
          };
          dataTable.columns.push({
            label: 'จัดการ',
            field: 'edit_button',
            sort: 'asc',
            width: 150
          });
          this.setState({ Menu: ArrTemp })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async GetMenuAllpage(Page, PerPage, Search, StartDate, EndDate) {
    var _this = this;
    _this.setState({ loading: true });
    let temp = {
      Page: Page,
      PerPage: PerPage,
      Search: Search,
      Start: StartDate,
      End: EndDate,
    };
    await axios.post(`${APIUrl}Content/GetaAllDataMenuPagination`, temp)
      // await axios.post(`${APIUrl}Content/GetMenuAll?LangID=` + this.state.LangID)
      .then(response => {
        if (response.data.status === 0) {
          // console.log(response.data.data);
          let all_page = Math.ceil(parseInt(response.data.data.total) / parseInt(this.state.PerPage));
          this.setState({ AllPage: all_page });
          let TempData = [];
          let no_ran = ((this.state.Page - 1) * this.state.PerPage);
          response.data.data.result.map((item, index) => {
            if (item.id_menu == 0) {
              var TempSubData = {
                no: (no_ran + (index + 1)),
                // id_main_menu: null,
                // id_menu: item.id_main_menu,
                lang_id: item.lang_ID == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ",
                main_menu: item.menu,
                menu: item.main_menu,
                edit_button: this.state.Permission === "W" ?
                  <Link to={{
                    pathname: "/contentdetail",
                    state: {
                      id: item.id_main_menu,
                      name: item.menu
                    }
                  }}>
                    <button type="button" class="btn btn-datatable" style={{ marginTop: '-2%' }}>
                      <img
                        className="img-manage"
                        src={require("../images/editor.png")}
                      />
                    </button>
                  </Link>
                  :
                  <button disabled type="button" class="btn btn-datatable" style={{ marginTop: '-2%' }}>
                    <img
                      className="img-manage"
                      src={require("../images/editor.png")}
                    />
                  </button>,
              }
              TempData.push(TempSubData);
            }
            else {
              var TempSubData = {
                no: (no_ran + (index + 1)),
                // id_main_menu: item.id_main_menu,
                // id_menu: item.id_menu,
                lang_id: item.lang_ID == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ",
                main_menu: item.menu,
                menu: item.main_menu,
                edit_button: this.state.Permission === "W" ?
                  <Link to={{
                    pathname: "/contentdetail",
                    state: {
                      id: item.id_main_menu,
                      name: item.menu
                    }
                  }}>
                    <button type="button" class="btn btn-datatable" style={{ marginTop: '-2%' }}>
                      <img
                        className="img-manage"
                        src={require("../images/editor.png")}
                      />
                    </button>
                  </Link>
                  :
                  <button disabled type="button" class="btn btn-datatable" style={{ marginTop: '-2%' }}>
                    <img
                      className="img-manage"
                      src={require("../images/editor.png")}
                    />
                  </button>,
              }
              TempData.push(TempSubData);
            }
            // var TempSubData = {
            //     no: (no_ran + (index + 1)),
            //     lang_id: item.lang_ID == 1 ? "ภาษาไทย" : "ภาษาอังกฤษ",
            //     main_menu: item.main_menu,
            //     menu: item.menu,
            //     edit_button: 
            //         <Link to={{
            //             pathname: "/contentdetail",
            //             state: {
            //             id: item.id_main_menu,
            //             name: item.menu
            //             }
            //         }}>
            //             <button type="button" class="btn btn-datatable" style={{ marginTop: '-2%' }}>
            //             <img
            //                 className="img-manage"
            //                 src={require("../images/editor.png")}
            //             />
            //             </button>
            //         </Link>,
            //     preview_button: 
            //         <button type="button" style={{ marginTop: '-2px' }} class="btn btn-datatable" onClick={() => this.PreviewPopup(item.menu_id)}  data-toggle="modal" data-target="#TablePreviewPopup" data-backdrop="static">
            //             <img
            //                 className="img-manage"
            //                 src={require("../images/view.png")}
            //                 alt=""
            //             />
            //         </button>
            // }
            // TempData.push(TempSubData);
          });
          var dataTable = {
            rows: TempData,
            columns: this.state.columns
          };
          this.setState({ Menu: dataTable });
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(function () {
        _this.setState({ loading: false });
      });
  }

  ClearSearch() {
    this.setState({ Page: 1,PerPage: 10,Search: '',StartDateSearch: '',EndDateSearch: '',SearchCareArea: null,SearchCustomerType: null });
    window.location.reload();
}
  handleChangeContentHeader = ContentHeader => {
    this.setState({ Content_Header: ContentHeader });
    // console.log(`Option selected:`, ContentHeader);
  };

  handleChangeMenuName = MenuName => {
    this.setState({ Menu_Name: MenuName });
    // console.log(`Option selected:`, MenuName);
  };

  SaveSubContent() {
    const Temp = {
      subHeaderName: this.state.SubHeader_Name,
      subContentBody: this.state.SubDescription,
      subFile: this.state.ArrFile,
    };

    this.state.ArrSubContent.push(Temp);
    this.setState({ SubHeader_Name: "" });
    this.setState({ SubDescription: "" });
    this.setState({ ArrFile: [] });
    this.forceUpdate();
  }

  onSubContentDelete(value) {
    this.state.ArrSubContent.splice(value, 1);
    this.forceUpdate();
  };

  onFileChange = event => {
    // console.log("onFileChange");
    // const files = event.target.files;
    var FileObj = {
      File: event.target.files[0],
      Type: "New"
    };
    this.setState({ FileNow: FileObj });
    // this.state.ArrFile.push(FileObj);
    // this.renderTableFile();
    // console.log(this.state.ArrFile);
    this.forceUpdate();
  };

  AddFileContent() {
    if (this.state.FileNow != null) {
      var FileObj = {
        File: this.state.FileNow.File,
        Type: this.state.FileNow.Type,
        HrefLink: this.state.Href_Link
      };
      this.state.ArrFile.push(FileObj);
      this.setState({ FileNow: null });
      this.setState({ Href_Link: "" });
      $('#file').val('');
      this.forceUpdate();
    }
  };

  onFileDelete(value) {
    this.state.ArrFile.splice(value, 1);
    this.forceUpdate();
  };

  OpenImage(value) {
    var Image = this.state.ArrPreviewFile[value];
    this.setState({ ShowImage: Image });
    this.renderShowFile();

    // this.setState({ image: `${APIImagePath}` + data});
    // console.log(this.state.image);
    // $("#ShowDataDetail").removeAttr("style").hide();
    $("#ShowPic").removeAttr("style").show();

    this.forceUpdate();
  };

  GoToPage(value) {
    window.location.href = value;
  };

  GoToPage(value) {
    window.location.href = value;
  };

  async PreviewPopup(value) {
    var data = value;
    await axios.post(`${APIUrl}Content/GetFileContentById?ID=` + data)
      .then(response => {
        if (response.data.status === 0) {
          var Data = response.data.data;
          this.setState({ ArrPreviewFile: Data });
          // // this.renderTablePreviewFile();
          // this.forceUpdate();
        }
      }).catch(err => console.log(err));
  }

  EnterSearch = event => {
    if (event.key === 'Enter') {
      this.setState({ Page: 1 });
      this.GetMenuAllpage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
    }
  };

  ChangeSearch = event => {
    this.setState({ Search: event.target.value });
  };

  ChangePerPage = event => {
    this.setState({ PerPage: event.target.value });
    this.GetMenuAllpage(this.state.Page, event.target.value, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
    this.GetMenuAllpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
    this.GetMenuAllpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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
    this.GetMenuAllpage(page, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch);
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

  renderTablePreviewFile() {
    return this.state.ArrPreviewFile.map((item, index) => {
      // console.log(item);
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.head}</td>
          <td>{item.name}</td>
          <td>{item.type}</td>
          <td>{item.link}</td>
          <td onClick={() => this.OpenImage(index)} data-toggle="modal" data-target="#ShowPic" data-backdrop="static">
            <input type="button" value="Preview" className="btn btn-danger" />
          </td>
        </tr>
      );
    });
  }

  renderShowFile() {
    // return this.state.ArrPreviewFile.map((item, index) => {
    // console.log(item);
    // if(index == valIndex){
    return (
      <div class="carousel-item active">
        <img class="d-block w-100" src={`${APIImagePath}` + this.state.ShowImage.path} alt="First slide" />
      </div>
    );
    // }
    //  });
  }

  renderTableFile() {
    return this.state.ArrFile.map((item, index) => {
      // console.log(item.File.name);
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.File.name}</td>
          <td onClick={() => this.onFileDelete(index)}>
            <input type="button" value="Delete" className="btn btn-danger" />
          </td>
        </tr>
      );
    });
  }

  renderTableSubContent() {
    return this.state.ArrSubContent.map((item, index) => {
      // console.log(item);
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.subHeaderName}</td>
          <td>{item.subContentBody}</td>
          <td onClick={() => this.onSubContentDelete(index)}>
            <input type="button" value="Delete" className="btn btn-danger" />
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
                      Manage Content
                    </h1>
                    <div class="page-header-subtitle">จัดการ Content</div>
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
                            <button class="btn btn-block btn-success" type="button" style={{ width: '25%' }}>เพิ่มข้อมูล</button> </Link> :
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
                                <button className="btn btn-success" onClick={() => this.GetMenuAllpage(1, this.state.PerPage, this.state.Search, this.state.StartDateSearch, this.state.EndDateSearch)}>ค้นหา</button>
                              </div>
                              <div className="col-md-5">
                                  <button className="btn btn-danger" onClick={() => this.ClearSearch()}>เคลียร์</button>
                              </div>
                          </div>
                      </div>
                    </div>
                    <MDBTable responsive hover>
                      <MDBTableHead columns={this.state.Menu.columns} />
                      <MDBTableBody rows={this.state.Menu.rows} />
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
export default Content;