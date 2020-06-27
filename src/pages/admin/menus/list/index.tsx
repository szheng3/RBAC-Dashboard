import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import checkPermission from '@/utils/checkPermission';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { CreateParams, TableListItem, UpdateParams } from './data.d';
import { addMenu, queryMenus, updateMenu } from './service';

/**
 * 添加菜单
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新菜单
 * @param fields
 */
const handleUpdate = async (fields: UpdateParams) => {
  const hide = message.loading('正在修改');
  try {
    await updateMenu(fields);
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(
    false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Id',
      dataIndex: 'idMenu',
    },
    {
      title: '中文描述',
      dataIndex: 'menu',
      renderText: (menu: any) => menu?.name,

    },
    {
      title: '图标',
      dataIndex: 'menu',
      renderText: (menu: any) => menu?.icon,

    },
    {
      title: '路径',
      dataIndex: 'menu',
      renderText: (menu: any) => menu?.path,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      renderText: (menu: any[]) => menu?.map(({ name }) => name).join(", "),
    },
    {
      title: '父类菜单',
      dataIndex: 'menu',
      renderText: (menu: any) => menu?.idParent,
    },
    {
      title: '创建时间',
      dataIndex: 'menu',
      renderText: (val: any) => moment(val?.createDate).fromNow(),
    },
    {
      title: '更新时间',
      dataIndex: 'menu',
      valueType: 'dateTime',
      renderText: (val: any) => val?.updateDate,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {checkPermission('MENU_WRITE') ? (
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              修改
            </a>
          ) : null}
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    if (checkPermission('MENU_WRITE')) {
      return (
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined/> 新建
        </Button>
      );
    }
      return null;

  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="idMenu"
        toolBarRender={(action, { selectedRows }) => [renderCreateButton()]}
        pagination={{ defaultPageSize: 8 }}
        search={false}
        request={params => queryMenus(params)}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
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
