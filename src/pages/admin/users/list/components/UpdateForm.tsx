import React, { useState } from 'react';
import { Form, Button, Input, Modal } from 'antd';

import { TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;

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
    id: props.values.id,
    username: props.values.users.name,
    email: props.values.users.email,
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

    handleUpdate(fieldsValue,form);
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！', min: 4 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="email"
          label="Email"
          rules={[{ required: true, message: '请输入Emails！', min: 5 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="id" label={false}>
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
      title="修改员工"
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
