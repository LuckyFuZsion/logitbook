import type { CSSProperties, ReactNode } from 'react'

export function SectionHeading({
  as = 'h2',
  id,
  className,
  style,
  children,
}: {
  as?: 'h1' | 'h2'
  id: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const Tag = as
  return (
    <Tag id={id} className={className} style={style}>
      {children}
    </Tag>
  )
}
