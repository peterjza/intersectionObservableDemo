import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

export default function NameDisplay({recipients}: {recipients: string[]}) {

  const [recipientCount, setRecipientCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const intersectionObserverOptions = {
    rootMargin: '0px -20px 0px 0px',
    threshold: 1.0,
  }

  const toggleIntersecting = (entry: IntersectionObserverEntry) => {
    const { target, isIntersecting } = entry

    isIntersecting
      ? target.classList.add('intersecting')
      : target.classList.remove('intersecting')
  }

  const countRecipients = () => {
    if (containerRef.current) {
      const count = Array
          .from(containerRef.current.children)
          .filter((child, index) => index === 0 || !child.classList.contains('intersecting'))
          .length - 1

      setRecipientCount(count)
    }
  }

  const intersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => toggleIntersecting(entry))
    countRecipients()
  }

  const setObserver = () => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children) as HTMLElement[]

      const observer = new IntersectionObserver(intersectionObserverCallback, {
        ...intersectionObserverOptions,
        root: containerRef.current.parentElement
      })

      children.forEach(child => observer.observe(child))

      return observer
    }
  }

  useEffect(() => {
    const observer = setObserver()
    return () => observer?.disconnect()
  }, [])

  return (
    <NameContainer>
      <div ref={containerRef} className="recipients">
        {recipients.map((recipient: string, index: number) => (
          <span key={index}>
            {recipient}
            {recipients.length > 1 && index !== recipients.length - 1 && ', '}
            <i>
              {' '}
              {recipients.length > 1 &&
                index !== recipients.length - 1 &&
                '...'}{' '}
            </i>
          </span>
        ))}
      </div>
      {recipientCount > 0 && (
        <div className={`count ${recipients.length > 1 ? 'show' : ''}`}>
          {`+${recipientCount}`}
        </div>
      )}
    </NameContainer>
  )
}

const NameContainer = styled.div`
  position: relative;

  div.recipients {
    text-overflow: ellipsis;

    .intersecting {
      visibility: visible;

      &:has(~ .intersecting) i {
        display: none;
      }
    }

    span {
      visibility: hidden;

      &:first-of-type {
        visibility: visible;
      }
    }

    &:has(> span:only-child) {
      padding-right: 0px !important;
    }

    &:not(:has(> span.intersecting)) {
      overflow: hidden;
      padding-right: 25px;
    }
  }

  div.count {
    font-size: 16px;
    color: #f0f0f0;
    background-color: #2f312f;
    border-radius: 3px;
    padding: 2px 5px;
    position: absolute;
    right: -5px;
    top: -2px;
    display: none;

    &.show {
      display: block;
    }
  }
`
