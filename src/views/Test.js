import React from "react";


class Test extends React.Component{
  handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
  }

    render(){
        return(
          <div className="sweet-loading">
        </div>
        )
    }

};

function test() {
  alert('test');
}
export default Test;