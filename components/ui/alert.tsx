/*
        https://codepen.io/oidre/pen/vYGBaVZ
 */

import { MdOutlineError } from 'react-icons/md'
import { CiCircleCheck } from 'react-icons/ci'

interface AlertProps {
  title: string
  content: string | string[]
  className?: string
  variant: 'success' | 'danger'
}

interface AlertColorClasses {
  bgColor: string
  iconColor: string
  titleColor: string
  contentColor: string
}

export default function Alert({ title, content, className, variant }: AlertProps) {
  const colorVariantMapper = {
    danger: {
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500',
      titleColor: 'text-red-700',
      contentColor: 'text-red-600',
    },
    success: {
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
      titleColor: 'text-green-700',
      contentColor: 'text-green-600',
    },
  }

  const colors: AlertColorClasses = colorVariantMapper[variant]

  const iconVariantMapper = {
    danger: <MdOutlineError size={25} className={`flex-none fill-current ${colors.iconColor}`} />,
    success: <CiCircleCheck size={25} className={`flex-none fill-current ${colors.iconColor}`} />,
  }

  const contentRender = () => {
    if (typeof content === 'string') {
      return content
    }
    return (
      <ul>
        {content.map((contentElement) => (
          <li key={contentElement}>{contentElement}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className={`${colors.bgColor} w-full rounded-2xl p-5 ${className ?? ''}`}>
      <div className="flex space-x-3">
        {iconVariantMapper[variant]}

        <div className="flex flex-col space-y-2 leading-tight">
          <div className={`text-sm font-medium ${colors.titleColor}`}>{title}</div>
          <div className={`flex-1 text-sm leading-snug ${colors.contentColor}`}>{contentRender()}</div>
        </div>
      </div>
    </div>
  )
}
