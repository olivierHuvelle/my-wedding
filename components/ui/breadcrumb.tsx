'use client'
import { PathLink } from '@/utils/paths'
import Link from 'next/link'

interface BreadcrumbProps {
  links: PathLink[]
}

export default function Breadcrumb({ links }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="w-max">
      <ol className="flex w-full flex-wrap items-center rounded-md py-2">
        {links.map((link, index) => (
          <li key={index} className="flex cursor-pointer items-center font-sans font-normal leading-normal antialiased">
            <Link
              href={link.url}
              className={index === links.length - 1 ? '' : 'opacity-60'}
              onClick={(e) => {
                if (index === links.length - 1) {
                  e.preventDefault()
                }
              }}
            >
              {link.text}
            </Link>
            {index !== links.length - 1 && (
              <span className="pointer-events-none mx-2 select-none font-sans font-normal leading-normal antialiased">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
