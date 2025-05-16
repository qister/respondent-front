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

const isType = (value: string | string[]): value is QuestionType => {
  return (
    value === QuestionType.TEXT ||
    value === QuestionType.SINGLE ||
    value === QuestionType.MULTI
  )
}

const RenderForm = ({ questions }: { questions: Question[] }) => {
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

  return (
    <div>
      <Title level={2}>Анкета</Title>
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
            {q.type === QuestionType.SINGLE && (
              <Radio.Group
                options={q.options.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                onChange={(e) => handleChange(q.id, e.target.value)} // в целом для создания вопросов onChange не нужен
              />
            )}
            {q.type === QuestionType.MULTI && (
              <Checkbox.Group
                options={q.options.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                defaultValue={['Apple']}
                onChange={(v) => handleMultiChange(q.id, v[0] as string)} // тут вопросик
              />
            )}
          </div>
        </Card>
      ))}
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
    value: string | string[]
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
                  <div style={{ display: 'flex', gap: 10 }} key={idx}>
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
                    <Button
                      onClick={() =>
                        updateQuestion({
                          id: q.id,
                          field: 'options',
                          value: q.options.filter((_, i) => i !== idx),
                        })
                      }
                      danger
                    >
                      Удалить вариант
                    </Button>
                  </div>
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
      </div>
    </div>
  </div>
)

export const FormBuilder: React.FC = () => {
  const { questions, setQuestions } = useQuestionContext()

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
    value: string | string[]
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        padding: 20,
        gap: 20,
      }}
    >
      <RenderBuilder
        questions={questions}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        updateOption={updateOption}
        addOption={addOption}
        removeQuestion={removeQuestion}
      />

      <RenderForm questions={questions} />
    </div>
  )
}
