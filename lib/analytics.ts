let sessionId: string | null = null
let sessionStartTime: number | null = null
let lastActivityTime: number | null = null
let pageViewCount = 0

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  if (!sessionId) {
    sessionId = sessionStorage.getItem('analytics_session_id') || 
                `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  
  if (!sessionStartTime) {
    sessionStartTime = Date.now()
    lastActivityTime = Date.now()
  }
  
  return sessionId
}

function updateLastActivity() {
  lastActivityTime = Date.now()
}

export interface TrackEventParams {
  type: 'page_view' | 'product_click' | 'product_view' | 'time_on_page' | 'section_view' | 'button_click' | 'form_submit' | 'scroll_depth'
  productId?: string
  productName?: string
  productSlug?: string
  url?: string
  section?: string
  sectionName?: string
  button?: string
  buttonName?: string
  timeSpent?: number
  scrollDepth?: number
  eventData?: Record<string, any>
}

export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    if (typeof window === 'undefined') return
    
    updateLastActivity()
    
    const eventData = {
      ...params.eventData,
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      timestamp: new Date().toISOString(),
    }
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        sessionId: getSessionId(),
        eventData,
      }),
    }).catch(error => {
      console.debug('Analytics tracking failed:', error)
    })
  } catch (error) {
    console.debug('Analytics tracking error:', error)
  }
}

export function trackPageView() {
  if (typeof window === 'undefined') return
  
  pageViewCount++
  trackEvent({
    type: 'page_view',
    eventData: {
      pageViewCount,
      referrer: document.referrer,
    },
  })
}

let timeTrackingInterval: NodeJS.Timeout | null = null
let timeTrackingStart: number | null = null

export function startTimeTracking() {
  if (typeof window === 'undefined' || timeTrackingInterval) return
  
  timeTrackingStart = Date.now()
  
  timeTrackingInterval = setInterval(() => {
    if (timeTrackingStart) {
      const timeSpent = Math.floor((Date.now() - timeTrackingStart) / 1000)
      trackEvent({
        type: 'time_on_page',
        timeSpent,
      })
    }
  }, 30000)
  
  window.addEventListener('beforeunload', () => {
    if (timeTrackingStart) {
      const timeSpent = Math.floor((Date.now() - timeTrackingStart) / 1000)
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          type: 'time_on_page',
          sessionId: getSessionId(),
          timeSpent,
          eventData: {
            pageUrl: window.location.href,
            pagePath: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        })
        navigator.sendBeacon('/api/analytics/track', data)
      }
    }
  })
}

export function stopTimeTracking() {
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval)
    timeTrackingInterval = null
  }
  
  if (timeTrackingStart) {
    const timeSpent = Math.floor((Date.now() - timeTrackingStart) / 1000)
    trackEvent({
      type: 'time_on_page',
      timeSpent,
    })
    timeTrackingStart = null
  }
}

let maxScrollDepth = 0
let scrollDepthTracked = false

export function trackScrollDepth() {
  if (typeof window === 'undefined' || scrollDepthTracked) return
  
  const trackScroll = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      
      if (scrollDepth >= 25 && scrollDepth < 50 && maxScrollDepth < 50) {
        trackEvent({ type: 'scroll_depth', scrollDepth: 25 })
      } else if (scrollDepth >= 50 && scrollDepth < 75 && maxScrollDepth < 75) {
        trackEvent({ type: 'scroll_depth', scrollDepth: 50 })
      } else if (scrollDepth >= 75 && scrollDepth < 100 && maxScrollDepth < 100) {
        trackEvent({ type: 'scroll_depth', scrollDepth: 75 })
      } else if (scrollDepth >= 100) {
        trackEvent({ type: 'scroll_depth', scrollDepth: 100 })
        scrollDepthTracked = true
        window.removeEventListener('scroll', trackScroll)
      }
    }
  }
  
  window.addEventListener('scroll', trackScroll, { passive: true })
}

export function trackProductClick(productId: string, productName: string, productSlug?: string, url?: string) {
  trackEvent({
    type: 'product_click',
    productId,
    productName,
    productSlug,
    url,
  })
}

export function trackProductView(productId: string, productName: string, productSlug?: string) {
  trackEvent({
    type: 'product_view',
    productId,
    productName,
    productSlug,
  })
}

export function trackButtonClick(button: string, section?: string) {
  trackEvent({
    type: 'button_click',
    button,
    buttonName: button,
    section,
    sectionName: section,
  })
}

export function trackSectionView(section: string) {
  trackEvent({
    type: 'section_view',
    section,
    sectionName: section,
  })
}

export function trackFormSubmit(formName: string, section?: string) {
  trackEvent({
    type: 'form_submit',
    buttonName: formName,
    section,
    sectionName: section,
  })
}

export function trackExternalLink(url: string, section?: string) {
  trackEvent({
    type: 'button_click',
    button: 'external_link',
    buttonName: 'Link Externo',
    url,
    section,
    sectionName: section,
  })
}

