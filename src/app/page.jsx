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
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <FiDollarSign className='w-6 h-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold text-foreground'>LoanPro</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Link href='/login'>
                <Button
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Login
                </Button>
              </Link>
              <Link href='/register'>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-6'>
        <section className='py-20 text-center'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight'>
              Your Dream Loan
              <span className='block text-primary'>Made Simple</span>
            </h1>
            <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed'>
              Fast, secure, and transparent loan processing. Get approved in
              minutes with competitive rates and flexible terms tailored to your
              needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link href='/register'>
                <Button size='lg' className='px-8 py-6 text-lg font-semibold'>
                  Apply for Loan
                  <FiArrowRight className='ml-2 w-5 h-5' />
                </Button>
              </Link>
              <Link href='/login'>
                <Button
                  variant='outline'
                  size='lg'
                  className='px-8 py-6 text-lg font-semibold'
                >
                  Login to Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='border-border hover:shadow-lg transition-all duration-300 hover:scale-105'>
              <CardContent className='p-8 text-center'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <FiClock className='w-8 h-8 text-primary' />
                </div>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Quick Approval
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Get your loan approved in as little as 24 hours with our
                  streamlined digital process.
                </p>
              </CardContent>
            </Card>

            <Card className='border-border hover:shadow-lg transition-all duration-300 hover:scale-105'>
              <CardContent className='p-8 text-center'>
                <div className='w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <FiShield className='w-8 h-8 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  100% Secure
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Your data is protected with bank-level security and encryption
                  technology.
                </p>
              </CardContent>
            </Card>

            <Card className='border-border hover:shadow-lg transition-all duration-300 hover:scale-105'>
              <CardContent className='p-8 text-center'>
                <div className='w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <FiTrendingUp className='w-8 h-8 text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  Best Rates
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Competitive interest rates starting from 3.99% APR with
                  flexible repayment terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className='py-16'>
          <Card className='border-border'>
            <CardContent className='p-12'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                <div className='space-y-2'>
                  <div className='text-4xl font-bold text-primary'>$50M+</div>
                  <p className='text-muted-foreground'>Loans Disbursed</p>
                </div>
                <div className='space-y-2'>
                  <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                    10K+
                  </div>
                  <p className='text-muted-foreground'>Happy Customers</p>
                </div>
                <div className='space-y-2'>
                  <div className='text-4xl font-bold text-purple-600 dark:text-purple-400'>
                    98%
                  </div>
                  <p className='text-muted-foreground'>Approval Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Loan Types */}
        <section className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Loan Types We Offer
            </h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Choose from our wide range of loan products designed for your
              specific needs
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                name: 'Personal Loan',
                rate: '3.99%',
                icon: FiUsers,
                bgColor: 'bg-blue-500/10',
                iconColor: 'text-blue-600 dark:text-blue-400',
              },
              {
                name: 'Home Loan',
                rate: '4.25%',
                icon: FiShield,
                bgColor: 'bg-green-500/10',
                iconColor: 'text-green-600 dark:text-green-400',
              },
              {
                name: 'Business Loan',
                rate: '5.49%',
                icon: FiTrendingUp,
                bgColor: 'bg-purple-500/10',
                iconColor: 'text-purple-600 dark:text-purple-400',
              },
              {
                name: 'Education Loan',
                rate: '3.75%',
                icon: FiCheckCircle,
                bgColor: 'bg-orange-500/10',
                iconColor: 'text-orange-600 dark:text-orange-400',
              },
            ].map((loan, index) => (
              <Card
                key={index}
                className='border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer'
              >
                <CardContent className='p-6 text-center'>
                  <div
                    className={`w-12 h-12 ${loan.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <loan.icon className={`w-6 h-6 ${loan.iconColor}`} />
                  </div>
                  <h4 className='font-semibold text-foreground mb-2'>
                    {loan.name}
                  </h4>
                  <p className='text-primary font-bold'>
                    Starting at {loan.rate}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16'>
          <Card className='border-border bg-primary text-primary-foreground overflow-hidden relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary to-primary/80'></div>
            <CardContent className='relative z-10 p-12 text-center'>
              <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
              <p className='text-primary-foreground/80 mb-8 text-lg max-w-2xl mx-auto'>
                Join thousands of satisfied customers who trust us with their
                financial needs
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/register'>
                  <Button
                    size='lg'
                    variant='secondary'
                    className='px-8 py-6 text-lg font-semibold bg-background text-foreground hover:bg-background/90'
                  >
                    Apply Now - It&apos;s Free!
                  </Button>
                </Link>
                <Link href='/login'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='px-8 py-6 text-lg font-semibold border-primary-foreground/20 text-secondary-foreground hover:bg-primary-foreground/10
                    hover:text-primary-foreground'
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-border bg-muted/30 mt-20'>
        <div className='container mx-auto px-6 py-8'>
          <div className='text-center'>
            <div className='flex items-center justify-center space-x-2 mb-4'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <FiDollarSign className='w-5 h-5 text-primary' />
              </div>
              <span className='text-xl font-bold text-foreground'>LoanPro</span>
            </div>
            <p className='text-muted-foreground'>
              © 2024 LoanPro. All rights reserved. Licensed by Financial
              Authority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
