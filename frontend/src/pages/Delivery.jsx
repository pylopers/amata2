import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const DeliveryReturns = () => {
  return (
    <div className='ml-4 mr-4'>

      {/* Page Header */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'DELIVERY'} text2={'& RETURNS'} />
      </div>

      {/* Delivery Section */}
      <div className='my-10 flex flex-col gap-6 text-gray-600'>
        <h2 className='text-xl font-semibold'>Delivery Information</h2>
        <p>
          At AMATA, each sofa is handcrafted to order. Once you place an order, our production team
          begins crafting your piece immediately. Typical production time is 2–3 weeks, after which
          we schedule delivery.
        </p>
        <p>
          We offer white-glove delivery on all sofa orders within mainland regions. Our delivery
          partners will bring your sofa into your home, assemble it in the room of your choice, and
          remove all packaging materials. Please ensure there is clear access to the delivery
          location (no tight stairwells or obstructed hallways).
        </p>
        <p>
          Standard delivery windows are Monday through Friday, 9 AM–5 PM. Once your sofa is ready
          to ship, we will email you a tracking number and call you to confirm a two-hour time window
          for drop-off. If you need to reschedule, please let us know at least 48 hours before the
          scheduled delivery date.
        </p>
        <p>
          For remote or hard-to-reach areas, additional delivery fees may apply. If you live outside
          our standard coverage zone, we will notify you of any extra charges before processing your
          order.
        </p>
      </div>

      {/* Returns & Refunds Section */}
      <div className='my-10 flex flex-col gap-6 text-gray-600'>
        <h2 className='text-xl font-semibold'>Returns &amp; Refunds Policy</h2>
        <p>
          We take pride in the quality and craftsmanship of our sofas. If you’re not completely
          satisfied, please contact our Customer Service team within 7 days of delivery to initiate
          a return or refund.
        </p>
        <p>
          To be eligible for a return, the sofa must be in its original condition—unused, unassembled,
          and free of any stains or damage. Please retain all original packaging materials. Once we
          receive your request, we will send a return authorization (RA) and arrange for pickup.
        </p>
        <p>
          Return shipping and pickup fees are the customer’s responsibility unless the item arrived
          damaged or defective. In those cases, we will cover all return shipping costs and process
          a full refund.
        </p>
        <p>
          Refunds are processed within 5–7 business days after we receive and inspect the returned
          sofa. Refunds will be issued to the original payment method. Please allow your bank or
          card issuer additional time to reflect the credit.
        </p>
        <p>
          Custom or made-to-order sofas (e.g., special fabrics, custom dimensions) are final sale
          and not eligible for return or refund, unless there is a manufacturing defect.
        </p>
        <p>
          If you need to exchange or return, email us at{' '}
          <a href="mailto:support@amata-sofas.com" className='text-blue-600 underline'>
            support@amata-sofas.com
          </a>{' '}
          with your order number and photos (if applicable). One of our representatives will guide
          you through the next steps.
        </p>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default DeliveryReturns
