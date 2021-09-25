import { ao } from '@/constants/article/origin'
import { ap } from '@/constants/article/public'
import { ps, PublishState } from '@/constants/publish'
import type { ArticleSearchRequest } from '@/services/ant-design-pro/article'
import { patchArticle } from '@/services/ant-design-pro/article'
import { queryArticleList } from '@/services/ant-design-pro/article'
import type { API } from '@/services/ant-design-pro/typings'
import {
  CheckOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  HeartOutlined,
  LinkOutlined,
  RollbackOutlined,
  TagOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Button, Card, message, Space, Tag, Typography, Modal } from 'antd'
import { useRef, useState } from 'react'
import { history, Link } from 'umi'
import ArticleQuery from './Query'

const ArticleList = () => {
  const [query, setQuery] = useState<ArticleSearchRequest | undefined>()
  const actionRef = useRef<ActionType | undefined>()

  const handleStateChange = (ids: number[], state: PublishState) => {
    Modal.confirm({
      title: `确定要将 状态变更为 [${ps(state).name}] 状态嘛?`,
      content: '此操作不能撤销!!!',
      centered: true,
      onOk() {
        patchArticle({ ids, state }).then(() => {
          message.success('变更成功')
          actionRef.current?.reload()
        })
      },
    })
  }

  const columns: ProColumns<API.Article>[] = [
    { title: 'id', width: 40, dataIndex: 'id' },
    {
      title: '文章',
      width: 360,
      render: (_, { title, description, cover }) => {
        return (
          <Card
            size='small'
            bordered={false}
            bodyStyle={{
              minHeight: '100px',
              backdropFilter: 'blur(2px)',
            }}
            style={{
              margin: '1rem 0',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              minHeight: '100px',
              backgroundImage: `url(${cover})`,
              backgroundBlendMode: 'soft-light',
            }}
          >
            <Card.Meta
              title={
                <Typography.Title style={{ marginTop: '5px' }} level={5}>
                  {title}
                </Typography.Title>
              }
              description={
                <Typography.Paragraph
                  type='secondary'
                  style={{ marginBottom: '5px' }}
                  ellipsis={{ rows: 2, expandable: true }}
                >
                  {description}
                </Typography.Paragraph>
              }
            />
          </Card>
        )
      },
    },
    {
      title: '归类',
      width: 130,
      render: (_, { tags, categories }) => {
        return (
          <Space direction='vertical'>
            {categories?.map((category) => (
              <Space size='small' key={category.id}>
                <FolderOpenOutlined />
                {category.name}
              </Space>
            ))}
            <Space size='small' wrap={true}>
              {tags?.map((tag) => (
                <Tag icon={<TagOutlined />} key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </Space>
          </Space>
        )
      },
    },
    {
      title: '被关注',
      width: 150,
      render: (_, { reading, liking, commenting }) => {
        return (
          <Space direction='vertical'>
            <Space size='small'>
              <EyeOutlined />
              浏览 {reading} 次
            </Space>
            <Space size='small'>
              <HeartOutlined />
              喜欢 {liking} 次
            </Space>
            <Space size='small'>
              <CommentOutlined />
              评论 {commenting} 条
            </Space>
          </Space>
        )
      },
    },
    {
      title: '更新周期',
      width: 230,
      render: (_, { createAt, updateAt }) => {
        return (
          <Space direction='vertical'>
            <span>最早发布：{createAt}</span>
            <span>最后更新：{updateAt}</span>
          </Space>
        )
      },
    },
    {
      title: '状态',
      width: 120,
      render: (_, { publish: propPublish, open: propOpen, origin: propOrigin }) => {
        const publish = ps(propPublish!)
        const open = ap(propOpen!)
        const origin = ao(propOrigin!)
        return (
          <Space direction='vertical'>
            {[publish, open, origin].map((s) => (
              <Tag icon={s.icon} color={s.color} key={s.id}>
                {s.name}
              </Tag>
            ))}
          </Space>
        )
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 110,
      render: (_, article) => (
        <Space direction='vertical'>
          <Link to={`/article/edit/${article.id}`}>
            <Button size='small' type='text' block icon={<EditOutlined />}>
              文章详情
            </Button>
          </Link>
          {article.publish === PublishState.Draft && (
            <Button
              size='small'
              type='text'
              block
              icon={<CheckOutlined />}
              onClick={() => handleStateChange([article.id], PublishState.Published)}
            >
              <Typography.Text type='success'>直接发布</Typography.Text>
            </Button>
          )}
          {article.publish === PublishState.Published && (
            <Button
              size='small'
              type='text'
              block
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleStateChange([article.id], PublishState.Recycle)}
            >
              移回收站
            </Button>
          )}
          {article.publish === PublishState.Recycle && (
            <Button
              size='small'
              type='text'
              block
              icon={<RollbackOutlined />}
              onClick={() => handleStateChange([article.id], PublishState.Draft)}
            >
              <Typography.Text type='warning'>退至草稿</Typography.Text>
            </Button>
          )}
          <Button size='small' block type='link' target='_blank' icon={<LinkOutlined />}>
            宿主页面
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer>
      <ArticleQuery onFinish={(values) => setQuery(values)} />
      <ProTable
        actionRef={actionRef}
        headerTitle='文章列表'
        search={false}
        params={query}
        columns={columns}
        rowKey='id'
        request={(params, sort) => {
          return queryArticleList({ ...params, ...sort })
        }}
        toolBarRender={() => [
          <Button type='primary' onClick={() => history.push('/article/create')}>
            撰写文章
          </Button>,
        ]}
      />
    </PageContainer>
  )
}

export default ArticleList
