import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { Order } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { SERVER_URL } from '@/lib/constants'

const PurchaseReceiptEmail = ({ order } : { order: Order }) => {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head/>
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Order ID
                  </Text>
                  <Text className='mt-0 mr-4'>{order.id}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Purchase Date
                  </Text>
                  <Text className='mt-0 mr-4'>{formatDateTime(order.createdAt).dateTime}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Price Paid
                  </Text>
                  <Text className='mt-0 mr-4'>{formatCurrency(order.totalPrice)}</Text>
                </Column>
              </Row>
            </Section>
            <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
              { order.orderItems.map((item) => (
                <Row key={item.productId} className='mt-8'>
                  <Column className='w-20'>
                    <Img
                      width={80}
                      alt={item.name}
                      className='rounded'
                      src={item.image.startsWith('/') ? `${SERVER_URL}${item.image}` : item.image}
                    />
                  </Column>
                  <Column className='align-top'>
                    {item.name} x {item.qty}
                  </Column>
                  <Column align='right' className='align-top'>
                    { formatCurrency(item.price) }
                  </Column>
                </Row>
              ))}
              {[
                {
                  name: 'Items', price: order.itemsPrice
                },
                {
                  name: 'Tax', price: order.taxPrice
                },
                {
                  name: 'Shipping', price: order.shippingPrice
                },
                {
                  name: 'Total', price: order.totalPrice
                }
              ].map(({ name, price }) => (
                <Row key={name} className='py-1'>
                  <Column align='right'>
                    {name}:{' '}
                  </Column>
                  <Column align='right' className='align-top' width={70}>
                    <Text className='m-0'>
                      {formatCurrency(price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default PurchaseReceiptEmail