import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import request from '@/utils/request';

import { queryPermissions } from '@/pages/admin/permissions/list/service';
import { TableListItem, UpdateParams } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: UpdateParams) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;

const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = props => {
  const [formVals, setFormVals] = useState<FormValueType>({

    parent: props.values.parent,
    permissionId: props.values?.permissions[0]?._id,
    menu:props.values.menu
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });

    handleUpdate(fieldsValue as UpdateParams);
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
        setPermissions(response.data)
      }
    }

    getSelectedMenus();
    getPermissions()
  }, []);

  const renderContent = () => {
    return (
      <>
        <FormItem name={['menu', 'name']} label="名称" rules={[{ required: true, message: '请输入名称！' }]}>
          <Input placeholder="请输入名称！" />
        </FormItem>
        <FormItem label="图标描述" name={['menu', 'icon']}>
          <Input placeholder="请输入图标描述！" />
        </FormItem>
        <FormItem name={['menu', 'path']} label="路径" rules={[{ required: true, message: '请输入路径！' }]}>
          <Input placeholder="请输入路径！" />
        </FormItem>

        <FormItem  label="权限" name="permissionId">
          <Select allowClear placeholder="请选择权限！" style={{ width: '100%' }}>
            {permissions.map((menu: TableListItem) => (
              <Option key={menu._id} value={menu._id}>
                {menu.name}
              </Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label="父类菜单" name={['menu', 'idParent']}>
          <Select allowClear placeholder="请选择父类菜单！" style={{ width: '100%' }}>
            {menus.map((menu: TableListItem) => (
              <Option key={menu.idMenu} value={menu.idMenu}>
                {menu.name}
              </Option>
            ))}
          </Select>
        </FormItem>

        <FormItem  name={['menu', 'idMenu']}  label={false}>
          <Input type="hidden" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改菜单"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={formVals}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
