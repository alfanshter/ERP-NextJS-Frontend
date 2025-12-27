import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { SUPERADMIN_MASTER, SUPERADMIN_STAFF, ADMIN, MANAGER } from '@/constants/roles.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        subMenu: [],
    },
    {
        key: 'users',
        path: '/users',
        title: 'Users',
        translateKey: 'nav.users',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN_MASTER],
        subMenu: [],
    },
    {
        key: 'employees',
        path: '/employees',
        title: 'Employees',
        translateKey: 'nav.employees',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, MANAGER],
        subMenu: [],
    },
    {
        key: 'company',
        path: '/company',
        title: 'Company',
        translateKey: 'nav.company',
        icon: 'building',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        subMenu: [],
    },
    {
        key: 'pricing-plans',
        path: '/pricing-plans',
        title: 'Pricing Plans',
        translateKey: 'nav.pricingPlans',
        icon: 'creditCard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        subMenu: [],
    },
]

export default navigationConfig
