import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import checkPermission, { PermissionsEnum } from '@/utils/checkPermission';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { CreateParams, TableListItem } from './data.d';
import { addPermission, queryPermissions, updatePermission } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addPermission(fields);
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
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updatePermission({
      id: fields.id,
      name: fields.name,
      nameCn: fields.nameCn,
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
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(
    false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },

    {
      title: '创建时间',
      dataIndex: 'createDate',
      renderText: (val: any) => {
        return moment(moment.utc(val).toDate()).
          local(true).
          format('YYYY-MM-DD');
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      renderText: (val: any) => moment(moment.utc(val).toDate()).
        local(true).
        fromNow(),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            type="link"
            disabled={!checkPermission(PermissionsEnum.PERMISSION_WRITE)}
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
      <Button disabled={!checkPermission(PermissionsEnum.PERMISSION_WRITE)}
              type="primary" onClick={() => handleModalVisible(true)}>
        <PlusOutlined/> 新建
      </Button>
    );

  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [renderCreateButton()]}
        pagination={{ defaultPageSize: 8 }}
        search={false}
        request={(params) => queryPermissions(params)}
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
    </PageHeaderWrapper>
  );
};

export default TableList;
