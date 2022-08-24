import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {PlusOutlined, } from '@ant-design/icons';
import {ProTable, ModalForm, ProForm, ProFormText, } from '@ant-design/pro-components';
import {Button, message} from 'antd';
import request from 'umi-request';


export default function Dirt(props) {
  const tableName = props.tableName;
  const [columns, setColumns] = useState([]);
  const refreshHeader = () => {
    axios.get(`http://127.0.0.1:8081/getTableHeaders?tableName=${tableName}`)
      .then(res => {
        if (res.data.code === 0) {
          console.log(res.data)
          setColumns(res.data.data)
        }
      })
  }
  useEffect(() => {refreshHeader();}, [])
  const actionRef = useRef();

  const search = async (params = {}, sort, filter) => {
    // 映射 current 到 pageNumber
    params.pageNumber = params.current;
    delete params["current"];

    // 制作 JPA filters   
    let paramsCpy = Object.assign({}, params)
    delete paramsCpy["pageNumber"];
    delete paramsCpy["pageSize"];
    const filters = Object.entries(params)
      .filter(([key, _]) => {return key !== 'pageNumber' && key !== 'pageSize'})
      .filter(([_, value]) => {return value !== null && value.trim().length !== 0;})
      .map(([key, value]) => {return key + "==" + value;})
      .join(";");


    // 只能用字符串拼，不然会转义
    let myParams = `filter=${filters}`;

    let url = `http://127.0.0.1:8081/getDatas?tableName=${tableName}&${myParams}`;
     return request(url, {params, });
  }

  const onCreate = async (values) => {
    try {
      let res = await axios.post(`http://127.0.0.1:8081/dirt/create?tableName=${tableName}`, {...values})
      if (res.data.code === 0) {
        if (res.data) {
          message.success('提交成功');
          actionRef.current.reload();
        }
      } else {
        message.error('提交失败');
      }
    }catch(e){
        message.error(' 网络失败,请查看 console');
    }
    return true;
  }

  const generateForm = () => {
    let grouped = columns
      .filter(c => c.submitable)
      .reduce((a, c) => {
        if (!a[c.submitFormGroupId]) a[c.submitFormGroupId] = []
        a[c.submitFormGroupId].push(c)
        return a;
      }, {})
    console.log("grouped", grouped)

    return <ModalForm title="创建" trigger={
      <Button type="primary">
        <PlusOutlined /> 创建
      </Button>
    }
      autoFocusFirstInput
      modalProps={{onCancel: () => console.log('run'), }}
      submitTimeout={4000}
      onFinish={onCreate}
    >
      {
        Object.entries(grouped).map(([_, cs]) => {
          return <ProForm.Group >
            {
              cs.map(c => <ProFormText
                width={c.submitWidth}
                name={c.key}
                label={c.submitLabel}
                tooltip={c.submitTooltip}
                placeholder={c.submitPlaceholder}
              />

              )
            }
          </ProForm.Group>

        })
      }
    </ModalForm>
  }
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={search}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
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
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle=""
      toolBarRender={() => [
        generateForm()
      ]}
    />
  );
};
