import { Switch, Table } from 'antd';
import axios from 'axios';
import React, { useState,useEffect,useLayoutEffect } from 'react';
const cs = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
  },
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];

const Dirt = () => {
  const [fixedTop, setFixedTop] = useState(false);
  const [columns, setColumns] = useState(cs);
  const [d, setData] = useState(columns);

  useEffect(()=>{
      axios.get('http://127.0.0.1:8081/getTableHeaders?pageId=dirt')
        .then(res => {
          if (res.data.code == 0)
          {
            console.log(res.data)
            setColumns(res.data.data)
          }
        })
  },[])

  useLayoutEffect(()=>{
    let page = {page: 0, size: 10}
    let pageStr = new URLSearchParams(page).toString()
    let s1 = ""
    let inputValue = s1

    axios.get(`http://127.0.0.1:8081/getLayoutPage?${pageStr}&filter=pageName==%25${s1}%25`)
      .then(res => {
        let datas = res.data.data.map(d => {return {...d, key: d.id}});
        console.log(datas)
        setData(datas);
    });
  },[])
  return (
    <Table
      columns={columns}
      dataSource={d}
      scroll={{
        x: 1500,
        y: 500,
      }}
    />
  );
};

export default Dirt;
