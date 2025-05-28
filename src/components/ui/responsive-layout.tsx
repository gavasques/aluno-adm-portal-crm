
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SafeArea, SafeHeader, SafeFooter } from './safe-area'
import { useIsMobile } from '@/hooks/use-mobile'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  sidebar?: React.ReactNode
  useSafeArea?: boolean
  mobileFirst?: boolean
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  header,
  footer,
  sidebar,
  useSafeArea = true,
  mobileFirst = true
}) => {
  const isMobile = useIsMobile()
  
  const LayoutWrapper = useSafeArea ? SafeArea : React.Fragment
  const HeaderWrapper = useSafeArea ? SafeHeader : 'header'
  const FooterWrapper = useSafeArea ? SafeFooter : 'footer'
  
  const safeAreaProps = useSafeArea ? {} : undefined

  return (
    <LayoutWrapper {...safeAreaProps}>
      <div className={cn(
        'min-h-screen flex flex-col',
        // Mobile-first responsive design
        mobileFirst && [
          'text-sm sm:text-base',
          'px-4 sm:px-6 lg:px-8',
          'space-y-4 sm:space-y-6 lg:space-y-8'
        ],
        className
      )}>
        {header && (
          <HeaderWrapper className="shrink-0">
            {header}
          </HeaderWrapper>
        )}
        
        <div className="flex-1 flex">
          {sidebar && !isMobile && (
            <aside className="shrink-0 w-64 lg:w-80">
              {sidebar}
            </aside>
          )}
          
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
        
        {footer && (
          <FooterWrapper className="shrink-0">
            {footer}
          </FooterWrapper>
        )}
      </div>
    </LayoutWrapper>
  )
}

// Layout específico para mobile com bottom navigation
export const MobileLayout: React.FC<{
  children: React.ReactNode
  header?: React.ReactNode
  bottomNav?: React.ReactNode
  className?: string
}> = ({ children, header, bottomNav, className }) => {
  return (
    <SafeArea className={cn('min-h-screen flex flex-col', className)}>
      {header && (
        <SafeHeader bottom={false} className="shrink-0 px-4">
          {header}
        </SafeHeader>
      )}
      
      <main className="flex-1 overflow-auto px-4 py-4">
        {children}
      </main>
      
      {bottomNav && (
        <SafeFooter top={false} className="shrink-0 px-4">
          {bottomNav}
        </SafeFooter>
      )}
    </SafeArea>
  )
}
