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

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    idRoles: props?.values?.roles?.idRoles,
    name: props?.values?.roles?.name,
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

    handleUpdate(fieldsValue);
  };

  const renderContent = () => (
    <>
      <FormItem
        name="idRoles"
        label="标识符"
        rules={[{ required: true, message: '请输入英文名称！' }]}
      >
        <Input disabled placeholder="请输入英文名称！" />
      </FormItem>
      <FormItem name="name" label="名称" rules={[{ required: true, message: '请输入中文标识！' }]}>
        <Input placeholder="请输入中文标识！" />
      </FormItem>
    </>
  );

  const renderFooter = () => (
    <>
      <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
      <Button type="primary" onClick={() => handleNext()}>
        保存
      </Button>
    </>
  );

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改角色"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          idRoles: formVals.idRoles,
          name: formVals.name,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
