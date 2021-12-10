import axios from 'axios';

import React,{Component} from 'react';
const APIUrl = global.config.variable.Url; // APIUrl

class TestFile extends Component {

	state = {
	selectedFile: null,
	ArrFile: [],
  url:''
	};

	Excel() {
        const helloWorldExcelContent = "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";
		const linkSource = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + helloWorldExcelContent;
		
	// 	const downloadLink = document.getElementById("Excel1");
    // const fileName = `test.xlsx`;
    // downloadLink.download= fileName;
    // downloadLink.href = linkSource;
    // downloadLink.target = '_blank';
    // downloadLink.click();

	const downloadLink = document.getElementById("test1");
    const fileName = `test.xlsx`;
    downloadLink.download= fileName;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
	
    // const link = document.getElementById("Excel1");
    // link.href = linkSource;
    // link.setAttribute('download', 'Detail_Blast.xls');
    // document.body.appendChild(link);
    // link.click();
    // console.log(linkSource)
	}
	
	// On file select (from the pop up)
	onFileChange = event => {
        // console.log("onFileChange");
        const files = event.target.files;

        // for (let i = 0; i < files.length; i++) {
        //     formData.append(`files[${i}]`, files[i])
        // }
        this.state.ArrFile.push(event.target.files[0]);
        // console.log(this.state.ArrFile);
	// Update the state
	this.setState({ selectedFile: event.target.files[0] });
	
	};
	
	// On file upload (click the upload button)
	ReadFileUpload = () => {
    axios.post(`${APIUrl}Warranty/FTPReadFile?filename=` + '12021-04-29_01-30-42-283.jfif')
    .then((response) => {
      //console.log(res.data.data);
      if(response.data.status === 0){
        this.setState({url: response.data.message});
        alert(this.state.url);
      }
      else
      {
        alert('please check your username and password and try again')
        return;
      }
    })
    .catch((err) => console.log(err));
	};
	// On file upload (click the upload button)
	onFileUpload = () => {
	
	// Create an object of formData
	const formData = new FormData();
	let temp1 = [{
		"Purchase_Province": 10,
		"Purchase_Date": "2021-05-02T17:00:00.000Z",
		"Store_ID": 102,
		"Store_Name_Other": "",
		"Receipt_Number": "bank1",
		"Barcode_Number": "8850036111049",
		"Warranty_Number": "bank1",
		"Type_ID": 4,
		"Product_ID": 228,
		"Model_ID": 0,
		"Product_Code_Other": "bank1",
		"QTY": 0,
		"Product_code": "F21202-CHACT",
		"product_Name": "เอโร่ ก๊อกเดี่ยวอ่างล้างหน้าชุบโครเมี่ยม",
		"Lang_ID": 1,
		"Customer_Code": "",
		"Customer_Firstname": "bank1",
		"Customer_Lastname": "bank1",
		"Customer_Tel": "bank1",
		"Customer_Mobile": "bank1",
		"Customer_Email": "nopparats57@nu.ac.th",
		"Customer_Address": "bank1",
		"Customer_Province": 24,
		"Customer_District": 2410,
		"Customer_SubDistrict": 241001,
		"Customer_ZipCode": "24160",
		"Customer_Latitude": "",
		"Customer_Longtitude": "",
		"Score": 3,
		"Description": "bank1",
		"Service_Center": "PT",
		"Service_Center_Name": "พัทยา",
		"Seq": [
			0
		]
	}
	// ,{
	// 	"Purchase_Province": 24,
	// 	"Purchase_Date": "2021-05-04T17:00:00.000Z",
	// 	"Store_ID": 129,
	// 	"Store_Name_Other": "",
	// 	"Receipt_Number": "test9",
	// 	"Barcode_Number": "8850036185088",
	// 	"Warranty_Number": "test9",
	// 	"Type_ID": 4,
	// 	"Product_ID": 319,
	// 	"Model_ID": 0,
	// 	"Product_Code_Other": "test9",
	// 	"QTY": 2,
	// 	"Product_code": "FFAS2901-111500BF0",
	// 	"product_Name": "ออนิคก๊อกผสมอ่างล้างหน้าไม่รวมสต๊อปวาล์ว",
	// 	"Lang_ID": 1,
	// 	"Customer_Code": null,
	// 	"Customer_Firstname": "test9",
	// 	"Customer_Lastname": "test9",
	// 	"Customer_Tel": "test9",
	// 	"Customer_Mobile": "test9",
	// 	"Customer_Email": "parinya.ekk@gmail.com",
	// 	"Customer_Address": "test9",
	// 	"Customer_Province": 10,
	// 	"Customer_District": 1002,
	// 	"Customer_SubDistrict": 100202,
	// 	"Customer_ZipCode": "10300",
	// 	"Customer_Latitude": "",
	// 	"Customer_Longtitude": "",
	// 	"Score": 1,
	// 	"Description": "test9",
	// 	"Service_Center": "BKK",
	// 	"Service_Center_Name": "กรุงเทพฯ",
	// 	"Seq": [1]
	// },{
	// 	"Purchase_Province": 24,
	// 	"Purchase_Date": "2021-05-04T17:00:00.000Z",
	// 	"Store_ID": 129,
	// 	"Store_Name_Other": "",
	// 	"Receipt_Number": "test8",
	// 	"Barcode_Number": "8850036209111",
	// 	"Warranty_Number": "test9",
	// 	"Type_ID": 2,
	// 	"Product_ID": 114,
	// 	"Model_ID": 0,
	// 	"Product_Code_Other": "test9",
	// 	"QTY": 1,
	// 	"Product_code": "FFAS6586-908500BF1",
	// 	"product_Name": "SIMPLE TISSUE HOLDER",
	// 	"Lang_ID": 1,
	// 	"Customer_Code": null,
	// 	"Customer_Firstname": "test9",
	// 	"Customer_Lastname": "test9",
	// 	"Customer_Tel": "test9",
	// 	"Customer_Mobile": "test9",
	// 	"Customer_Email": "parinya.ekk@gmail.com",
	// 	"Customer_Address": "test9",
	// 	"Customer_Province": 10,
	// 	"Customer_District": 1002,
	// 	"Customer_SubDistrict": 100202,
	// 	"Customer_ZipCode": "10300",
	// 	"Customer_Latitude": "",
	// 	"Customer_Longtitude": "",
	// 	"Score": 1,
	// 	"Description": "test9",
	// 	"Service_Center": "BKK",
	// 	"Service_Center_Name": "กรุงเทพฯ",
	// 	"Seq": []
 	// }
];
	let filetemp = this.state.ArrFile[0];
	// Update the formData object
	formData.append('datas', JSON.stringify(temp1));
	// formData.append('files', this.state.ArrFile);
	for (let i = 0 ; i < 2 ; i++) {
		formData.append('Files', filetemp);
	}
	
	// Details of the uploaded file
	// console.log(this.state.selectedFile);
	
	// Request made to the backend api
	// Send formData object
	// axios.post(`https://localhost:44373/api/Warranty/UpdateDataWarranty`, formData)
    axios.post(`https://localhost:44373/api/Warranty/AddDataWarranty`, formData, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {        
        if(response.data.status == 0){
          //console.log(response.data.data);
          alert('Success !');
          window.location.reload();
        }
      })
      .catch((err) => alert(err));
	};
	
	// File content to be displayed after
	// file upload is complete
	fileData = () => {
	
	if (this.state.selectedFile) {
		
		return (
		<div>
			<h2>File Details:</h2>
			
<p>File Name: {this.state.selectedFile.name}</p>

			
<p>File Type: {this.state.selectedFile.type}</p>

			
<p>
			Last Modified:{" "}
			{this.state.selectedFile.lastModifiedDate.toDateString()}
			</p>

		</div>
		);
	} else {
		return (
		<div>
			<br />
			<h4>Choose before Pressing the Upload button</h4>
		</div>
		);
	}
	};
	

	render() {
	
	return (
		<div>
			<div>
        <button onClick={this.ReadFileUpload}>Read File
          </button>
			</div>
			<div>
        <img src={"data:image/png;base64," + this.state.url} alt="Test Read File" style={{ width: '200'}} />	
			</div>
			<h3>
			File Upload using React!
			</h3>
			<div>
				<img src="data:image/png;base64, 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"/>
				<a download="FILENAME" href="data:image/png;base64, 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">Download</a>
				<input type="file" onChange={this.onFileChange} />
				<button onClick={this.onFileUpload}>
				Upload!
				</button>
			</div>
			
			<button onClick={() => this.Excel()} id="Excel1">Excel
          </button>
		  <button id="test1" type="hidden" download="FILENAME" href="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64, 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">Download</button>
		{this.fileData()}
		</div>
    
	);
	}
}

export default TestFile;
