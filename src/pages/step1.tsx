import { Alert, Divider, Table, Typography, type TableColumnsType } from 'antd'
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
  axios.get<Data[]>(`${import.meta.env.VITE_BASE_URL}/respondents/all`)

const labelMapping = {
  gender: 'Пол',
  name: 'Имя',
  age: 'Возраст',
  city: 'Город',
  education: 'Образование',
  education_two: 'Дополнительное образование',
  occupation: 'Занятость',
  unemployed: 'Причина',
  period: 'Период',
  student: 'Статус',
  student_job: 'Подработка',
  self_employed: 'Тип предпринимательской деятельности',
  employment: 'Должность',
  freelance_employment: 'Специализация',
  freelance_work: 'Область',
  field_work: 'Сфера деятельности',
  income: 'Уровень дохода',
  job_device: 'Устройство для работы',
  leisure_device: 'Устройство для контента',
  research: 'Участие в исследованиях',
  platform: 'Удобная платформа для связи',
  time: 'Удобное время для связи',
}

export const Step1 = () => {
  // const [selectedRows, setSelectedRows] = useState<Data[]>([])

  const { respondents: selectedRowKeys, setRespondents } = useQuestionContext()

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

  const filters =
    respondents?.data.reduce((acc, respondent) => {
      Object.entries(respondent).forEach(([key, value]) => {
        if (!acc[key]) {
          acc[key] = [value]
          return
        }

        acc[key].push(value)
      })

      return acc
    }, {} as Record<string, string[]>) ?? {}

  const columns: TableColumnsType<Data> = Object.keys(
    respondents?.data?.[0] ?? {},
  )
    .filter((f) => !hiddenfields.has(f))
    .map((key) => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      title: labelMapping[key] ?? key,
      dataIndex: key,
      key: key,
      filters:
        [...new Set(filters[key])].map((v) => ({
          text: v,
          value: v,
        })) ?? [],
      onFilter: (value, record) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        (record[key] as string).includes(value as string),
      render:
        key === 'age'
          ? (text: string) => (
              <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
            )
          : undefined,
    }))

  const data = (respondents?.data ?? []).map((respondent) => ({
    key: respondent._id,
    ...respondent,
  }))

  return (
    <div style={{ overflowY: 'scroll' }}>
      <Typography.Text>Выбрано: {selectedRowKeys.length}</Typography.Text>
      <Table<Data>
        size='small'
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setRespondents(selectedRowKeys as string[])
          },
        }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ position: ['topLeft', 'bottomRight'] }}
      />
      <Divider />
    </div>
  )
}
