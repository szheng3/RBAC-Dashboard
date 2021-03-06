import React from 'react';
import { Form, Input, Modal, Select, Spin } from 'antd';
import request from '@/utils/request';
import { CreateParams, TableListItem } from '../data.d';
import useSWR from 'swr';
import { useAsync } from 'react-async';
import { updateMenuAsync } from '@/pages/admin/menus/list/service';

const FormItem = Form.Item;

const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const { data: menus } = useSWR('/oauth2/selectMenus', request);
  const { data: permissions } = useSWR('/oauth2/permissions', request);
  const { data, isPending, run } = useAsync({
    deferFn: updateMenuAsync,
    onResolve: () => {
      handleAdd();
    },
  });

  const okHandle = async () => {
    const fieldsValue = (await form.validateFields()) as CreateParams;
    // form.resetFields();
    run(fieldsValue);
  };
  return (
    <Modal
      destroyOnClose
      title="新建菜单"
      visible={modalVisible}
      onOk={okHandle}
      confirmLoading={isPending}
      onCancel={() => onCancel()}
    >
      <Spin spinning={!menus || !permissions}>
        <Form form={form}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
            name={['menu', 'name']}
            rules={[{ required: true, message: '请输入名称！' }]}
          >
            <Input placeholder="请输入名称！" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="图标描述"
            name={['menu', 'icon']}
          >
            <Input placeholder="请输入图标名称！" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="路径"
            name={['menu', 'path']}
            rules={[{ required: true, message: '请输入路径！' }]}
          >
            <Input placeholder="请输入路径！" />
          </FormItem>

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="权限"
            name="permissionId"
          >
            <Select allowClear placeholder="请选择权限！" style={{ width: '100%' }}>
              {permissions?.data?.map((menu: TableListItem) => (
                <Option key={menu.id} value={menu.id}>
                  {menu.name}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="父类菜单"
            name={['menu', 'idParent']}
          >
            <Select allowClear placeholder="请选择父类菜单！" style={{ width: '100%' }}>
              {menus?.map((menu: TableListItem) => (
                <Option key={menu.idMenu} value={menu.idMenu}>
                  {menu.path}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateForm;
