import React from 'react';
import {BetaSchemaForm, ProFormSelect} from '@ant-design/pro-components';
import {Button,Alert, DatePicker, Space} from 'antd';
import moment from 'moment';
import {useState} from 'react';

// https://procomponents.ant.design/components/schema-form#json-%E6%9D%A5%E7%94%9F%E6%88%90%E8%A1%A8%E5%8D%95
// const valueEnum = {
//   all: {text: '全部', status: 'Default'},
//   open: {
//     text: '未解决',
//     status: 'Error',
//   },
//   closed: {
//     text: '已解决',
//     status: 'Success',
//     disabled: true,
//   },
//   processing: {
//     text: '解决中',
//     status: 'Processing',
//   },
// };


// const scs = [
//   {
//     title: '标题',
//     dataIndex: 'title',
//     formItemProps: {
//       rules: [
//         {
//           required: true,
//           message: '此项为必填项',
//         },
//       ],
//     },
//     width: 'md',
//     colProps: {
//       xs: 24,
//       md: 12,
//     },
//     initialValue: '默认值',
//     convertValue: (value) => {
//       return `标题：${value}`;
//     },
//     transform: (value) => {
//       return {
//         title: `${value}-转换`,
//       };
//     },
//   },
//   {
//     title: '状态',
//     dataIndex: 'state',
//     valueType: 'select',
//     valueEnum,
//     width: 'md',
//     colProps: {
//       xs: 24,
//       md: 12,
//     },
//   },
//   {
//     title: '标签',
//     dataIndex: 'labels',
//     width: 'md',
//     colProps: {
//       xs: 12,
//       md: 4,
//     },
//   },
//   {
//     valueType: 'switch',
//     title: '开关',
//     dataIndex: 'Switch',
//     fieldProps: {
//       style: {
//         width: '200px',
//       },
//     },
//     width: 'md',
//     colProps: {
//       xs: 12,
//       md: 20,
//     },
//   },
//   {
//     title: '创建时间',
//     key: 'showTime',
//     dataIndex: 'createName',
//     initialValue: [moment().add(-1, 'm'), moment()],
//     renderFormItem: () => <DatePicker.RangePicker />,
//     width: 'md',
//     colProps: {
//       xs: 24,
//       md: 12,
//     },
//   },
//   {
//     title: '更新时间',
//     dataIndex: 'updateName',
//     initialValue: [moment().add(-1, 'm'), moment()],
//     renderFormItem: () => <DatePicker.RangePicker />,
//     width: 'md',
//     colProps: {
//       xs: 24,
//       md: 12,
//     },
//   },
//   {
//     title: '分组',
//     valueType: 'group',
//     columns: [
//       {
//         title: '状态',
//         dataIndex: 'groupState',
//         valueType: 'select',
//         width: 'xs',
//         colProps: {
//           xs: 12,
//         },
//         valueEnum,
//       },
//       {
//         title: '标题',
//         width: 'md',
//         dataIndex: 'groupTitle',
//         colProps: {
//           xs: 12,
//         },
//         formItemProps: {
//           rules: [
//             {
//               required: true,
//               message: '此项为必填项',
//             },
//           ],
//         },
//       },
//     ],
//   },
//   {
//     title: '列表',
//     valueType: 'formList',
//     dataIndex: 'list',
//     initialValue: [{state: 'all', title: '标题'}],
//     colProps: {
//       xs: 24,
//       sm: 12,
//     },
//     columns: [
//       {
//         valueType: 'group',
//         columns: [
//           {
//             title: '状态',
//             dataIndex: 'state',
//             valueType: 'select',
//             colProps: {
//               xs: 24,
//               sm: 12,
//             },
//             width: 'xs',
//             valueEnum,
//           },
//           {
//             title: '标题',
//             dataIndex: 'title',
//             width: 'md',
//             formItemProps: {
//               rules: [
//                 {
//                   required: true,
//                   message: '此项为必填项',
//                 },
//               ],
//             },
//             colProps: {
//               xs: 24,
//               sm: 12,
//             },
//           },
//         ],
//       },
//       {
//         valueType: 'dateTime',
//         initialValue: new Date(),
//         dataIndex: 'currentTime',
//         width: 'md',
//       },
//     ],
//   },
//   {
//     title: 'FormSet',
//     valueType: 'formSet',
//     dataIndex: 'formSet',
//     colProps: {
//       xs: 24,
//       sm: 12,
//     },
//     rowProps: {
//       gutter: [16, 0],
//     },
//     columns: [
//       {
//         title: '状态',
//         dataIndex: 'groupState',
//         valueType: 'select',
//         width: 'md',
//         valueEnum,
//       },
//       {
//         width: 'xs',
//         title: '标题',
//         dataIndex: 'groupTitle',
//         tip: '标题过长会自动收缩',
//         formItemProps: {
//           rules: [
//             {
//               required: true,
//               message: '此项为必填项',
//             },
//           ],
//         },
//       },
//     ],
//   },
//   {
//     title: '创建时间',
//     dataIndex: 'created_at',
//     valueType: 'dateRange',
//     width: 'md',
//     colProps: {
//       span: 24,
//     },
//     transform: (value) => {
//       return {
//         startTime: value[0],
//         endTime: value[1],
//       };
//     },
//   },
// ];

export default ({cs,onSubmit}) => {
  const [layoutType, setLayoutType] = useState('ModalForm');
  const [columns, setColumns] = useState(cs);
  return (
    
      <BetaSchemaForm
        trigger={<Button>点击我</Button>}
        layoutType={layoutType}
        steps={[
          {
            title: 'ProComponent',
          },
        ]}
        rowProps={{
          gutter: [16, 16],
        }}
        colProps={{
          span: 12,
        }}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values) => {
          console.log(values);
          onSubmit(values);
        }}
        columns={(  columns)}
      />
  );
};
