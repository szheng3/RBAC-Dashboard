import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import checkPermission, { PermissionsEnum } from '@/utils/checkPermission';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import RoleForm from './components/RoleForm';
import { CreateParams, RoleFormParams, TableListItem } from './data.d';
import { addUser, queryUsers, setRoles, updateUser } from './service';

/**
 * 添加员工
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addUser(fields);
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
 * 更新员工
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateUser(fields);
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    console.log(error);
    // message.error('修改失败请重试！');
    throw error;
    // return false;
  }
};

/**
 * 分配角色
 * @param fields
 */
const handleRoles = async (fields: RoleFormParams) => {
  const hide = message.loading('正在修改');
  console.log(fields);
  try {
    await setRoles({
      userId: fields.id,
      roleIds: fields.roleIds,
    });
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
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [roleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [roleFormValues, setRoleFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'users',
      renderText: (val: any) => val.name,
    },
    {
      title: 'email',
      dataIndex: 'users',
      renderText: (val: any) => val.email,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      renderText: (roles: any[]) => roles.map(({ roles }) => roles.name).join(', '),
    },
    // {
    //   title: '是否是超级管理员',
    //   dataIndex: 'isAdmin',
    //   renderText: (val: string) => (val ? '是' : '否'),
    // },
    {
      title: '创建时间',
      dataIndex: 'users',
      renderText: (val: any) => {
        return moment(moment.utc(val?.createDate).toDate()).local(true).format('YYYY-MM-DD');
      },
    },
    {
      title: '更新时间',
      dataIndex: 'users',
      renderText: (val: any) => moment(moment.utc(val?.updateDate).toDate()).local(true).fromNow(),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            type="link"
            disabled={!checkPermission(PermissionsEnum.USERS_WRITE)}
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>

          <Divider type="vertical" />
          <a
            type="link"
            disabled={!checkPermission(PermissionsEnum.USERS_WRITE)}
            onClick={() => {
              handleRoleModalVisible(true);
              setRoleFormValues(record);
            }}
          >
            分配角色
          </a>
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    return (
      <Button
        disabled={!checkPermission(PermissionsEnum.USERS_WRITE)}
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
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [renderCreateButton()]}
        pagination={false}
        search={false}
        request={(params) => queryUsers(params)}
        columns={columns}
      />
      <CreateForm
        onSubmit={async (value) => {
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
          onSubmit={async (value, form) => {
            try {
              const success = await handleUpdate(value);
              if (success) {
                handleUpdateModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            } catch (e) {
              form?.setFields(
                Object.keys(e.data).map((key) => ({ name: key, errors: [e.data[key]] })),
              );
              // console.log(form)
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

      {roleFormValues && Object.keys(roleFormValues).length ? (
        <RoleForm
          onSubmit={async (value) => {
            const success = await handleRoles(value);
            if (success) {
              handleRoleModalVisible(false);
              setRoleFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleRoleModalVisible(false);
            setRoleFormValues({});
          }}
          updateModalVisible={roleModalVisible}
          values={roleFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
