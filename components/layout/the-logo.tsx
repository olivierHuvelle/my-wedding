import Image from 'next/image'
import Logo from '@/public/icon.svg'

export default function TheLogo() {
  return <Image src={Logo} alt="logo" priority={true} width={36} height={36} />
}
