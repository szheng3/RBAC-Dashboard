import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import checkPermission, { PermissionsEnum } from '@/utils/checkPermission';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { CreateParams, PermissionFormParams, TableListItem } from './data.d';
import { addRole, queryRoles, setPermissions, updateRole } from './service';
import PermissionForm from './components/PermissionForm';
import { TableListItem as PermissionData } from '../../permissions/list/data.d';

/**
 * 添加角色
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addRole(fields);
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
 * 更新角色
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateRole(fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 * 分配权限
 * @param fields
 */
const handlePermissions = async (fields: PermissionFormParams) => {
  const hide = message.loading('正在修改');
  try {
    await setPermissions({
      rolesIdRoles: fields.id,
      permissions: fields.permissionIds,
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
  const [permissionModalVisible, handlePermissionModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [permissionFormValues, setPermissionFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'roles',
      renderText: (roles: any) => roles.name,
    },
    {
      title: '权限列表',
      dataIndex: 'permissions',
      renderText: (permissions: PermissionData[]) =>
        permissions.map((permission) => permission.name).join(', '),
    },
    {
      title: '创建时间',
      dataIndex: 'roles',
      renderText: (val: any) => {
        return moment(moment.utc(val?.createDate).toDate()).local(true).format('YYYY-MM-DD');
      },
    },
    {
      title: '更新时间',
      dataIndex: 'roles',
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
            disabled={!checkPermission(PermissionsEnum.ROLES_WRITE)}
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
            disabled={!checkPermission(PermissionsEnum.ROLES_WRITE)}
            onClick={() => {
              handlePermissionModalVisible(true);
              setPermissionFormValues(record);
            }}
          >
            分配权限
          </a>
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    return (
      <Button
        type="primary"
        disabled={!checkPermission(PermissionsEnum.ROLES_WRITE)}
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
        request={(params) => queryRoles()}
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
      {checkPermission(PermissionsEnum.ROLES_WRITE) &&
      stepFormValues &&
      Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
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

      {permissionFormValues && Object.keys(permissionFormValues).length ? (
        <PermissionForm
          onSubmit={async (value) => {
            const success = await handlePermissions(value);
            if (success) {
              handlePermissionModalVisible(false);
              setPermissionFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handlePermissionModalVisible(false);
            setPermissionFormValues({});
          }}
          updateModalVisible={permissionModalVisible}
          values={permissionFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
