import React from 'react';
import logo from './logo.svg';
import './App.css';

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );してください
}*/
/*function App (){
  Text(){
    alert()
  }
  return(
    <div>
      <input type="text" id="text" onChange="Text();" />
      <input type="button" value="別の関数" onClick={()=>alert(`${document.getElementById("text").value}`)}/>

    </div>
  );
}*/
class App extends React.Component{
  text(){
    //alert(`${document.getElementById("kadai").value}${document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value}`);
    let json ={
      "kadaiName": document.getElementById("kadai").value,
      "subject": document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value
    };
    console.log(json.kadaiName);
    console.log(json.subject);
  }
  
  render(){
    return(
      <div>
        課題名
        <input type="text" id="kadai"/><br/><br/>
        科目選択&nbsp;
        <select id="subject">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select><br/><br/>
        <button onClick={this.text.bind(this)}>送信</button>
      </div>
    );
  }
}


export default App;
