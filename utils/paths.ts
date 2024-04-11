export enum RoleCategories {
  Married = 'Marié',
  Guest = 'Invité',
}

const paths = {
  home: {
    url: '/',
    isAuthenticated: false,
    roleCategories: [],
  },
  login: {
    url: '/login',
    isAuthenticated: false,
    roleCategories: [],
  },
  signIn: {
    url: '/api/auth/signin',
    isAuthenticated: false,
    roleCategories: [],
  },
  guest: {
    url: '/guest',
    isAuthenticated: true,
    roleCategories: [RoleCategories.Married, RoleCategories.Guest],
  },
  married: {
    url: '/married',
    isAuthenticated: true,
    roleCategories: [RoleCategories.Married],
  },
  permission: {
    url: '/permission',
    isAuthenticated: false,
    roleCategories: [],
  },
}

export default paths
