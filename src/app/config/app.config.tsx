export interface Locale {
  [key: string]: string;
}
export interface Role {
  name: string;
  key: string;
  icon?: string;
  menu: Menu[];
}
export interface ApplicationSetting {
  key: string;
  name: Locale;
  url: string;
  appIcon?: string;
  themeColor?: string;
  roles: Role[];
}

export interface Menu {
  name: string;
  icon?: string;
  url: string;
  external?: boolean;
  subMenu?: Menu[];
}


export const defaultAppSetting: ApplicationSetting = {

  key: 'cs-repository',
  name: { en: 'CS Repository', am: 'CS Repository' },
  url: 'cs-repository',
  roles: [
    {
      name: 'Department Head',
      key: 'department-head',
      menu: [
        { name: 'Home', url: '/' },
        { name: 'Add Resource', url: '/add-resource' },
        { name: 'Add New Resource', url: '/add-new-resource' },
        { name: 'Add Reviewer', url: '/assign-reviewer' },
        { name: 'Review', url: '/review' },
        { name: 'View Resources', url: '/resources' }
      ]
    },

    {
      name: 'Instructor',
      key: 'instructor',
      menu: [
        { name: 'Home', url: '/' },
        { name: 'Add Resource', url: '/add-resource' },
        { name: 'Review', url: '/review' },
        { name: 'View Resources', url: '/resources' }
      ]
    },
    {
      name: 'Reviewer',
      key: 'reviewer',
      menu: [
        { name: 'Home', url: '/' },
        { name: 'Add Resource', url: '/add-resource' },
        { name: 'Review', url: '/review' },
        { name: 'View Resources', url: '/resources' }
      ]
    },
    {
      name: 'Student',
      key: 'student',
      menu: [
        { name: 'Home', url: '/' },
        { name: 'View Resources', url: '/resources' },
      ]
    }
  ]
};
