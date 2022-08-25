import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import axios from 'axios';
import {PlusOutlined, } from '@ant-design/icons';
import {ProTable, BetaSchemaForm, } from '@ant-design/pro-components';
import {Button, message} from 'antd';
import request from 'umi-request';


export default function Dirt(props) {
  const tableName = props.tableName;
  let [columns, setColumns] = useState([]);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8081/getTableHeaders?tableName=${tableName}`)
      .then(res => {
        if (res.data.code === 0) {
          let cs = res.data.data;
          cs = cs.map(c => {
            if (c["actions"]) {
              c['key'] = 'option';
              c['valueType'] = 'option';
              c['fixed'] = 'right';
              c['width'] = 10;
              c['render'] = (text,record,index) => c["actions"].map(a =>generateAction(a,text,record,index));
            }
            return c;
          });
          setColumns(cs)
        }
      });
  }, [columns]);


  const onCreate = async (values) => {
    console.log("onCreate", values)
    try {
      let res = await axios.post(`http://127.0.0.1:8081/dirt/create?tableName=${tableName}`, {
        ...values
      })
      if (res.data.code === 0) {
        if (res.data) {
          message.success('提交成功');
          actionRef.current.reload();
        }
      } else {
        message.error('提交失败');
      }
    } catch (e) {
      message.error(' 网络失败,请查看 console');
    }
    return true;
  }
  const generateForm = () => {
    const submitTypes = columns.filter(c => c.submitType != null).map(c => c.submitType)
    return <BetaSchemaForm
      title="创建"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          创建
        </Button>
      }
      layoutType='ModalForm'
      columns={submitTypes}
      autoFocusFirstInput
      modalProps={{onCancel: () => console.log('run'), }}
      submitTimeout={4000}
      rowProps={{gutter: [16, 16], }}
      colProps={{span: 12, }}
      grid={true}
      onFinish={v => onCreate(v)} >

    </BetaSchemaForm>
  }


  const generateAction=(name,text,record,index)=>{
    let formData = columns.filter(c => c.submitType != null).map(c => c.submitType)
    formData=formData.map(d=>{
      d.initialValue  = record[d.key];
      return d;
    });
    return <BetaSchemaForm
      title={name}
      readonly={true}
      trigger={<a> {name} </a>}
      layoutType='ModalForm'
      columns={formData}
      autoFocusFirstInput
      modalProps={{onCancel: () => console.log('run'), }}
      submitTimeout={4000}
      rowProps={{gutter: [16, 16]}}
      colProps={{span: 12, }}
      grid={true}
      onFinish={v => onCreate(v)} >

    </BetaSchemaForm>
  }

  // 用来操作 ProTable
  // https://procomponents.ant.design/components/table/#actionref-%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91
  const actionRef = useRef();

  const searchPromise = async (params = {}, sort, filter) => {
    // 映射 current 到 pageNumber
    params.pageNumber = params.current;
    delete params["current"];

    // 制作 JPA filters   
    let paramsCpy = Object.assign({}, params)
    delete paramsCpy["pageNumber"];
    delete paramsCpy["pageSize"];
    const filters = Object.entries(params)
      .filter(([key, _]) => {
        return key !== 'pageNumber' && key !== 'pageSize'
      })
      .filter(([_, value]) => {
        return value !== null && value.trim().length !== 0;
      })
      .map(([key, value]) => {
        return key + "==" + value;
      })
      .join(";");


    // 只能用字符串拼，不然会转义
    let myParams = `filter=${filters}`;

    let url = `http://127.0.0.1:8081/getDatas?tableName=${tableName}&${myParams}`;
    return request(url, {
      params,
    });
  }

  return (columns && <ProTable
    scroll={{x: 1300}}
    columns={columns}
    actionRef={actionRef}
    cardBordered request={
      searchPromise
    }
    editable={
      {
        type: 'multiple',
      }
    }
    columnsState={
      {
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }
    }
    rowKey="id"
    search={
      {
        labelWidth: 'auto',
      }
    }
    options={
      {
        setting: {
          listsHeight: 400,
        },
      }
    }
    form={
      {
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              // closed_at:new Date(values.closed_at).toISOString()
              // 注了
              // created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }
    }
    pagination={
      {
        pageSize: 5,
        onChange: (page) => console.log(page),
      }
    }
    dateFormatter="string"
    headerTitle=""
    toolBarRender={
      () => [
        generateForm()
      ]
    }
  />
  );
};
