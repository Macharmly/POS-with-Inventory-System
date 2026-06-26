export const rolePermissions = {

  admin: [

    '/dashboard',
    '/pos',
    '/inventory',
    '/restock',
    '/inventory-adjustment',
    '/sales-history',
    '/sales/:id',
    '/services',
    '/reports',
    '/reports/sales',
    '/reports/low-stock',
    '/reports/product-performance',
    '/reports/services',
    '/users',
    '/logs',
    '/profile',
    '/inventory-reports',
    '/reports/profit',
    '/finance',
    '/store-settings'

  ],

  cashier: [

    '/dashboard',
    '/pos',
    '/sales-history',
    '/sales/:id',
    '/profile',
    '/inventory-reports',
    '/finance'

  ],

  inventory: [

    '/dashboard',
    '/inventory',
    '/restock',
    '/inventory-adjustment',
    '/profile',
    '/inventory-reports',
    '/reports',
    '/reports/low-stock',
    '/reports/product-performance'

  ],

  manager: [

    '/dashboard',
    '/inventory',
    '/sales-history',
    '/sales/:id',
    '/services',
    '/reports',
    '/reports/sales',
    '/reports/low-stock',
    '/reports/product-performance',
    '/reports/services',
    '/profile',
    '/inventory-reports',
    '/reports/profit',
    '/finance'

  ]

};