import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FiDollarSign,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Header */}
      <header className='container mx-auto px-6 py-8'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <FiDollarSign className='w-8 h-8 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-900'>LoanPro</h1>
          </div>
          <div className='space-x-4'>
            <Link href='/login'>
              <Button
                variant='ghost'
                className='text-gray-600 hover:text-blue-600'
              >
                Login
              </Button>
            </Link>
            <Link href='/register'>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-6 py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
            Your Dream Loan
            <span className='block text-blue-600'>Made Simple</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Fast, secure, and transparent loan processing. Get approved in
            minutes with competitive rates and flexible terms tailored to your
            needs.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link href='/register'>
              <Button
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold'
              >
                Apply for Loan
                <FiArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </Link>
            <Link href='/login'>
              <Button
                variant='outline'
                size='lg'
                className='border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:bg-gray-50'
              >
                Login to Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <CardContent className='p-8 text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiClock className='w-8 h-8 text-blue-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Quick Approval
              </h3>
              <p className='text-gray-600'>
                Get your loan approved in as little as 24 hours with our
                streamlined digital process.
              </p>
            </CardContent>
          </Card>

          <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <CardContent className='p-8 text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiShield className='w-8 h-8 text-green-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                100% Secure
              </h3>
              <p className='text-gray-600'>
                Your data is protected with bank-level security and encryption
                technology.
              </p>
            </CardContent>
          </Card>

          <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <CardContent className='p-8 text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiTrendingUp className='w-8 h-8 text-purple-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Best Rates
              </h3>
              <p className='text-gray-600'>
                Competitive interest rates starting from 3.99% APR with flexible
                repayment terms.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className='bg-white rounded-2xl shadow-lg p-8 mb-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>$50M+</div>
              <p className='text-gray-600'>Loans Disbursed</p>
            </div>
            <div>
              <div className='text-4xl font-bold text-green-600 mb-2'>10K+</div>
              <p className='text-gray-600'>Happy Customers</p>
            </div>
            <div>
              <div className='text-4xl font-bold text-purple-600 mb-2'>98%</div>
              <p className='text-gray-600'>Approval Rate</p>
            </div>
          </div>
        </div>

        {/* Loan Types */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Loan Types We Offer
          </h2>
          <p className='text-gray-600 mb-8'>
            Choose from our wide range of loan products designed for your needs
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { name: 'Personal Loan', rate: '3.99%', icon: FiUsers },
              { name: 'Home Loan', rate: '4.25%', icon: FiShield },
              { name: 'Business Loan', rate: '5.49%', icon: FiTrendingUp },
              { name: 'Education Loan', rate: '3.75%', icon: FiCheckCircle },
            ].map((loan, index) => (
              <Card
                key={index}
                className='border-none shadow-md hover:shadow-lg transition-shadow duration-300'
              >
                <CardContent className='p-6 text-center'>
                  <loan.icon className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    {loan.name}
                  </h4>
                  <p className='text-blue-600 font-bold'>
                    Starting at {loan.rate}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
          <p className='text-blue-100 mb-8 text-lg'>
            Join thousands of satisfied customers who trust us with their
            financial needs
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/register'>
              <Button
                size='lg'
                className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold'
              >
                Apply Now - It&apos;s Free!
              </Button>
            </Link>
            <Link href='/login'>
              <Button
                variant='outline'
                size='lg'
                className='border-white hover:text-blue-600  text-blue-600 px-8 py-4 text-lg font-semibold'
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8 mt-16'>
        <div className='container mx-auto px-6 text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <FiDollarSign className='w-6 h-6' />
            <span className='text-xl font-bold'>LoanPro</span>
          </div>
          <p className='text-gray-400'>
            © 2024 LoanPro. All rights reserved. Licensed by Financial
            Authority.
          </p>
        </div>
      </footer>
    </div>
  );
}
