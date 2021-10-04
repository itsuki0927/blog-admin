import { querySystemConfig, saveSystemConfig } from '@/services/ant-design-pro/config'
import type { API } from '@/services/ant-design-pro/typings'
import { CheckOutlined, HeartOutlined } from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { Col, Form, message, Row, Spin } from 'antd'
import { useRequest } from 'umi'

const BasicView = () => {
  const { data, loading } = useRequest(() =>
    querySystemConfig().then((temp) => {
      temp.keywords = temp.keywords?.split(',').filter(Boolean) as any
      temp.ipBlackList = temp.ipBlackList?.split(',').filter(Boolean) as any
      temp.emailBlackList = temp.emailBlackList?.split(',').filter(Boolean) as any
      temp.keywordBlackList = temp.keywordBlackList?.split(',').filter(Boolean) as any
      return { data: temp }
    })
  )

  if (loading) {
    return (
      <ProCard>
        <Spin />
      </ProCard>
    )
  }

  return (
    <ProForm
      initialValues={data as any}
      submitter={{
        searchConfig: {
          submitText: '保存',
        },
        submitButtonProps: {
          icon: <CheckOutlined />,
        },
        render: (_, dom) => (
          <Row>
            <Col push={4}>{dom.pop()}</Col>
          </Row>
        ),
      }}
      labelCol={{ span: 4 }}
      layout='horizontal'
      onFinish={(values) => {
        return saveSystemConfig({ ...data, ...values } as API.SystemConfig).then(() => {
          message.success('保存成功')
          return true
        })
      }}
    >
      <Form.Item label={<HeartOutlined />}>{data?.liking || '-'} 次</Form.Item>
      <ProFormText
        width='lg'
        label='站点标题'
        name='title'
        rules={[{ required: true, message: '请输入站点标题' }]}
      />
      <ProFormText
        width='lg'
        label='副标题'
        name='subtitle'
        rules={[{ required: true, message: '请输入副标题' }]}
      />
      <ProFormTextArea
        width='lg'
        label='站点描述'
        name='description'
        rules={[{ required: true, message: '请输入站点描述' }]}
      />
      <ProFormSelect
        width='lg'
        mode='tags'
        label='关键词'
        name='keywords'
        transform={(value) => ({ keywords: value.join(',') })}
        rules={[{ required: true, message: '请输入关键词' }]}
      />
      <ProFormText
        width='lg'
        label='站点地址'
        name='domain'
        rules={[{ required: true, message: '请输入站点地址' }]}
      />
      <ProFormText
        width='lg'
        label='站点邮箱'
        name='email'
        rules={[{ required: true, message: '请输入站点邮箱' }]}
      />
      <ProFormText width='lg' label='ICP 备案号' name='record' />
      <ProFormSelect
        width='lg'
        mode='tags'
        label='IP 黑名单'
        name='ipBlackList'
        transform={(value) => ({ ipBlackList: value.join(',') })}
      />
      <ProFormSelect
        width='lg'
        mode='tags'
        label='邮箱 黑名单'
        name='emailBlackList'
        transform={(value) => ({ emailBlackList: value.join(',') })}
      />
      <ProFormSelect
        width='lg'
        mode='tags'
        label='关键字 黑名单'
        name='keywordBlackList'
        transform={(value) => ({ keywordBlackList: value.join(',') })}
      />
    </ProForm>
  )
}
export default BasicView