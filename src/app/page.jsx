'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FiLoader,
} from 'react-icons/fi';
import { useGetUserLoanTypesQuery } from '@/lib/store/authApi';

export default function Home() {
  const router = useRouter();

  // ✅ Fetch real loan types from API
  const {
    data: loanTypesData,
    isLoading: loanTypesLoading,
    error: loanTypesError,
  } = useGetUserLoanTypesQuery();

  console.log('Loan Types Data:', loanTypesData);
  console.log('Loan Types Loading:', loanTypesLoading);
  console.log('Loan Types Error:', loanTypesError);

  // ✅ Icon mapping for real loan types
  const getIconForLoanType = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('personal')) return FiUsers;
    if (lowerName.includes('home') || lowerName.includes('house'))
      return FiShield;
    if (lowerName.includes('business') || lowerName.includes('commercial'))
      return FiTrendingUp;
    if (lowerName.includes('education') || lowerName.includes('student'))
      return FiCheckCircle;
    if (lowerName.includes('car') || lowerName.includes('auto')) return FiClock;
    // ✅ Default icon for unknown types (like "Shahzaib")
    return FiDollarSign;
  };

  // ✅ Color mapping for real loan types
  const getColorsForLoanType = (index) => {
    const colors = [
      {
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        bgColor: 'bg-green-500/10',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      {
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        bgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-600 dark:text-orange-400',
      },
      {
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-600 dark:text-red-400',
      },
      {
        bgColor: 'bg-indigo-500/10',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
      },
    ];
    return colors[index % colors.length];
  };

  // ✅ Handle loan type card click - redirect to login
  const handleLoanTypeClick = (loanType) => {
    console.log('Clicked loan type:', loanType);
    router.push('/login');
  };

  // ✅ Transform API data to display format (no fallback)
  const displayLoanTypes = loanTypesData
    ? loanTypesData.map((loanType, index) => ({
        id: loanType.id,
        name: loanType.name,
        interest_rate: loanType.interest_rate,
        icon: getIconForLoanType(loanType.name),
        ...getColorsForLoanType(index),
      }))
    : [];

  // ✅ Loan Types Section Component
  const LoanTypesSection = () => {
    if (loanTypesLoading) {
      return (
        <section className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Loan Types We Offer
            </h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Loading our loan products...
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index} className='border-border'>
                <CardContent className='p-6 text-center'>
                  <div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4'>
                    <FiLoader className='w-6 h-6 animate-spin text-muted-foreground' />
                  </div>
                  <div className='h-4 bg-muted rounded mb-2'></div>
                  <div className='h-3 bg-muted rounded w-20 mx-auto'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      );
    }

    if (loanTypesError || !loanTypesData || loanTypesData.length === 0) {
      return (
        <section className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Loan Types We Offer
            </h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Unable to load loan types at the moment.
            </p>
          </div>
        </section>
      );
    }

    return (
      <section className='py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-foreground mb-4'>
            Loan Types We Offer
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Choose from our wide range of loan products designed for your
            specific needs
          </p>
          <p className='text-sm text-muted-foreground mt-2'>
            Click on any loan type to get started
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {displayLoanTypes.map((loan, index) => (
            <Card
              key={loan.id}
              className='border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer'
              onClick={() => handleLoanTypeClick(loan)}
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
                  {loan.interest_rate}% Interest Rate
                </p>
                <div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <p className='text-xs text-muted-foreground'>
                    Click to apply →
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };

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

        {/* ✅ Dynamic Loan Types Section */}
        <LoanTypesSection />

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
