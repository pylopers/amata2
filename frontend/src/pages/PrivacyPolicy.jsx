import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const PrivacyPolicy = () => {
  return (
    <div className='ml-4 mr-4'>

      {/* Page Header */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>

      {/* Privacy Policy Content */}
      <div className='my-10 flex flex-col gap-6 text-gray-600'>
        <h2 className='text-xl font-semibold'>Introduction</h2>
        <p>
          At AMATA, we respect your privacy and are committed to protecting any personal information you share with us.
          This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
        </p>

        <h2 className='text-xl font-semibold'>Information We Collect</h2>
        <p>
          <strong>Personal Information:</strong> When you place an order, create an account, or contact customer support,
          we may collect information such as your name, email address, shipping address, phone number, and payment details.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect non-personal information automatically when you browse our site—this includes
          your IP address, browser type, pages viewed, time spent on pages, and referring URLs. We use cookies and similar
          tracking technologies to enhance your browsing experience and remember your preferences.
        </p>

        <h2 className='text-xl font-semibold'>How We Use Your Information</h2>
        <p>
          <strong>Order Processing:</strong> We use your personal information to process and fulfill your orders, arrange delivery,
          and send order confirmations or status updates.
        </p>
        <p>
          <strong>Account Management:</strong> If you create an account, we use your information to provide personalized experiences,
          allow you to track order history, and manage saved addresses.
        </p>
        <p>
          <strong>Marketing & Communications:</strong> With your consent, we may send promotional emails about new products, sales,
          or other updates. You can opt out of marketing communications at any time by clicking “unsubscribe” in any email or contacting us.
        </p>
        <p>
          <strong>Improving Our Services:</strong> We analyze usage data to understand site performance, troubleshoot technical issues,
          and make data-driven improvements to our website, products, and customer experience.
        </p>

        <h2 className='text-xl font-semibold'>Cookies & Tracking Technologies</h2>
        <p>
          We use cookies, web beacons, and similar technologies to collect usage data, remember your preferences, and provide personalized
          content. You can choose to disable cookies through your browser settings; however, certain features of our website may not function
          properly if cookies are turned off.
        </p>

        <h2 className='text-xl font-semibold'>Third-Party Services</h2>
        <p>
          We may share your information with trusted third-party partners who help us operate our business—such as payment processors, shipping
          providers, and marketing platforms. These partners have access to the data necessary to perform their functions but are not permitted
          to use it for other purposes.
        </p>
        <p>
          We also use analytics tools (e.g., Google Analytics) to measure site traffic and engagement. These services collect aggregated, non-personal
          information about your use of the site. For more details, refer to their respective privacy policies.
        </p>

        <h2 className='text-xl font-semibold'>Data Security</h2>
        <p>
          We implement industry-standard security measures (such as SSL encryption) to protect your personal information during transmission and storage.
          While we strive to safeguard your data, no method of electronic transmission or storage is 100% secure. In the event of a security breach,
          we will notify you and relevant authorities as required by law.
        </p>

        <h2 className='text-xl font-semibold'>Children’s Privacy</h2>
        <p>
          Our website is intended for users aged 18 and above. We do not knowingly collect personal information from minors. If you believe a child
          has provided us with their information, please contact us immediately so we can delete it from our records.
        </p>

        <h2 className='text-xl font-semibold'>Your Rights & Choices</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time. To do so, log in to your account or contact us at{' '}
          <a href="mailto:amatahome07@gmail.com" className='text-blue-600 underline'>
            amatahome07@gmail.com
          </a>
          . You may also opt out of marketing communications or request that we stop sharing your information with certain third parties.
        </p>

        <h2 className='text-xl font-semibold'>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page
          with a revised “Last Updated” date. We encourage you to review this policy regularly.
        </p>

        <h2 className='text-xl font-semibold'>Contact Us</h2>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Officer at{' '}
          <a href="mailto:amatahome07@gmail.com" className='text-blue-600 underline'>
            amatahome07@gmail.com
          </a>{' '}
          or call us at +91 89289 37345.
        </p>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default PrivacyPolicy
