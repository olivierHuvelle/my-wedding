export enum RoleCategories {
  Married = 'Marié',
  Guest = 'Invité',
}

const paths = {
  login: {
    url: '/login',
    isAuthenticated: false,
    text: 'Connexion',
    isSubMenu: false,
    roleCategories: [],
  },
  signIn: {
    url: '/api/auth/signin',
    isAuthenticated: false,
    text: 'SignIn',
    isSubMenu: false,
    roleCategories: [],
  },
  guest: {
    url: '/guest',
    isAuthenticated: true,
    text: 'Invité',
    isSubMenu: false,
    roleCategories: [RoleCategories.Married, RoleCategories.Guest],
  },
  married: {
    url: '/married',
    isAuthenticated: true,
    text: 'Marié',
    isSubMenu: false,
    roleCategories: [RoleCategories.Married],
  },
  profile: {
    url: '/profile',
    isAuthenticated: true,
    text: 'Profile',
    isSubMenu: false,
    roleCategories: [RoleCategories.Married, RoleCategories.Guest],
  },
  permission: {
    url: '/permission',
    isAuthenticated: false,
    text: 'Permission',
    isSubMenu: false,
    roleCategories: [],
  },
  event: {
    url: '/married/event/',
    isAuthenticated: true,
    text: 'Evénement',
    isSubMenu: true,
    roleCategories: [RoleCategories.Married],
  },
  users: {
    url: '/married/user',
    isAuthenticated: true,
    text: 'Utilisateurs',
    isSubMenu: true,
    roleCategories: [RoleCategories.Married],
  },
  marriedGuest: {
    url: '/married/guest/',
    isAuthenticated: true,
    text: 'Invité',
    isSubMenu: true,
    roleCategories: [RoleCategories.Married],
  },
}

export default paths

export interface PathLink {
  url: string
  text: string
}
