import { articleOrigins } from '@/constants/article/origin'
import { articleOpens } from '@/constants/article/public'
import { publishStates } from '@/constants/publish'
import type { ArticleSearchRequest } from '@/services/ant-design-pro/article'
import { queryCategoryList } from '@/services/ant-design-pro/category'
import { queryTagList } from '@/services/ant-design-pro/tag'
import compose from '@/utils/compose'
import ProCard from '@ant-design/pro-card'
import { ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-form'
import { Space } from 'antd'
import { omitBy } from 'lodash'

const SELECT_ALL_VALUE = -101

const buildOptions = (data: any[]) =>
  data.map((item) => ({
    value: item.id,
    label: (
      <Space>
        {item.icon}
        {item.name}
      </Space>
    ),
  }))

type ArticleQueryProps = {
  onFinish: (values: ArticleSearchRequest) => void
}

const initialValues: ArticleSearchRequest = {
  name: '',
  publish: SELECT_ALL_VALUE,
  open: SELECT_ALL_VALUE,
  origin: SELECT_ALL_VALUE,
  tag: SELECT_ALL_VALUE,
  category: SELECT_ALL_VALUE,
}

const resolve = () => Promise.resolve(true)

const ArticleQuery = ({ onFinish }: ArticleQueryProps) => {
  return (
    <ProCard style={{ marginBottom: 24 }}>
      <QueryFilter<ArticleSearchRequest>
        initialValues={initialValues}
        style={{ marginBottom: -24 }}
        defaultCollapsed={false}
        onFinish={(values) => {
          return compose(resolve, onFinish, omitBy)(values, (v: any) => v === SELECT_ALL_VALUE)
        }}
        onReset={() => onFinish(initialValues)}
      >
        <ProFormText name='name' label='应用名称' />
        <ProFormSelect
          name='publish'
          label='发布状态'
          options={[
            {
              label: '全部状态',
              value: SELECT_ALL_VALUE,
            },
            ...buildOptions(publishStates),
          ]}
        />
        <ProFormSelect
          name='open'
          label='公开状态'
          options={[{ label: '全部可见', value: SELECT_ALL_VALUE }, ...buildOptions(articleOpens)]}
        />
        <ProFormSelect
          name='origin'
          label='来源状态'
          options={[
            { label: '全部来源', value: SELECT_ALL_VALUE },
            ...buildOptions(articleOrigins),
          ]}
        />
        <ProFormSelect
          name='tag'
          label='标签'
          request={() =>
            queryTagList()
              .then(({ data }) => {
                return data.map((item) => ({ label: item.name, value: item.id }))
              })
              .then((data) => {
                return [{ label: '全部标签', value: SELECT_ALL_VALUE }, ...data]
              })
          }
        />
        <ProFormSelect
          name='category'
          label='分类'
          request={() =>
            queryCategoryList()
              .then(({ data }) => {
                return data.map((item) => ({ label: item.name, value: item.id }))
              })
              .then((data) => {
                return [{ label: '全部分类', value: SELECT_ALL_VALUE }, ...data]
              })
          }
        />
      </QueryFilter>
    </ProCard>
  )
}

export default ArticleQuery