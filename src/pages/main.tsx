import { useState } from 'react'
import { Button, message, Steps } from 'antd'
import { Step1 } from './step1'
import { FormBuilder } from './testForm'
import { Step3 } from './step3'

const steps = [
  {
    title: 'Выбор респондентов',
    description: '',
    content: <Step1 />,
  },
  {
    title: 'Анкета',
    description: 'Создайте анкету',
    content: <FormBuilder />,
  },
  {
    title: 'Приглашение',
    description: 'Пригласите респондентов',
    content: <Step3 />,
  },
] as const

export const MainPage = () => {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const items = steps.map((item, key) => ({
    key,
    title: item.title,
    description: item.description,
  }))

  return (
    <>
      <Steps current={current} items={items} onChange={(v) => setCurrent(v)} />
      <div style={{ marginBottom: 10 }}>
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Назад
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type='primary' onClick={() => next()}>
            Вперед
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type='primary'
            onClick={() => {
              message.success('Processing complete!')
            }}
          >
            Отправить
          </Button>
        )}
      </div>
      <div>{steps[current].content}</div>
    </>
  )
}
