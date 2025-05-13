import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Question } from './pages/testForm'

const QuestionContext = createContext<{
  respondents: string[]
  setRespondents: (respondents: string[]) => void
  questions: Question[]
  setQuestions: (questions: Question[]) => void
  researchDescrition: Record<string, string>
  setResearchDescrition: (description: Record<string, string>) => void
}>({
  respondents: [],
  setRespondents: () => {},
  questions: [],
  setQuestions: () => {},
  researchDescrition: {},
  setResearchDescrition: () => {},
})

export const useQuestionContext = () => {
  const context = useContext(QuestionContext)
  if (!context) {
    throw new Error('useQuestionContext must be used within a QuestionProvider')
  }
  return context
}

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [respondents, setRespondents] = useState<string[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [researchDescrition, setResearchDescrition] = useState({})

  const value = {
    respondents,
    setRespondents,
    questions,
    setQuestions,
    researchDescrition,
    setResearchDescrition,
  }

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  )
}
