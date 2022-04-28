import { CategorySelect } from '@/components/common'
import { queryCategoryList } from '@/services/ant-design-pro/category'
import { Form } from 'antd'
import { useRequest } from 'umi'

const ArticleCategorySelect = () => {
  const { data, loading, refresh } = useRequest(() => queryCategoryList())

  return (
    <Form.Item
      name='categoryId'
      rules={[
        {
          message: '请选择选择一个分类',
          required: true,
        },
      ]}
    >
      <CategorySelect data={data} loading={loading} onRefresh={refresh} />
    </Form.Item>
  )
}

export default ArticleCategorySelect
