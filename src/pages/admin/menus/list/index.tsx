import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import checkPermission, { PermissionsEnum } from '@/utils/checkPermission';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryMenus } from './service';
import { useExpandedTable } from '@/utils/utils';

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: 'key',
    //   dataIndex: 'idMenu',
    // },
    {
      title: '中文描述',
      dataIndex: 'name',
      // renderText: (menu: any) => menu?.name,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      // renderText: (menu: any) => menu?.icon,
    },
    {
      title: '路径',
      dataIndex: 'path',
      // renderText: (menu: any) => menu?.path,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      renderText: (menu: any[]) => menu?.map(({ name }) => name).join(', '),
    },
    // {
    //   title: '父类菜单',
    //   dataIndex: 'idParent',
    //   // renderText: (menu: any) => menu?.idParent,
    // },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      renderText: (val: any) => {
        return moment(moment.utc(val).toDate()).local(true).fromNow();
        // return moment(moment.utc(val?.createDate).toDate()).local(true).format('YYYY-MM-DD')},
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      renderText: (val: any) => moment(moment.utc(val).toDate()).local(true).fromNow(),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            type="link"
            disabled={!checkPermission(PermissionsEnum.MENU_WRITE)}
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    return (
      <Button
        disabled={!checkPermission(PermissionsEnum.MENU_WRITE)}
        type="primary"
        onClick={() => handleModalVisible(true)}
      >
        <PlusOutlined /> 新建
      </Button>
    );
  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="idMenu"
        toolBarRender={() => [renderCreateButton()]}
        pagination={{ defaultPageSize: 3 }}
        search={false}
        {...useExpandedTable(queryMenus, 'idMenu')}
        columns={columns}
      />
      {checkPermission(PermissionsEnum.MENU_WRITE) && (
        <CreateForm
          onSubmit={() => {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      )}
      {checkPermission(PermissionsEnum.MENU_WRITE) &&
      stepFormValues &&
      Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
