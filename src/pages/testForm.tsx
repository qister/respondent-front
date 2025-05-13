import React, { useState } from 'react'
import { Button, Card, Checkbox, Input, Radio, Select, Typography } from 'antd'
import { useQuestionContext } from '../questionContext'

const { Title, Text } = Typography

const QuestionType = {
  TEXT: 'text',
  SINGLE: 'single',
  MULTI: 'multi',
} as const

type QuestionType = 'text' | 'single' | 'multi'

export interface Question {
  id: number
  text: string
  type: QuestionType
  options: string[]
}

interface Answers {
  [key: number]: string | string[]
}

const isType = (value: string): value is QuestionType => {
  return (
    value === QuestionType.TEXT ||
    value === QuestionType.SINGLE ||
    value === QuestionType.MULTI
  )
}

const RenderForm = ({
  questions,
  setFormMode,
}: {
  questions: Question[]
  setFormMode: (arg: boolean) => void
}) => {
  const [answers, setAnswers] = useState<Answers>({})

  const handleChange = (qid: number, value: string) => {
    setAnswers({ ...answers, [qid]: value })
  }

  const handleMultiChange = (qid: number, value: string) => {
    const current = answers[qid] as string[] | undefined
    if (current && current.includes(value)) {
      setAnswers({ ...answers, [qid]: current.filter((v) => v !== value) })
    } else {
      setAnswers({ ...answers, [qid]: [...(current ?? []), value] })
    }
  }

  const handleSubmit = () => {
    console.log('Ответы:', answers)
  }

  return (
    <div>
      <Title>Форма</Title>
      {questions.map((q) => (
        <Card key={q.id} style={{ marginBottom: 10 }}>
          <Text>{q.text}</Text>
          <div>
            {q.type === QuestionType.TEXT && (
              <Input
                type='text'
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
            {
              q.type === QuestionType.SINGLE && (
                <Radio.Group
                  options={q.options.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  onChange={(e) => handleChange(q.id, e.target.value)} // в целом для создания вопросов onChange не нужен
                  // value={answers[q.id] as string}
                />
              )
              // q.options.map((opt, idx) => (
              //   <div key={idx}>
              //     <Checkbox
              //       type='radio'
              //       name={`single-${q.id}`}
              //       value={opt}
              //       onChange={(e) => handleChange(q.id, e.target.value)}
              //     >
              //       {opt}
              //     </Checkbox>
              //   </div>
              // ))
            }
            {
              q.type === QuestionType.MULTI && (
                <Checkbox.Group
                  options={q.options.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  defaultValue={['Apple']}
                  onChange={(v) => handleMultiChange(q.id, v[0] as string)} // тут вопросик
                />
              )
              // q.options.map((opt, idx) => (
              //   <div key={idx}>

              //     <label>
              //       <input
              //         type='checkbox'
              //         value={opt}
              //         onChange={() => handleMultiChange(q.id, opt)}
              //       />
              //       {opt}
              //     </label>
              //   </div>
              // ))
            }
          </div>
        </Card>
      ))}
      <Button onClick={handleSubmit}>Отправить</Button>
      <Button onClick={() => setFormMode(false)}>Назад</Button>
    </div>
  )
}

const RenderBuilder = ({
  questions,
  addQuestion,
  updateQuestion,
  updateOption,
  addOption,
  removeQuestion,
  setFormMode,
}: {
  questions: Question[]
  addQuestion: () => void
  updateQuestion: ({
    id,
    field,
    value,
  }: {
    id: number
    field: keyof Question
    value: string
  }) => void
  updateOption: ({
    id,
    index,
    value,
  }: {
    id: number
    index: number
    value: string
  }) => void
  addOption: (qid: number) => void
  removeQuestion: (id: number) => void
  setFormMode: (arg: boolean) => void
}) => (
  <div>
    <Title level={2}>Создайте анкету, добавляя вопросы</Title>
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {questions.map((q) => (
        <Card key={q.id} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Input
                type='text'
                placeholder='Введите текст вопроса'
                value={q.text}
                onChange={(e) =>
                  updateQuestion({
                    id: q.id,
                    field: 'text',
                    value: e.target.value,
                  })
                }
              />
              <Select
                value={q.type}
                onChange={(type) =>
                  updateQuestion({
                    id: q.id,
                    field: 'type',
                    value: type,
                  })
                }
                options={[
                  { label: 'Свободный ответ', value: QuestionType.TEXT },
                  { label: 'Один вариант', value: QuestionType.SINGLE },
                  { label: 'Множественный выбор', value: QuestionType.MULTI },
                ]}
              />
            </div>

            {(q.type === QuestionType.SINGLE ||
              q.type === QuestionType.MULTI) && (
              <div
                style={{ display: 'flex', gap: 10, flexDirection: 'column' }}
              >
                <Text>Варианты ответа:</Text>
                {q.options.map((opt, idx) => (
                  <Input
                    key={idx}
                    type='text'
                    value={opt}
                    placeholder={`Вариант ${idx + 1}`}
                    onChange={(e) =>
                      updateOption({
                        id: q.id,
                        index: idx,
                        value: e.target.value,
                      })
                    }
                  />
                ))}
                <Button onClick={() => addOption(q.id)}>
                  Добавить вариант
                </Button>
              </div>
            )}

            <Button onClick={() => removeQuestion(q.id)} danger>
              Удалить вопрос
            </Button>
          </div>
        </Card>
      ))}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button onClick={addQuestion}>Добавить вопрос</Button>
        <Button onClick={() => setFormMode(true)}>Предпросмотр</Button>
      </div>
    </div>
  </div>
)

export const FormBuilder: React.FC = () => {
  // const [questions, setQuestions] = useState<Question[]>([])
  const {questions, setQuestions} = useQuestionContext()
  const [formMode, setFormMode] = useState<boolean>(false)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        type: QuestionType.TEXT,
        options: [''],
      },
    ])
  }

  const updateQuestion = ({
    id,
    field,
    value,
  }: {
    id: number
    field: keyof Question
    value: string
  }) => {
    const newQuestion = questions.find((q) => q.id === id)
    if (newQuestion && field === 'type' && isType(value)) {
      const oldType = newQuestion.type
      const newType = value as QuestionType

      if (
        ((oldType === 'multi' || oldType === 'single') && newType === 'text') ||
        ((newType === 'multi' || newType === 'single') && oldType === 'text')
      ) {
        newQuestion.options = ['']
      }
      newQuestion.type = value
      setQuestions(questions.map((q) => (q.id === id ? newQuestion : q)))

      return
    }

    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    )
  }

  const updateOption = ({
    id,
    index,
    value,
  }: {
    id: number
    index: number
    value: string
  }) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== id) return q
        const newOptions = [...q.options]
        newOptions[index] = value
        return { ...q, options: newOptions }
      }),
    )
  }

  const addOption = (qid: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, ''] } : q,
      ),
    )
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div style={{ padding: 20 }}>
      {formMode ? (
        <RenderForm questions={questions} setFormMode={setFormMode} />
      ) : (
        <RenderBuilder
          questions={questions}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          updateOption={updateOption}
          addOption={addOption}
          removeQuestion={removeQuestion}
          setFormMode={setFormMode}
        />
      )}
    </div>
  )
}
