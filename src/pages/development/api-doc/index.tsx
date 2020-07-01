import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin } from 'antd';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default () => {
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <SwaggerUI url="https://splice.passgpa.com/v2/api-docs" />
      </Card>
    </PageHeaderWrapper>
  );
};
