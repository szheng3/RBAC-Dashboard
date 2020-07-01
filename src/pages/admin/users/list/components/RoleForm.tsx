import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Row, Col, Spin, Checkbox } from 'antd';

import { queryRoles } from '@/pages/admin/roles/list/service';
import { TableListItem, RoleFormParams } from '../data.d';
import { TableListItem as RoleData } from '../../../roles/list/data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: RoleFormParams) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const RoleForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    username: props.values.username,
    password: props.values.password,
  });

  const [roles, setRoles] = useState<RoleData[]>([]);

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [defaultRoles] = useState(props.values.roles || []);
  const [roleIds, setRoleIds] = useState<string[]>(defaultRoles.map((role) => role.id));

  useEffect(() => {
    setLoading(true);
    async function getPermissions() {
      if (loading) {
        return;
      }
      const { data } = await queryRoles();
      if (data) {
        setRoles(data);
        setLoading(false);
      }
    }
    getPermissions();
  }, []);

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

    const fields = fieldsValue as RoleFormParams;

    handleUpdate({ ...fields, roleIds });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, id: value } = e.target;

    if (checked && roleIds.every((id) => id !== value)) {
      setRoleIds([...roleIds, value]);
    } else {
      setRoleIds(roleIds.filter((id) => id !== value));
    }
  };

  const renderContent = () => {
    // if (loading) {
    //   return <Spin/>;
    // }

    return (
      <Spin spinning={loading}>
        <Row>
          {roles.map((role) => (
            <Col key={role?.id} span={8}>
              <Checkbox
                defaultChecked={!!defaultRoles.find((p) => p.id === role.id)}
                onChange={handleCheckboxChange}
                type="checkbox"
                id={role?.id}
              >
                {role?.roles?.name}
              </Checkbox>
            </Col>
          ))}
        </Row>

        <FormItem name="id" label={false}>
          <Input type="hidden" />
        </FormItem>
      </Spin>
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
      title="分配角色"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form} initialValues={formVals}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default RoleForm;
