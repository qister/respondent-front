import { Alert, Divider, Table, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useQuestionContext } from '../questionContext'

export interface Data {
  _id: string
  to_send: string
  user_id: string
  username: string
  gender: string
  name: string
  age: string
  city: string
  education: string
  education_two: string
  occupation: string
  unemployed: string
  period: string
  student: string
  student_job: string
  self_employed: string
  employment: string
  freelance_employment: string
  freelance_work: string
  field_work: string
  income: string
  job_device: string
  leisure_device: string
  research: string
  platform: string
  time: string
  privacy: string
  answers: Answers
}

interface Answers {
  выбор: string
}

const getRespondents = () =>
  axios.get<Data[]>('http://localhost:3000/respondents/all')

export const Step1 = () => {
  // const [selectedRows, setSelectedRows] = useState<Data[]>([])

  const {respondents: selectedRowKeys, setRespondents} = useQuestionContext()

  // useEffect(() => {
  //   const keys = selectedRows.map((row) => row._id)
  //   setRespondents(keys)
  // }, [selectedRows, setRespondents])

  const {
    data: respondents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['respondents', '123'],
    queryFn: getRespondents,
  })

  if (isError) {
    console.error('Error fetching respondents:', error)
    return (
      <Alert
        message='Ошибка'
        description={JSON.stringify(error)}
        type='error'
        showIcon
      />
    )
  }

  const hiddenfields = new Set([
    // 'answers',
    // '__v',
    '_id',
    // 'to_send',
    // 'user_id',
    // 'username',
    // 'name',
    // 'privacy',
  ])

  const columns = Object.keys(respondents?.data?.[0] ?? {})
    .filter((f) => !hiddenfields.has(f))
    .map((key) => ({
      title: key,
      dataIndex: key,
      key: key,
    }))

  const data = (respondents?.data ?? []).map((respondent) => ({
    key: respondent._id,
    ...respondent,
  }))

  return (
    <div style={{ overflowY: 'scroll' }}>
      <Divider />
      <Table<Data>
        size='small'
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setRespondents(selectedRowKeys as string[])
          },
        }}
        columns={columns.map((column) => ({
          ...column,
          render:
            column.dataIndex === 'age'
              ? (text: string) => (
                  <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
                )
              : undefined,
        }))}
        dataSource={data}
        loading={isLoading}
      />
      <Divider />
      <Typography.Text>Выбрано: {selectedRowKeys.length}</Typography.Text>
    </div>
  )
}
