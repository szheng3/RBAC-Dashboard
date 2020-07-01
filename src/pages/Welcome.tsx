import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';

// const CodePreview: React.FC<{}> = ({ children }) => (
//   <pre className={styles.pre}>
//     <code>
//       <Typography.Text copyable>{children}</Typography.Text>
//     </code>
//   </pre>
// );

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="Welcome to Shuai's Resume"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />

    </Card>

  </PageHeaderWrapper>
);
