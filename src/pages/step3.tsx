import { Form, Input } from 'antd'
import { useQuestionContext } from '../questionContext'

export const Step3 = () => {
  const [form] = Form.useForm()

  const { setResearchDescrition, researchDescrition } = useQuestionContext()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Form
        form={form}
        name='control-hooks'
        style={{ flex: 0.5 }}
        layout='vertical'
        onFieldsChange={() => {
          setResearchDescrition(form.getFieldsValue())
        }}
        initialValues={researchDescrition}
      >
        <Form.Item name='research_name' label='Название исследования'>
          <Input.TextArea placeholder='Интервью пользователей приложения для прослушивания музыки' />
        </Form.Item>
        <Form.Item name='date' label='Дата проведения'>
          <Input placeholder='С 01.05 до 06.05' />
        </Form.Item>
        <Form.Item name='payment' label='Оплата'>
          <Input placeholder='1800 рублей на карту' />
        </Form.Item>
        <Form.Item name='description' label='Описание'>
          <Input.TextArea placeholder='Вы являетесь активным пользователем приложения для прослушивания музыки и имеете платную подписку' />
        </Form.Item>
        <Form.Item name='format' label='Формат'>
          <Input placeholder='Zoom/Google Meet/Telegram/Телемост' />
        </Form.Item>
        <Form.Item name='duration' label='Продолжительность'>
          <Input placeholder='90 минут' />
        </Form.Item>

        {/* <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button htmlType='button' onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item> */}
      </Form>
    </div>
  )
}
