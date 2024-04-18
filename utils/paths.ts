export enum RoleCategories {
  Married = 'Marié',
  Guest = 'Invité',
}

const paths = {
  login: {
    url: '/login',
    isAuthenticated: false,
    text: 'Connexion',
    roleCategories: [],
  },
  signIn: {
    url: '/api/auth/signin',
    isAuthenticated: false,
    text: 'SignIn',
    roleCategories: [],
  },
  guest: {
    url: '/guest',
    isAuthenticated: true,
    text: 'Invité',
    roleCategories: [RoleCategories.Married, RoleCategories.Guest],
  },
  married: {
    url: '/married',
    isAuthenticated: true,
    text: 'Marié',
    roleCategories: [RoleCategories.Married],
  },
  profile: {
    url: '/profile',
    isAuthenticated: true,
    text: 'Profile',
    roleCategories: [RoleCategories.Married, RoleCategories.Guest],
  },
  permission: {
    url: '/permission',
    isAuthenticated: false,
    text: 'Permission',
    roleCategories: [],
  },
}

export default paths
