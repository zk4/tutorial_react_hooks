import {Button, Select, Form, Input, InputNumber, Popconfirm, Table, Typography} from 'antd';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
const {Option} = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e ? e.fileList : null;
};

const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const Dirt = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [columns, setColumns] = useState([]);
  const [datas, setDatas] = useState([]);
  const tableName = 'GithubIssue';
  useEffect(() => {
    axios.get(`http://127.0.0.1:8081/getTableHeaders?tableName=${tableName}`)
      .then(res => {
        if (res.data.code === 0) {
          console.log(res.data)
          setColumns(res.data.data)
        }
      })
  }, [])

  useEffect(() => {
    axios.get(`http://127.0.0.1:8081/getDatas?tableName=${tableName}`)
      .then(res => {
        if (res.data.code == 0) {
          console.log(res.data)
          if (res.data.code == 0) {
            console.log(res.data)
            setDatas(res.data.data)
          }

        }
      })
  }, [])


  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


  const onSearch = (params) => {
    console.log('Received values of form: ', params);

    // 制作 JPA filters   
    const filters = Object.entries(params)
      .filter(([key, _]) => {return key !== 'pageNumber' && key !== 'pageSize'})
      .filter(([_, value]) => {return value != null && value.length !== 0;})
      .map(([key, value]) => {return key + "==" + value;})
      .join(";");

    console.log(filters)
    // 只能用字符串拼，不然会转义
    // let myParams = "filter=url==%25http%25;number==1";
    let myParams = `filter=${filters}`;

    let url = `http://127.0.0.1:8081/getDatas?tableName=${tableName}&${myParams}`;
    axios.get(url)
      .then(res => {
        if (res.data.code == 0) {
          console.log(res.data)
          if (res.data.code == 0) {
            console.log(res.data)
            setDatas(res.data.data)
          }

        }
      })

  };

  return (
    columns && <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onSearch}
      initialValues={{
        'input-number': 3,
        'checkbox-group': ['A', 'B'],
        rate: 3.5,
      }}
    >
      <Form.Item
        name="title"
        label="title"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please select your title!',
          },
        ]}
      >
        <Select placeholder="Please select a title">
          <Option value="tom">tom</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="select-multiple"
        label="Select[multiple]"
        rules={[
          {
            required: false,
            message: 'Please select your favourite colors!',
            type: 'array',
          },
        ]}
      >
        <Select mode="multiple" placeholder="Please select favourite colors">
          <Option value="red">Red</Option>
          <Option value="green">Green</Option>
          <Option value="blue">Blue</Option>
        </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={datas}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default Dirt;
