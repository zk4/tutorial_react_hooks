import React from "react";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Dirt from './Dirt'

function App() {
  return (
    <div className="app">
      <Dirt tableName="GithubBug"/>
    </div>
  );
}

export default App;
