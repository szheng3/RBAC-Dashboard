import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import request from '@/utils/request';
import { queryPermissions } from '@/pages/admin/permissions/list/service';
import { TableListItem, CreateParams } from '../data.d';

const FormItem = Form.Item;

const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: CreateParams) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = (await form.validateFields()) as CreateParams;
    form.resetFields();
    handleAdd(fieldsValue);
  };

  const [menus, setMenus] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    async function getSelectedMenus() {
      const response = await request('/oauth2/selectMenus');
      if (response) {
        setMenus(response);
      }
    }
    async function getPermissions() {
      const response = await queryPermissions();
      if (response) {
        console.log(response)
        setPermissions(response.data)
      }
    }

    getSelectedMenus();
    getPermissions();
  }, []);

  return (
    <Modal
      destroyOnClose
      title="新建菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name={['menu', 'name']}
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入图标！" />
        </FormItem>
        <FormItem  labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="中文描述" name={['menu', 'icon']}>
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

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限" name="permissionId">
          <Select allowClear placeholder="请选择权限！" style={{ width: '100%' }}>
            {permissions.map((menu: TableListItem) => (
              <Option key={menu._id} value={menu._id}>
                {menu.name}
              </Option>
            ))}
          </Select>
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父类菜单" name={['menu', 'idParent']}>
          <Select allowClear placeholder="请选择父类菜单！" style={{ width: '100%' }}>
            {menus.map((menu: TableListItem) => (
              <Option key={menu.idMenu} value={menu.idMenu}>
                {menu.path}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
