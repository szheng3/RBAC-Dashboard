import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Spin, Checkbox, Divider } from 'antd';

import { queryPermissions } from '@/pages/admin/permissions/list/service';
import groupBy from 'lodash/groupBy';
import { keys } from 'lodash';
import { TableListItem as PermissionData } from '../../../permissions/list/data.d';
import { PermissionFormParams, TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: PermissionFormParams) => void;
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

const PermissionForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    name: props.values.name,
    nameCn: props.values.nameCn,
  });

  const [permissions, setPermissions] = useState<PermissionData[]>([]);

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [defaultPermissions] = useState(props.values.permissions || []);
  const [permissionIds, setPermissionIds] = useState<string[]>(
    defaultPermissions.map((permission) => permission.id),
  );

  useEffect(() => {
    setLoading(true);

    async function getPermissions() {
      if (loading) {
        return;
      }
      const { data } = await queryPermissions();
      if (data) {
        setPermissions(data);
        setLoading(false);
      }
      setLoading(false);
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

    const fields = fieldsValue as PermissionFormParams;

    handleUpdate({ ...fields, permissionIds });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, id: value } = e.target;

    if (checked && permissionIds.every((id) => id !== value)) {
      setPermissionIds([...permissionIds, value]);
    } else {
      setPermissionIds(permissionIds.filter((id) => id !== value));
    }
  };

  const renderContent = () => {
    const permissionsByGroup = groupBy(
      permissions,
      (permission: PermissionData) => permission.name.split(' ').slice()[0],
    );

    return (
      <Spin spinning={loading}>
        {keys(permissionsByGroup).map((name) => (
          <div key={name}>
            <Divider orientation="left" plain>
              {name}
            </Divider>
            <Row>
              {permissionsByGroup[name].map((permission) => (
                <Col key={permission.id} span={8}>
                  <Checkbox
                    defaultChecked={!!defaultPermissions.find((p) => p.id === permission.id)}
                    onChange={handleCheckboxChange}
                    type="checkbox"
                    id={permission.id}
                  >
                    {permission.name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
            <br />
          </div>
        ))}
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
      title="分配权限"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: formVals.id,
          name: formVals.name,
          nameCn: formVals.nameCn,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default PermissionForm;
