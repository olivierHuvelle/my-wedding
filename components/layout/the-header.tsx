'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from '@nextui-org/react'
import TheLogo from '@/components/layout/the-logo'
import LogoutForm from '@/components/authentication/logout-form'
import paths from '@/utils/paths'
import { RoleCategories } from '@/utils/paths'

export default function TheHeader() {
  const pathName = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoginPage = pathName === paths.login.url
  const session = useSession()

  const userPaths = Object.values(paths)
    .filter(
      (value) =>
        value.isAuthenticated &&
        !value.isSubMenu &&
        // @ts-expect-error Message
        value.roleCategories.includes(session.data?.user.roleCategory ?? RoleCategories.Guest),
    )
    .map((value) => ({
      url: value.url,
      text: value.text,
    }))

  const logInConditionalRendering = () => {
    if (session.status === 'authenticated') {
      return <LogoutForm />
    }
    return (
      <NavbarItem className={`${isLoginPage ? 'invisible' : ''}`}>
        <Link href={paths.login.url}>Connexion</Link>
      </NavbarItem>
    )
  }

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <TheLogo />
          <p className="font-bold text-inherit">Mariage</p>
        </NavbarBrand>
      </NavbarContent>

      {session.status !== 'loading' && (
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {userPaths.map((userPath) => (
            <NavbarItem key={`${userPath.url}`}>
              <Link
                color={pathName.startsWith(userPath.url) ? 'primary' : 'foreground'}
                className="w-full"
                href={userPath.url}
                size="lg"
              >
                {userPath.text}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      {session.status !== 'loading' && <NavbarContent justify="end">{logInConditionalRendering()}</NavbarContent>}

      {session.status !== 'loading' && (
        <NavbarMenu>
          {userPaths.map((userPath) => (
            <NavbarMenuItem key={`${userPath.url}`}>
              <Link
                color={pathName.startsWith(userPath.url) ? 'primary' : 'foreground'}
                className="w-full"
                href={userPath.url}
                size="lg"
              >
                {userPath.text}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      )}
    </Navbar>
  )
}
