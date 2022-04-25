import ProCard from '@ant-design/pro-card'
import { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { Form } from 'antd'
import ArticleTagSelect from './ArticleTagSelect'

const ArticleBasic = () => {
  return (
    <ProCard>
      <ProFormText
        rules={[{ required: true, message: '请输入文章标题' }]}
        name='title'
        label='文章标题'
        tooltip='最长为 24 位'
        placeholder='请输入文章标题'
      />
      <ProFormText
        rules={[{ required: true, message: '请输入文章路径' }]}
        name='path'
        label='文章路径'
        placeholder='请输入文章路径'
      />
      <ProFormTextArea
        rules={[{ required: true, message: '请输入文章描述' }]}
        name='description'
        label='文章描述'
        placeholder='请输入文章描述'
      />
      <ProFormSelect
        rules={[{ required: true, message: '请输入文章关键字' }]}
        transform={(value) => ({ keywords: value.join('、') })}
        name='keywords'
        label='关键字'
        mode='tags'
      />
      <Form.Item
        name='tagIds'
        label='标签'
        rules={[{ required: true, message: '至少选择一个标签' }]}
      >
        <ArticleTagSelect />
      </Form.Item>
    </ProCard>
  )
}

export default ArticleBasic
