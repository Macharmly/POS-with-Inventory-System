export const rolePermissions = {

  admin: [

    '/dashboard',
    '/pos',
    '/inventory',
    '/restock',
    '/inventory-adjustment',
    '/sales-history',
    '/services',
    '/reports',
    '/reports/sales',
    '/users',
    '/profile',
    '/inventory-reports',
    '/finance'

  ],

  cashier: [

    '/dashboard',
    '/pos',
    '/sales-history',
    '/profile',
    '/inventory-reports',
    '/finance'

  ],

  inventory_staff: [

    '/dashboard',
    '/inventory',
    '/restock',
    '/inventory-adjustment',
    '/profile',
    '/inventory-reports'

  ],

  manager: [

    '/dashboard',
    '/inventory',
    '/sales-history',
    '/services',
    '/reports',
    '/reports/sales',
    '/profile',
    '/inventory-reports',
    '/finance',

  ]

};