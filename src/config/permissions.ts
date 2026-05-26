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
    '/reports/low-stock',
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
    '/inventory-reports',
    '/reports',
    '/reports/low-stock'

  ],

  manager: [

    '/dashboard',
    '/inventory',
    '/sales-history',
    '/services',
    '/reports',
    '/reports/sales',
    '/reports/low-stock',
    '/profile',
    '/inventory-reports',
    '/finance'

  ]

};