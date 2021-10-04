import { deleteArticle, queryArticleById, updateArticle } from '@/services/ant-design-pro/article'
import { CommentOutlined, DeleteOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { Badge, Button, message, Modal, Space } from 'antd'
import { history, useParams, useRequest } from 'umi'
import ArticleDetail from './components/ArticleDetail'

const EditArticle = () => {
  const { id } = useParams<{ id: string }>()
  const { loading, data } = useRequest(() =>
    queryArticleById(+id).then((result) => {
      // eslint-disable-next-line no-param-reassign
      result.keywords = result.keywords?.split('、') as any
      // eslint-disable-next-line no-param-reassign
      result.tagIds = result.tags?.map((v) => v.id)
      // eslint-disable-next-line no-param-reassign
      result.categoryIds = result.categories?.map((v) => v.id)
      return { data: result }
    })
  )

  const handleRemove = () => {
    Modal.confirm({
      title: `你确定要删除《${data?.title}》嘛?`,
      content: '此操作不能撤销!!!',
      onOk() {
        deleteArticle(+id).then(() => {
          message.success('删除成功')
          history.replace('/article/list')
        })
      },
    })
  }

  return (
    <PageContainer
      loading={loading}
      extra={
        <Space>
          <Button
            danger
            type='dashed'
            size='small'
            onClick={handleRemove}
            icon={<DeleteOutlined />}
          >
            删除文章
          </Button>
          <Badge count={data?.commenting}>
            <Button size='small' icon={<CommentOutlined />}>
              文章评论
            </Button>
          </Badge>
          <Button.Group>
            <Button size='small' disabled icon={<LikeOutlined />}>
              {data?.liking}喜欢
            </Button>
            <Button size='small' disabled icon={<EyeOutlined />}>
              {data?.reading}阅读
            </Button>
          </Button.Group>
        </Space>
      }
    >
      <ArticleDetail
        initialValues={data as any}
        onFinish={(values) => {
          return updateArticle({ ...data, ...values }).then(() => {
            message.success('更新成功')
            return true
          })
        }}
      />
    </PageContainer>
  )
}

export default EditArticle