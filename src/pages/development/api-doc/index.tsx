import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Card } from 'antd';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { get } from '@/utils/StorageUtil';

export default () => {
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <SwaggerUI
          url="https://splice.passgpa.com/v2/api-docs"
          requestInterceptor={(req) => {
            req.headers.Authorization = `Bearer ${get('sso')}`;
            return req;
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};
