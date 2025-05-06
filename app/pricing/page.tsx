'use client'

import { useState, useEffect } from 'react'
import $api from '@/lib/http'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const PLANS = [
	{
		name: 'Starter - Free',
		tier: 'FREE',
		price: '$0',
		period: '/month',
		description: 'Try the core features with no commitment.',
		includes: [
			{
				title: '🎬 1 Free Clip Conversion',
				description: ' - Experience the workflow with no strings attached',
			},
			{
				title: '📹 480p Export Quality',
				description: ' - Fast, lightweight previews perfect for testing',
			},
			{
				title: '🎮 Access to 1 Gameplay Template',
				description: ' - Try out our viral gameplay overlay',
			},
			{
				title: '🔥 AI-Generated Hashtags',
				description: ' - Get optimized tags to boost your first post',
			},
		],
		attractiveInfo:
			'🚀 Ready to go unlimited? Upgrade to Pro or Premium anytime.',
		buttonText: 'Get Started',
		endpoint: null,
	},
	{
		name: 'Pro',
		tier: 'PRO',
		price: '$19',
		period: '/month',
		description:
			'For solo creators looking to automate and grow their short-form content.',
		includes: [
			{
				title: '🎬 Unlimited Clip Generation',
				description: ' - Create as many clips as you want, no monthly limits',
			},
			{
				title: '✂️ Basic AI Smart Splitting',
				description: ' - Automatically detects key moments to clip',
			},
			{
				title: '📺 Up to 3 Clips Per Session',
				description: ' - Generate multiple clips at once',
			},
			{
				title: '🎮 Access to 5 Gameplay Templates',
				description: ' - Choose from viral-ready gameplay overlays',
			},
			{
				title: '📹 720p Max Export Resolution',
				description: ' - Optimized for TikTok and Reels',
			},
			{
				title: '📏 Supports YouTube Videos up to 15 Minutes Long',
			},
			{
				title: '🔥 Auto-Generated Hashtags',
				description: ' - Boost your reach with trending, tailored tags',
			},
		],
		buttonText: 'Get Started',
		endpoint: '/pro-link',
	},
	{
		name: 'Premium',
		tier: 'PREMIUM',
		price: '$29',
		period: '/month',
		description:
			'For power users and agencies who want full creative control and maximum output. \n\nEverything in Pro, plus:',
		includes: [
			{
				title: '✂️ Advanced AI Smart Splitting',
				description: ' - Better scene detection for higher-impact clips',
			},
			{
				title: '📺 Up to 5 Clips Per Session',
				description: ' - Speed up your workflow with batch processing',
			},
			{
				title: '🎮 Access to 10 Gameplay Templates',
				description: ' - More variety to match your niche or audience',
			},
			{
				title: '📹 1080p Max Export Resolution',
				description: ' - High-definition clips for a professional look',
			},
			{
				title: '📏 Supports YouTube Videos up to 30 Minutes Long',
			},
			{
				title: '🔥 Auto-Generated Hashtags for Virality',
				description: ' - Smarter tags based on video context and trends',
			},
		],
		buttonText: 'Get Started',
		endpoint: '/premium-link',
	},
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: 'UNKNOWN' | 'CANCELLED' | 'ACTIVE'
    message: string
  } | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { isAuthenticated, tier: authTier, login } = useAuth()
  const { toast } = useToast()
  const tier = authTier

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      console.log('[PricingPage] Checking conditions for fetching subscription status:', {
        isAuthenticated,
        tier,
      })
      if (!isAuthenticated || tier === 'FREE') {
        console.log('[PricingPage] Skipping subscription status fetch for non-authenticated or FREE tier user')
        setSubscriptionStatus(null)
        return
      }

      try {
        console.log('[PricingPage] Fetching subscription status from /status-subscription')
        const response = await $api.get('/status-subscription')
        console.log('[PricingPage] Subscription status received:', response.data)
        setSubscriptionStatus({
          status: response.data.status,
          message: response.data.message
        })
      } catch (error: any) {
        console.error('[PricingPage] Error fetching subscription status:', error.response?.data || error.message)
        if (tier === 'PRO' || tier === 'PREMIUM') {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.response?.data?.message || 'Failed to fetch subscription status.',
          })
        }
        setSubscriptionStatus(null)
      }
    }

    fetchSubscriptionStatus()
  }, [isAuthenticated, tier, toast])

  const syncUserData = async () => {
    try {
      console.log('[PricingPage] Syncing user data after cancellation')
      const response = await $api.get('/user/me')
      const { email, tier, hasOneFreeConversion } = response.data.user_details || response.data
      const hasOneFreeConversionBool = hasOneFreeConversion === 'true' || hasOneFreeConversion === true
      console.log('[PricingPage] User data synced:', {
        email,
        tier,
        hasOneFreeConversion: hasOneFreeConversionBool,
      })

      localStorage.setItem('userEmail', email)
      localStorage.setItem('tier', tier)
      localStorage.setItem('hasOneFreeConversion', String(hasOneFreeConversionBool))
      await login(
        localStorage.getItem('accessToken')!,
        localStorage.getItem('refreshToken')!,
        email,
        tier,
        hasOneFreeConversionBool
      )
    } catch (error: any) {
      console.error('[PricingPage] Error syncing user data:', error.response?.data || error.message)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sync user data. Please try logging in again.',
      })
      throw error // Rethrow to handle in the calling function
    }
  }

  const handlePayment = async (endpoint: string | null) => {
    if (!endpoint) return

    setLoading(endpoint)
    try {
      console.log('[PricingPage] Initiating payment for:', endpoint)
      const response = await $api.get(endpoint)
      const url = response.data
      if (url) {
        window.open(url, '_blank') // Open in new tab
      } else {
        console.error('[PricingPage] No checkout URL returned')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to initiate payment. Please try again.',
        })
      }
    } catch (error: any) {
      console.error('[PricingPage] Payment initiation failed:', error.response?.data || error.message)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
      })
    } finally {
      setLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (tier === 'FREE') {
      toast({
        variant: 'destructive',
        title: 'No Subscription',
        description: 'You do not have an active subscription to cancel.',
      })
      return
    }

    setShowCancelConfirm(true)
  }

  const confirmCancelSubscription = async () => {
    setLoading('cancel')
    setShowCancelConfirm(false)
    try {
      console.log('[PricingPage] Sending cancel subscription request')
      const response = await $api.post('/cancel-subscription')
      console.log('[PricingPage] Cancel subscription response:', response.data)
      toast({
        title: 'Success',
        description: response.data.message || 'Your subscription has been cancelled.',
      })

      try {
        await syncUserData()
      } catch (syncError) {
        // Handle sync error but don't fail the cancellation
        console.error('[PricingPage] Sync error after cancellation, continuing:', syncError)
      }

      // Update subscription status
      try {
        const statusResponse = await $api.get('/status-subscription')
        setSubscriptionStatus({
          status: statusResponse.data.status,
          message: statusResponse.data.message
        })
      } catch (error: any) {
        console.error('[PricingPage] Error updating subscription status:', error.response?.data || error.message)
        setSubscriptionStatus(null)
      }
    } catch (error: any) {
      console.error('[PricingPage] Cancel subscription failed:', error.response?.data || error.message)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel subscription. Please try again.',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className='min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12'>
      <div className='absolute inset-0 w-full h-full'>
        <div className='absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <div className='py-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-center gradient-text mb-4'>
            Turn YouTube into TikTok Gold
          </h1>
       
          {isAuthenticated && subscriptionStatus?.message && (
            <p className='text-center text-muted-foreground max-w-2xl mx-auto mt-4'>
              Subscription Status: {subscriptionStatus.message}
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1440px] mx-auto'>
          {PLANS.map(plan => {
            const isCurrentPlan = plan.tier === tier
            const isPaidPlan = plan.tier === 'PRO' || plan.tier === 'PREMIUM'
            const canCancel = isAuthenticated && 
                            isPaidPlan && 
                            isCurrentPlan && 
                            subscriptionStatus?.status === 'ACTIVE'

            console.log('[PricingPage] Plan check:', {
              plan: plan.name,
              isAuthenticated,
              isPaidPlan,
              isCurrentPlan,
              subscriptionStatus,
              canCancel,
            })

            return (
              <div
                key={plan.name}
                className='group relative bg-secondary/50 rounded-xl p-6 backdrop-blur-sm border border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 hover:scale-105'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='relative flex flex-col justify-between h-full'>
                  <div>
                    <h2 className='text-2xl font-semibold text-white mb-2'>
                      {plan.name}
                    </h2>
                    <p className='text-muted-foreground mb-2'>
                      {plan.description}
                    </p>
                  </div>

                  <div className='max-lg:mb-4'>
                    <div className='text-3xl font-bold text-white mb-4'>
                      {plan.price}
                      <span className='text-lg font-normal text-muted-foreground'>
                        {plan.period}
                      </span>
                    </div>
                    <ul className='space-y-4 mb-6'>
                      {plan.includes.map(item => (
                        <li
                          key={item.title}
                          className='text-muted-foreground flex items-center justify-start'
                        >
                          <p className='font-normal'>
                            <span className='font-bold'>{item.title}</span>
                            {item.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                    {plan.attractiveInfo && (
                      <p className='font-semibold'>{plan.attractiveInfo}</p>
                    )}
                  </div>
                  <div className='flex flex-col gap-4'>
                    <button
                      onClick={() => handlePayment(plan.endpoint)}
                      disabled={
                        !plan.endpoint ||
                        loading === plan.endpoint ||
                        isCurrentPlan
                      }
                      className='w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50'
                    >
                      {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                    </button>
                    {canCancel && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={loading === 'cancel'}
                        className='w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:from-red-600 hover:to-red-800 transition disabled:opacity-50'
                      >
                        {loading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Confirmation Dialog */}
        {showCancelConfirm && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-background rounded-lg p-6 max-w-md w-full'>
              <h2 className='text-xl font-semibold mb-4'>Confirm Cancellation</h2>
              <p className='text-muted-foreground mb-6'>
                Are you sure you want to cancel your subscription? You&apos;ll continue to enjoy all benefits until the end of your current billing period.
              </p>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className='px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80'
                >
                  Keep Subscription
                </button>
                <button
                  onClick={confirmCancelSubscription}
                  className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600'
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}