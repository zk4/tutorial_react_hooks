import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  EllipsisOutlined, PlusOutlined,

} from '@ant-design/icons';
import {
  ProTable,
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {Button, Dropdown, Menu, message} from 'antd';
import {useRef} from 'react';
import request from 'umi-request';

const waitTime = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// type GithubIssueItem = {
//   url: string;
//   id: number;
//   number: number;
//   title: string;
//   labels: {
//     name: string;
//     color: string;
//   }[];
//   state: string;
//   comments: number;
//   created_at: string;
//   updated_at: string;
//   closed_at?: string;
// };

// const columns [>: ProColumns<GithubIssueItem>[]<] = [
//   {
//     dataIndex: 'index',
//     valueType: 'indexBorder',
//     width: 48,
//   },
//   {
//     title: '标题',
//     dataIndex: 'title',
//     copyable: true,
//     ellipsis: true,
//     tip: '标题过长会自动收缩',
//     formItemProps: {
//       rules: [
//         {
//           required: true,
//           message: '此项为必填项',
//         },
//       ],
//     },
//   },
//   {
//     disable: true,
//     title: '状态',
//     dataIndex: 'state',
//     filters: true,
//     onFilter: true,
//     ellipsis: true,
//     valueType: 'select',
//     valueEnum: {
//       all: {text: '超长'.repeat(50)},
//       open: {
//         text: '未解决',
//         status: 'Error',
//       },
//       closed: {
//         text: '已解决',
//         status: 'Success',
//         disabled: true,
//       },
//       processing: {
//         text: '解决中',
//         status: 'Processing',
//       },
//     },
//   },
//   {
//     disable: true,
//     title: '标签',
//     dataIndex: 'labels',
//     search: false,
//     renderFormItem: (_, {defaultRender}) => {
//       return defaultRender(_);
//     },
//     render: (_, record) => (
//       <Space>
//         {record.labels.map(({name, color}) => (
//           <Tag color={color} key={name}>
//             {name}
//           </Tag>
//         ))}
//       </Space>
//     ),
//   },
//   {
//     title: '创建时间',
//     key: 'showTime',
//     dataIndex: 'created_at',
//     valueType: 'dateTime',
//     sorter: true,
//     hideInSearch: true,
//   },
//   {
//     title: '创建时间',
//     dataIndex: 'created_at',
//     valueType: 'dateRange',
//     hideInTable: true,
//     search: {
//       transform: (value) => {
//         return {
//           startTime: value[0],
//           endTime: value[1],
//         };
//       },
//     },
//   },
//   {
//     title: '操作',
//     valueType: 'option',
//     key: 'option',
//     render: (text, record, _, action) => [
//       <a
//         key="editable"
//         onClick={() => {
//             if (action) {
//               let editable = action.startEditable;
//               if (editable) {
//                 editable(record.id);
//               }
//             }
//           }
//         }
//       >
//         编辑
//       </a>,
//       <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
//         查看
//       </a>,
//       <TableDropdown
//         key="actionGroup"
//         onSelect={() =>  action.reload()}
//         menus={[
//           {key: 'copy', name: '复制'},
//           {key: 'delete', name: '删除'},
//         ]}
//       />,
//     ],
//   },
// ];

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

    console.log(filters)
    // 只能用字符串拼，不然会转义
    let myParams = `filter=${filters}`;

    let url = `http://127.0.0.1:8081/getDatas?tableName=${tableName}&${myParams}`;
    return request(url, {params, });
  }

  const onCreate = async (values) => {
    let res = await axios.post(`http://127.0.0.1:8081/dirt/create?tableName=${tableName}`, {
      ...values
    }
    )
    if (res.data.code === 0) {
      if (res.data) {
        // setColumns(res.data.data)
        message.success('提交成功');
        search();
      }
    } else {
    }
    return true;
  }

  const generateForm = () => {
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
        columns
          .filter(c => c.submitable)
          .map(c => {
            return <ProForm.Group >
              <ProFormText
                width="md"
                name={c.key}
                label={c.submitLabel}
                tooltip={c.submitTooltip}
                placeholder={c.submitPlaceholder}
              />
            </ProForm.Group>
          })}
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
